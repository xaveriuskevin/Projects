'use strict'

const string_id = require('../lib/string');

exports.doNewMgmLog = (req, res, next) => {
  (async () => {

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

    //set up return template
    let ress = {
      code: 200,
      message: 'success'
    }
    //check if user already exist in database
    let cek_mgm = await req.queries('mgm').checkMGM(req.db,user.spice_id)

    if(!cek_mgm){
      // if user dont exist in database, create user referral unique code
      let unique_code = await string_id.makeid(6)
      //create url for this user to share to his companion for referral point
      let url = myConfig.client_url +"/"+ unique_code +"/" + user.spice_id
      let data = {
        spice_id : user.spice_id,
        unique_code : unique_code,
        url_mgm : url
      }
      // Log the user and the new referral unique code
      await req.queries('mgm').loggingMgm(req.db,data)
      ress.url = url

      return res.success(ress)
    } else {
      // if user already exist in database, find the friends that have been invited
      let friend_list = await req.queries('mgm').findFriendsInvited(req.db,user.spice_id)
      // reformat friends name , for privacy purposes
      if(friend_list){
          for(let i in friend_list){
            friend_list[i].fullname = req.lib('password').decryptAes256iv(friend_list[i].fullname)
            friend_list[i].hidename = req.lib('password').decryptAes256iv(friend_list[i].hidename)
            friend_list[i].hidename = await string_id.hidename(friend_list[i].hidename)
          }}

      return res.success({
        code: 200,
        message: "Succeed",
        url : cek_mgm.url_mgm,
        friend : friend_list
      })
    }
  })().catch(next);
}

exports.doGetMgmLeaderboards = (req, res, next) => {
  (async () => {

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
    //For leaderboard , show how many users have invited , min 1
    let count_leaderboard = await req.queries('mgm').getTotalUser(req.db)
    let total = count_leaderboard[0].total

    //For this specific users, show how many users have invited , min 1
    let friends_invited = await req.queries('mgm').findFriendsInvitedLeaderboard(req.db,user.spice_id)
    let invited = friends_invited[0].total

    let position = null
    //Get Leaderboard List
    let leaderboard = await req.queries('mgm').rankLeaderboards(req.db)
    if(leaderboard){
      for(let i in leaderboard){
        leaderboard[i].fullname = req.lib('password').decryptAes256iv(leaderboard[i].fullname)
        leaderboard[i].hidename = req.lib('password').decryptAes256iv(leaderboard[i].hidename)
        leaderboard[i].hidename = await string_id.hidename(leaderboard[i].hidename)
      }
    }
    //Get position for the specific user in this leaderboard
    let position_leaderboard = await req.queries('mgm').positionLeaderboards(req.db)
    if(position_leaderboard){
      for(let i in position_leaderboard){
        if(position_leaderboard[i].spice_id === user.spice_id){
          position = parseInt(i) + 1
        }
      }
    }

    return res.success({
      code: 200,
      message: "Succeed",
      position : position,
      total : total,
      friend : invited,
      rank : leaderboard
    })

   })().catch(next)
}
// log ke MGM leaderboard
exports.doLogMGMLeaderboard = (req, res, next) => { 
  (async () => {
    // invitee id
    let param = [{
      name: 'spice_id',
      rules: [
        'required'
      ]
    }]

    req.validate(req, param)

    let sess = await getSession();

    let url = req.body.url ? req.body.url : ''
    let token_code = req.headers[myConfig.header_key]
    let token_data = await req.queries('token').check(req.db, token_code)
    let user_id = null
    let user = null
    if (token_data && token_data.token_profile.user_id) {

      user_id = token_data.token_profile.user_id
      user = await req.queries('user').get_user_by_id(req.db, user_id, true)
    } else {
      return res.error("Please Login first")
    }

    // Notes :
    // req.body.spice_id is the inviter
    // user.spice_id is the invitee

    //Make sure the id user invited is exist in database or he invited herself
    let check_spice_id = await req.queries('user').get_user_by_spiceid(req.db, req.body.spice_id)
    if (!check_spice_id) {
      return res.error('spice_id tidak terdaftar')
    } else if (user.spice_id == req.body.spice_id) {
      return res.error('lo tidak boleh memasukan spice id sendiri')
    } else {
      let ress = {
        code: 200,
        message: 'success insert log'
      }
      let cek_both_spice = await req.queries('mgm').get_spice_id_recruit(req.db, req.body.spice_id , user.spice_id);
      let invited = await req.queries('mgm').get_spice_id_recruit_only(req.db, user.spice_id)
      let cek_mgm = await req.queries('mgm').checkMGM(req.db,req.body.spice_id)


      if(!url){
        return res.error("URL tidak boleh kosong")
      }else if (url != cek_mgm.url_mgm){
        return res.error("Url tidak sama")
      }
      // Check if the user have already invited the same person
      if(cek_both_spice){
        return res.error("Proses recruit ini sudah terjadi")
      }else if(invited){
        return res.error("Spice id ini sudah pernah direkrut")
      }else{
        let data={
          spice_id : req.body.spice_id,
          spice_id_recruit : user.spice_id,
          status_mgm : 'Registered'
        }
        await req.queries('mgm').addMgmLogLeaderboard(req.db, data);
        ress.message = "Success Insert to MGM Leaderboard"
      }
  
      return res.success(ress)
    }

  })().catch(next)
}