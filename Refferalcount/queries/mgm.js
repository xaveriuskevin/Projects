'use strict'
let op = Sequelize.Op;

// New Queries for new MGM

exports.checkMGM = (db, spice_id) => new Promise((resolve, reject) => {
  db.model('mgm_log').findOne({
    where: {
      spice_id: spice_id,
      }
    // logging: console.log
  }).then((data) => {
    resolve(data)
  }).catch(reject)
})

exports.loggingMgm = (db, value) => new Promise((resolve, reject) => {
  db.model('mgm_log').create(value).then((data) => {
    resolve(data)
  }).catch(reject)
})

exports.checkMGMLeaderboard = (db, spice_id) => new Promise((resolve, reject) => {
  db.model('mgm_leaderboard').findAll({
    where: {
      spice_id: spice_id,
      }
    // logging: console.log
  }).then((data) => {
    resolve(data)
  }).catch(reject)
})

exports.findFriendsInvited = (db,spice_id) => new Promise((resolve, reject) => {
  (async () => {
      let params = [spice_id]
      let query = `SELECT 
      user.fullname,
      user.fullname as hidename
      FROM mgm_leaderboard
      INNER JOIN user
      ON user.spice_id = mgm_leaderboard.spice_id_recruit 
      WHERE mgm_leaderboard.spice_id = ? and mgm_leaderboard.status_mgm = 'Completed'`

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


  exports.rankLeaderboards = (db) => new Promise((resolve, reject) => {
    (async () => {
        let query = `SELECT 
        COUNT(mgm_leaderboard.spice_id) AS friend,
        user.fullname,
        user.fullname as hidename
        FROM mgm_leaderboard
        INNER JOIN user ON 
        user.spice_id = mgm_leaderboard.spice_id
        WHERE mgm_leaderboard.status_mgm = 'Completed'
        AND mgm_leaderboard.updated_date <= '2022-11-30 23:59:59'
        GROUP BY mgm_leaderboard.spice_id
        ORDER BY friend DESC , mgm_leaderboard.created_date ASC
        LIMIT 10`
  
        let res = await db.getConnection().query(query)
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

  exports.positionLeaderboards = (db) => new Promise((resolve, reject) => {
    (async () => {
        let query = `SELECT 
        COUNT(mgm_leaderboard.spice_id) AS friend,
        mgm_leaderboard.spice_id
        FROM mgm_leaderboard
        INNER JOIN user ON 
        user.spice_id = mgm_leaderboard.spice_id
        WHERE mgm_leaderboard.status_mgm = 'Completed'
        AND mgm_leaderboard.updated_date <= '2022-11-30 23:59:59'
        GROUP BY mgm_leaderboard.spice_id
        ORDER BY friend DESC , mgm_leaderboard.created_date ASC`

        let res = await db.getConnection().query(query)
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

  exports.getSpiceIdFromMgmLeaderboard = (db) => new Promise((resolve, reject) => {
    db.model('mgm_leaderboard').findAll({
      attributes :['spice_id'],
      group :['spice_id']
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.countFromMgmLeaderboard = (db,spice_id) => new Promise((resolve, reject) => {
    db.model('mgm_leaderboard').findAll({
      attributes :['spice_id'],
      group :['spice_id'],
      where:{
        spice_id : spice_id
      }
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.get_spice_id_recruit = (db, spice_id , spice_id_recruit) => new Promise((resolve, reject) => {

    let where2 = {
      spice_id: spice_id,
      spice_id_recruit : spice_id_recruit
    }
  
  
    db.model('mgm_leaderboard').findOne({
      where: where2,
  
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  });
  
  exports.get_spice_id_recruit_only = (db, spice_id_recruit) => new Promise((resolve, reject) => {
  
    let where2 = {
     spice_id_recruit : spice_id_recruit
    }
  
  
    db.model('mgm_leaderboard').findOne({
      where: where2,
  
      // logging: console.log
    }).then((data) => {
      resolve(data)
    }).catch(reject)
  });

  exports.addMgmLogLeaderboard = (db, value) => new Promise((resolve, reject) => {
    db.model('mgm_leaderboard').create(value).then((data) => {
      resolve(data)
    }).catch(reject)
  })

  exports.getTotalUser = (db) => new Promise((resolve, reject) => {
    (async () => {
        let query = `SELECT COUNT(DISTINCT (spice_id)) as total FROM mgm_leaderboard where status_mgm = 'Completed' AND updated_date <= '2022-11-30 23:59:59'`
  
        let res = await db.getConnection().query(query)
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

  exports.findFriendsInvitedLeaderboard = (db,spice_id) => new Promise((resolve, reject) => {
    (async () => {
        let params = [spice_id]
        let query = `SELECT 
        COUNT(mgm_leaderboard.spice_id_recruit) as total
        FROM mgm_leaderboard
        WHERE mgm_leaderboard.spice_id = ? and status_mgm = 'Completed' AND updated_date <= '2022-11-30 23:59:59'`
  
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

  exports.getAllBySpiceIdLeaderboard = (db,spice_id) => new Promise((resolve, reject) => {
    (async () => {
        let params = [spice_id]
        let query = `SELECT 
        mgm_leaderboard.spice_id as spice_id,
        mgm_leaderboard.spice_id_recruit as spice_id_recruit,
        user.id as user_id
        FROM mgm_leaderboard
        INNER JOIN user
        ON user.spice_id = mgm_leaderboard.spice_id_recruit 
        WHERE mgm_leaderboard.spice_id = ? and status_mgm = 'Registered' `
  
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

  exports.doUpdateStatusMGM = (db, values, spice_id , spice_id_recruit) =>
  new Promise((resolve, reject) => {
    db.model("mgm_leaderboard")
      .update(values, {
        where: {
          spice_id: spice_id,
          spice_id_recruit: spice_id_recruit,
        },
        // logging: console.log
      })
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });