'use strict'
const Sequelize = require("sequelize");
let op = Sequelize.Op;

exports.logDPCheckIn = (db, value) => new Promise((resolve, reject) => {
    db.model('dp_checkin').create(value).then((data) => {
      resolve(data)
    }).catch(reject)
})

exports.getUserTier = (db,user_id) => new Promise((resolve, reject) => {
    (async () => {
        let params = [user_id]
        let query = `SELECT 
        user.fullname as fullname,
        user.spice_id,
        user_tier.id as tier_id,
        user_tier.user_tier as latest_tier
        FROM user
        INNER JOIN user_tier
        on user_tier.user_id = user.id
        WHERE user.id = ?
        order by tier_id DESC
        LIMIT 1`
  
        let res = await db.getConnection().query(query,{
          replacements: params
        })
        if(res.length > 0){
          resolve(res[0])
        }else{
        resolve(res);
        }
    })().catch((err) => {
        // console.log(err);
        reject(err);
    });
  });

  exports.findCheckin = (db, spice_id , checkin_date) => new Promise((resolve, reject) => {
    db.model('dp_checkin').findOne({
      where: {
        spice_id: spice_id,
        checkin_date : checkin_date
        }
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.findId = (db,spice_id) => new Promise((resolve, reject) => {
    db.model('dp_checkin').findOne({
      where:{
        spice_id : spice_id
      },
      order : [['id','DESC']]
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.findHistory = (db, spice_id) => new Promise((resolve, reject) => {
    db.model('dp_checkin').findAll({
      where: {
        spice_id: spice_id,
      },
      order:[['checkin_date','DESC']],
      attributes : [
        'id',
        'spice_id',
        'event_name',
        'venue_name',
        'checkin_date'
      ]   
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.getCheckInRedeem = (db,spice_id) => new Promise((resolve, reject) => {
    (async () => {
        let params = [spice_id]
        let query = `SELECT 
        dp_checkin.spice_id,
        dp_checkin.event_name,
        dp_checkin.venue_name,
        dp_redeem.reward_name,
        dp_checkin.checkin_date as checkin_date,
        dp_redeem.redeem_date as redeem_date
        FROM
        dp_checkin
        INNER JOIN dp_redeem ON
        dp_redeem.checkin_id = dp_checkin.id
        where
        dp_checkin.spice_id = ?
        ORDER BY dp_checkin.createdate ASC`
  
        let res = await db.getConnection().query(query,{
          replacements: params
        })
        if(res.length > 0){
          resolve(res[0])
        }else{
        resolve(res);
        }
    })().catch((err) => {
        // console.log(err);
        reject(err);
    });
  });

  exports.getUserIdFromToken = (db,token) => new Promise((resolve, reject) => {
    (async () => {
        let params = [token]
        let query = `SELECT
        token.id,
        token.token_code,
        token_profile.user_id
        FROM
        token
        INNER JOIN token_profile ON
        token.id = token_profile.token_id
        WHERE token.token_code = ?
        `
        let res = await db.getConnection().query(query,{
          replacements: params
        })
        if(res.length > 0){
          resolve(res[0])
        }else{
        resolve(res);
        }
    })().catch((err) => {
        // console.log(err);
        reject(err);
    });
  });

  exports.getHistoryCheckIn = async (
    db,
    req,
    limit,
    offset,
    spice_id
  ) => {
    let data = await req
      .lib("general")
      .getDataPaging(
        db,
        "(SELECT id,spice_id,event_name,venue_name,checkin_date from dp_checkin where spice_id = " + spice_id + " order by checkin_date DESC limit " + limit + " offset "+ offset +" ) as SRC",
        "id",
        [
          "id",
          "spice_id",
          "event_name",
          "venue_name",
          "checkin_date"
        ],
        req.input.post
      );
    return data;
  };

  exports.findHistoryWithin60Days = (db,spice_id,date) => new Promise((resolve, reject) => {
    db.model('dp_checkin').findAll({
      where: {
        spice_id: spice_id,
        checkin_date: {
          [op.gt]: date
        },
      }
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })