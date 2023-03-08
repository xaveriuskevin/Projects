'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/mgm')

    router.post('/leaderboard', ctrl.doGetMgmLeaderboards)
    router.post('/loggingleaderboard', ctrl.doLogMGMLeaderboard)
    router.post('/logging_mgm', ctrl.MGMLogging)

}