'use strict'
//Dont forget to Npm install the axios wrapper
const AxiosWrapper = require("./axios_wrapper")
const axiosWrapper = new AxiosWrapper()
const path = require('path')
const rootpath = path.resolve(__dirname, '../../../')
require('dotenv').config({path: rootpath + '/.env'});
const env = process.env.NODE_ENV
/* 
Zerobounce
setup in config : 
- api_key -> token  
- domain -> base url of Zerobounce

- ip_address is not mandatory

functon:
- validate email
- logging
*/

//Calling zerobounce API for validating
exports.zbValidateEmail = async(req, data)=>{

  let url = `${data.base_url}/v2/validate?api_key=${data.api_key}&email=${data.email}&ip_address=${data.ip_address}`

  let start = new Date()
  let response = []
  response = await axiosWrapper.request(url,{
    method:"GET",
  })
  let end = new Date()
  let status = 'Failed'
  if(response.data !== false && response.error === false){
    status = response.data.status
  }

  let logs_obj = {
    email:data.email,
    request:url,
    response,
    start,
    end,
    status,
    sub_status :response.data.sub_status
  }

  this.zbLogs(req, logs_obj)
  
  let result = {
    status : status,
    // message: `status: ${status} (${sub_status}). Email tidak valid`
  }

  return result
}
//Logging
exports.zbLogs = (req, {
  email:email,
  status:status,
  request:request="",
  response:response="",
  start:startTimer=new Date,
  end:endTimer=new Date,
  sub_status:sub_status="",
})=>new Promise(
  async(resolve,reject)=>{
    try {
    
        //Log into the database either is a valid / invalid account , there's also the reason why the email is invalid 
      let logResponse = await req.queries('zerobounce').zerobounceLog(req.db,{
          email:email,
          status:status,
          request:JSON.stringify(request),
          response:JSON.stringify(response),
          start_time:startTimer,
          end_time:endTimer,
          time_elapse:endTimer-startTimer,
          sub_status:sub_status
      })
      resolve(logResponse)
    } catch (error) {
      reject(error)
    }

  }
)

// Notes : list pf zerobounce response

// zerobounce_id:logResponse,
//   address,
//   status,
//   sub_status,
//   free_email,
//   did_you_mean,
//   account,
//   domain,
//   domain_age_days,
//   smtp_provider,
//   mx_found,
//   mx_record,
//   firstname,
//   lastname,
//   gender,
//   country,
//   region,
//   city,
//   zipcode,
//   processed_at,
