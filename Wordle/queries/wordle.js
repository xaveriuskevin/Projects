'use strict'
const Sequelize = require("sequelize");
let op = Sequelize.Op;

exports.addWordleLog = (db, value) => new Promise((resolve, reject) => {
    db.model('wordle_log').create(value).then((data) => {
      resolve(data)
    }).catch(reject)
})

exports.findLogLevel1 = (db,user_id) => new Promise((resolve, reject) => {
    db.model('wordle_log').findOne({
        where: {
            level : 1,
            user_id:user_id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
  })
  
  exports.findLogLevel2 = (db,user_id) => new Promise((resolve, reject) => {
     db.model('wordle_log').findOne({
        where: {
            level : 2,
            user_id:user_id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
  })

exports.checkWordleLog = (db, master_wordle_id,article_id, user_id) =>
  new Promise((resolve, reject) => {
    let where2 = {
      master_wordle_id: master_wordle_id,
      article_id : article_id,
      user_id: user_id
    };

    db.model("wordle_log")
      .findOne({
        where: where2,
      })
      .then((data) => {
        resolve(data);
      })
      .catch(reject);});