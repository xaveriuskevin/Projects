'use strict'

const request = require('request'); 
const moment = require('moment');

let DateDay = function (datetime = null) {
    moment.locale('id');
    if (datetime == null) {
        return (moment().format('dddd, DD MMMM YYYY')); // 'Friday, June 24, 2016 1:42 AM'
    }
    return (moment(datetime).format('dddd, DD MMMM YYYY')); // 'Friday, June 24, 2016 1:42 AM'
    // only needing core
}


exports.weatherforecast = (req, res, next) => {
    (async () => {
    
    //Get Lat,long & API key for Jakarta
    let lat = -6.200000
    let lon = 106.816666
    //Input your API key below , you can find it openweathermap.org
    let key = '{yourapikey}'
    //For Storing the result
    let result = {}
    // Using this API "Call 5 day / 3 hour forecast data" From openweathermap.org
    var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
    request({ url: url, json: true }, function (error, response) { 
        if (error) { 
            console.log('Unable to connect to Forecast API'); 
        } else{
            // Integrate data so the response will be 1 temperature perday
            for(let i in response.body.list){
                
                let weather_datetime = new Date(response.body.list[i].dt_txt)
                let weather_date = weather_datetime.getDate()
                let weather_time = weather_datetime.getHours()
                let formatted_date = DateDay(weather_datetime)
                // console.log(response.body.list[i].dt_txt)
                let today_date = new Date().getDate()
                //Today
                if(weather_date == today_date && weather_time == 12){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.today = "Temperature for Today : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
                //Tomorrow + 1
                if(weather_date == today_date + 1 && weather_time == 0){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.tomorrow0 = "Temperature for Tomorrow[0] : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
                //Tomorrow + 2
                if(weather_date == today_date + 2 && weather_time == 0){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.tomorrow1 = "Temperature for Tomorrow[1] : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
                //Tomorrow + 3
                if(weather_date == today_date + 3 && weather_time == 0){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.tomorrow2 = "Temperature for Tomorrow[2] : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
                //Tomorrow + 4
                if(weather_date == today_date + 4 && weather_time == 0){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.tomorrow3 = "Temperature for Tomorrow[3] : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
                //Tomorrow + 5
                if(weather_date == today_date + 5 && weather_time == 0){
                    let temp = response.body.list[i].main.temp
                    temp = temp - 273.15
                    result.tomorrow4 = "Temperature for Tomorrow[4] : " + formatted_date + " " + temp.toFixed(2) + "°C"
                }
            }
        }
        return res.success({
            City : "Jakarta",
            result : result
        })
    })
    })().catch(next);
}