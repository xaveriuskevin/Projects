'use strict'
let randomstring = require("randomstring");
const timehelper = require("../lib/timehelper");

exports.digitalPassportCheckIn = (req, res, next) => { 
    (async () => {
      let param = [{
        name: 'spice_id',
        rules: ['required']
      },{
        name: 'event_name',
        rules: ['required']
      },{
        name: 'venue_name',
        rules: ['required']
      },{
        name: 'checkin_date',
        rules: ['required']
      },]
  
      req.validate(req, param)

      let user = await req.queries('user').get_user_by_spiceid(req.db,req.body.spice_id)
      if(!user){
        res.error("Spice_id tidak terdaftar")
        return
      }
      let spice_id = req.body.spice_id
      //Get User Requirement
      let user_data = await req.queries('dp_checkin').getUserTier(req.db,user.id)

      //Check User Data
      if(!user_data){
        res.error("User Tier Not Found")
        return;
      }else {
        for(let i in user_data){
          delete user_data[i].tier_id
          user_data[i].spice_id = req.lib('password').encryptAes256iv(user_data[i].spice_id)
        }
      }

      let checkin_date = req.lib("timehelper").format_ymd_his(req.body.checkin_date)
      
      let data = {
        spice_id : spice_id,
        event_name : req.body.event_name,
        venue_name : req.body.venue_name,
        checkin_date : checkin_date
      }
      //Cek Logging check-in
      let cek_cekin = await req.queries('dp_checkin').findCheckin(req.db,spice_id,checkin_date)
      let checkin_id= ""
      if(!cek_cekin){
        checkin_id = await req.queries('dp_checkin').logDPCheckIn(req.db,data)
      }else{
        checkin_id = cek_cekin
      }

      res.success({
        code : 200,
        message : "Success",
        checkin_id : checkin_id.id,
        data : user_data
      })

    })().catch(next)
}

exports.digitalPassportRedeem = (req, res, next) => { 
  (async () => {
    let param = [{
      name: 'spice_id',
      rules: ['required']
    },{
      name: 'checkin_id',
      rules: ['required']
    },{
      name: 'reward_name',
      rules: ['required']
    },{
      name: 'redeem_date',
      rules: ['required']
    }]

    req.validate(req, param)
    
   
    let user = await req.queries('user').get_user_by_spiceid(req.db,req.body.spice_id)
    if(!user){
      res.error("Spice_id tidak terdaftar")
      return
    }
    let spice_id = req.body.spice_id
    let redeem_date = req.lib("timehelper").format_ymd_his(req.body.redeem_date)
    
    let checkin_id = await req.queries('dp_redeem').findCheckinRedeem(req.db,req.body.checkin_id,spice_id)
    
    if(!checkin_id){
      res.error("Check In Never Happened")
      return;
    }

    let data = {
      spice_id : spice_id,
      checkin_id : checkin_id.id,
      reward_name : req.body.reward_name,
      redeem_date : redeem_date
    }

    let cek_redeem = await req.queries('dp_redeem').findRedeem(req.db,spice_id,redeem_date)
    let redeem = ""
    if(!cek_redeem){ 
      redeem = await req.queries('dp_redeem').logDPRedeem(req.db,data)
    }else{
      redeem = cek_redeem
    }

    let encrypt_spice = req.lib('password').encryptAes256iv(spice_id);
    
    // //get allacess token
    // let allacess_token = await req.queries('allacess_token').getAllAcessToken(req.db,spice_id)
    //   if(!allacess_token){
    //     res.error("No Token Id Found")
    //     return;
    //   }

    res.success({
      code : 200,
      message : "Success",
      redeem_id : redeem.id,
      checkin_id : checkin_id.id,
      spice_id : encrypt_spice
    })
  })().catch(next)
}

exports.getDigitalPassportBenefit = (req, res, next) => {
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
        //get user tier
        let tier = await req.queries('user').getLatestTIer(req.db,user_id)
        let user_tier = tier.user_tier

        let benefit = await req.queries('dp_benefit').getDigitalPassportBenefit(req.db)
        if(benefit){
          for(let i in benefit){
            benefit[i].dataValues.desktop_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + benefit[i].dataValues.desktop_image_banner
            benefit[i].dataValues.mobile_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + benefit[i].dataValues.mobile_image_banner
            benefit[i].dataValues.is_redeem = false;

            if(user_tier == "bronze"){
              if(benefit[i].dataValues.tier == "bronze"){
                benefit[i].dataValues.is_redeem = true;
              }
            }
  
            if(user_tier == "silver"){
              if(benefit[i].dataValues.tier == "bronze"){
                benefit[i].dataValues.is_redeem = true;
              }
  
              if(benefit[i].dataValues.tier == "silver"){
                benefit[i].dataValues.is_redeem = true;
              }
            }
  
            if(user_tier == "gold"){
              if(benefit[i].dataValues.tier == "bronze"){
                benefit[i].dataValues.is_redeem = true;
              }
  
              if(benefit[i].dataValues.tier == "silver"){
                benefit[i].dataValues.is_redeem = true;
              }
  
              if(benefit[i].dataValues.tier == "gold"){
                benefit[i].dataValues.is_redeem = true;
              }
            }
  
            if(user_tier == "elite red"){
              benefit[i].dataValues.is_redeem = true;
            }
          }
        }else {
          return res.error("No Data Avail")
        }

        res.success({
            code: 200,
            message: "Succeed",
            data : benefit
          });
    })().catch(next);
}

