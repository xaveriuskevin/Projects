'use strict'

exports.logDPRedeem = (db, value) => new Promise((resolve, reject) => {
    db.model('dp_redeem').create(value).then((data) => {
      resolve(data)
    }).catch(reject)
})

exports.findRedeem = (db, spice_id , redeem_date) => new Promise((resolve, reject) => {
    db.model('dp_redeem').findOne({
      where: {
        spice_id: spice_id,
        redeem_date : redeem_date
        }
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.findCheckinRedeem = (db, id, spice_id) => new Promise((resolve, reject) => {
    db.model('dp_checkin').findOne({
      where: {
        id: id,
        spice_id: spice_id,
        }
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.findLatestId = (db) => new Promise((resolve, reject) => {
    db.model('dp_redeem').findOne({
      order :[['id','DESC']]
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

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