'use strict'

exports.gameWordle = (req, res, next) => {
    (async () => { 

        //Get User Authentication
        let token_code = req.headers[myConfig.header_key]
        let token_data = await req.queries('token').check(req.db, token_code)
        let user_id = null
        let user = null
        

        if (token_data && token_data.token_profile.user_id) {
            user_id = token_data.token_profile.user_id
            user = await req.queries('user').get_user_by_id(req.db, user_id)
        } else {
            return res.error("Please Login first")
        }   
        
        //Get answer from request
        //Uppercase it to prevent it from any error , either make the answer & the result uppercase or lowercase
        let answer = req.body.word.toUpperCase()
        
        //Validate the answet to only letter .
        for(let i in answer){
            if (!/[a-zA-Z]/.test(answer[i])) {
                res.error('Hanya Boleh Memasukkan Huruf')
                return
            }
        }
        //Get result in Database
        let using_wordle = await req.queries('master_wordle').getWordle(req.db,article_list.id)
        //My projects has 2 Level of wordle
        let wordle = ""
        if(req.body.level == 1){
             wordle = using_wordle.word
        }else if(req.body.level == 2){
             wordle = using_wordle.word_2
        }

        //Create array to hold the green,yellow and red
        let correct = []
        let almost = []
        let wrong = []
        //Flagging if you have correct answer
        let success_counter = 0
        let is_success = false

        let ress = {
            code: 200,
            message: "success",
          };

        //Check Word Length
        if(req.body.level == 1){ 
            if(answer.length < 5 || answer.length > 5){
                res.error("Word Level 1 harus 5 kata")
                return
            }
        }else if (req.body.level == 2){      
            if(answer.length < 5 || answer.length > 5){
                res.error("Word Level 2 harus 5 kata")
                return
            }
        }
        let empty = ""
        // Checking Each Word
        for(let i = 0; i < answer.length; i++){

            if(answer[i] == wordle[i]){
                correct.push(answer[i])
                success_counter += 1 
            }else if(wordle.indexOf(answer[i]) != -1){
                correct.push(empty)
                almost.push(answer[i])
            }else {
                correct.push(empty)
                wrong.push(answer[i])
            }
        }
        ress.correct = correct;
        ress.almost = almost
        ress.wrong = wrong
        //Check Success Rate
        if(req.body.level == 1){
            if(success_counter == 5){
                //Message
                ress.message = "You Have succeded"
                is_success = true
                ress.is_success = is_success

            }else {
                //Message
                ress.message = "Try Again"
                ress.is_success = is_success
            }
        }else if (req.body.level == 2){
            if(success_counter == 5){
                //Message
                ress.message = "You Have succeded"
                is_success = true
                ress.is_success = is_success
                //check if the user ever played wordle
                let check_wordle_log = await req.queries("wordle_log").checkWordleLog(req.db,using_wordle.id,article_list.id,user_id)
                if(!check_wordle_log){
                    let data = {
                        user_id : user_id,
                        master_wordle_id : using_wordle.id,
                        article_id : article_list.id
                    }
                    await req.queries('wordle_log').addWordleLog(req.db,data)
                }
            }else {
                //Message
                ress.message = "Try Again"
                ress.is_success = is_success
            }
        }
        return res.success(ress)
    })().catch(next);
}