exports.getDetailDigitalPassportBenefit = (req, res, next) => {
  (async () => {

    let param = [{
      name: 'title',
      rules: ['required']
    }]

    req.validate(req, param)

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
    
    let title = req.body.title
    let benefit = await req.queries('dp_benefit').getDetailDigitalPassportBenefit(req.db,title)
    let tier = await req.queries('user').getLatestTIer(req.db,user_id)
    let user_tier = tier.user_tier

    if(benefit == "" ||
       benefit == undefined ||
       benefit == "undefined"){
      res.error("Benefit Doesn't Exist")
      return
    }

    if(benefit){
      for(let i in benefit){
        benefit[i].dataValues.desktop_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + benefit[i].dataValues.desktop_image_banner
        benefit[i].dataValues.mobile_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + benefit[i].dataValues.mobile_image_banner
        if(benefit[i].dataValues.tnc_image_header != null){
        benefit[i].dataValues.tnc_image_header = myConfig.aws_url + "uploads/images/digitalpassport/i/" + benefit[i].dataValues.tnc_image_header
        }
        benefit[i].dataValues.createdate = timehelper.format_ymd_his(benefit[i].dataValues.createdate)
        benefit[i].dataValues.updatedate = timehelper.format_ymd_his(benefit[i].dataValues.updatedate)
        benefit[i].dataValues.is_redeem = true;
      
      if(user_tier == "bronze"){
        if(benefit[i].dataValues.tier == "silver" ||
           benefit[i].dataValues.tier == "gold" || 
           benefit[i].dataValues.tier == "elite red"){
              res.error("Tier not Qualified")
              return
        }
      }

      if(user_tier == "silver"){
        if(benefit[i].dataValues.tier == "gold" || 
           benefit[i].dataValues.tier == "elite red"){
              res.error("Tier not Qualified")
              return
        }
      }

      if(user_tier == "gold"){
        if(benefit[i].dataValues.tier == "elite red"){
            res.error("Tier not Qualified")
            return
        }
      }
      }
    }

    res.success({
        code: 200,
        message: "Succeed",
        data : benefit
    });
  })().catch(next);
}

exports.getDigitalPassportEvent = (req, res, next) => {
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
      let date_now = new Date()
      let today =  await req.lib('timehelper').format_ymd_start(date_now)
      let event = await req.queries('dp_event').getDigitalPassportEvent(req.db,today)

      if(event){
        for(let i in event){
          // event[i].dataValues.icon = myConfig.aws_url + "uploads/images/digitalpassport/i/" + event[i].dataValues.icon
          event[i].dataValues.image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + event[i].dataValues.image_banner
          event[i].dataValues.event_date = req.lib("timehelper").format_ymd_his(event[i].dataValues.event_date)
          event[i].dataValues.event_end_date = req.lib("timehelper").format_ymd_his(event[i].dataValues.event_end_date)
          event[i].dataValues.createdate = req.lib("timehelper").format_ymd_his(event[i].dataValues.createdate)
          event[i].dataValues.updatedate = req.lib("timehelper").format_ymd_his(event[i].dataValues.updatedate)
          delete event[i].dataValues.icon
        }
      }else{
        return res.error("No Data Avail")
      }

      res.success({
          code: 200,
          message: "Succeed",
          data : event
        });
  })().catch(next);
}

exports.getDigitalPassportRedeemHistory = (req, res, next) => {
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
      let limit = req.body.limit || 10;
      let offset = req.body.offset || 0;
      let history = await req.queries('dp_checkin').getHistoryCheckIn(req.db,req,limit,offset,user.spice_id)
      let total_history = await req.queries('dp_checkin').findHistory(req.db,user.spice_id)
      let count = total_history.length
      
      if(!history){
        return res.error("No Data Avail")
      }else {
        for(let i in history.data){
          history.data[i].checkin_date = req.lib("timehelper").format_ymd_his(history.data[i].checkin_date)
        }
      }

      res.success({
          code: 200,
          message: "Succeed",
          total : count,
          data : history
        });
  })().catch(next);
}