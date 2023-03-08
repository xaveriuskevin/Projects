'use strict'
const moment = require('moment');

let format_ymd_his = function (date = new Date()) {
    let dformat = ''
    let d = new Date(date)
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime())) {
            dformat = 'Not Set'
        } else {
            dformat = [
                d.getFullYear(),
                (d.getMonth() + 1).padLeft(),
                d.getDate().padLeft()
            ].join('-') + ' ' + [
                d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()
            ].join(':')
        }
    } else {
        dformat = 'Not Set'
    }
  
    return dformat
}