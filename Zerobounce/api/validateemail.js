'use strict'

exports.validateEmailwithZB = (req, res, next) => {
    (async () => {
        try {
  
            // Validate email by zerobounce
            let email = req.body.email||""
            let data = {
                message: ""
            }
            if (myConfig.zerobounce) {
                
                //check domain is not whitelist 
                let email_domain = email.split('@') || [];
                email_domain = email_domain[1];
                let validate_email = true
                if(myConfig.whitelist_email_domain.length > 0){
                    for (let i = 0; i < myConfig.whitelist_email_domain.length; i++) {
                        if(ENV != 'production'  && email_domain == myConfig.whitelist_email_domain[i]){
                            validate_email = false
                            break
                        }
                    }
                }
                
                if(validate_email){
                    let ip_address = req.headers['x-forwarded-for']||""
                    ip_address = ip_address.split(',')
                    let params= {
                        base_url:myConfig.zb_base_url,
                        api_key:myConfig.zb_key,
                        email: email,
                        ip_address:ip_address[0]
                    }
                    //Call function in library to call a zerobounce API, To validate email
                    let zerobounce = await req.lib('zerobounce').zbValidateEmail(req, params)
                    if(zerobounce.status != 'valid'){
                        data.message = "Email tidak valid. Silakan cek kembali"
                        data.is_valid = false
                    }else{
                        data.message = "Email Valid. Terima Kasih"
                        data.is_valid = true
                    }
                }else{
                  data.message = "Email Whitelist"
                  data.is_valid = true
                }
            }
  
           return res.success(data)
        } catch (error) {
            console.log(error)
            res.error("Invalid zerobounce: " + error)
        }
    })().catch(next)
  }