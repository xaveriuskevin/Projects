'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/digitalpassport')

    //when User scan a barcode or check in, this API Saves that Data
    router.post('/checkin', ctrl.digitalPassportCheckIn)
    //When User Redeems an Item , this API saves that data
    router.post('/redeem', ctrl.digitalPassportRedeem)
    //This API is for a list of benefit, inputted in CMS 
    router.get('/benefit', ctrl.getDigitalPassportBenefit)
    //This API shows Detail of the specific benefit, inputted in CMS
    router.post('/benefitdetail', ctrl.getDetailDigitalPassportBenefit)
    //This API is for a list of benefit, inputted in CMS 
    router.get('/event', ctrl.getDigitalPassportEvent)
    //This API Show History of that specific User where and when they check-in 
    router.post('/history', ctrl.getDigitalPassportRedeemHistory)
}