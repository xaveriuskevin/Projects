'use strict'

const fs = require('fs');

/**
 * Created by Kevin
 * RENDER dp_benefit LIST
 * - render to view
 */
exports.view = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('dp_benefit', {

        })
    })().catch(next)
}

/**
 * Created by Kevin
 * DATATABLE dp_benefit
 */
 exports.datatable = (req, res, next) => {
    (async () => {
        let data = await req.queries('dp_benefit').datatable(req.db, req)

        if (data != null) {
          for(let i in data.data){
            if(data.data[i].short_desc.length > 100){
            data.data[i].short_desc = data.data[i].short_desc.slice(0,60) + "......"
            }
            if(data.data[i].tnc_long_desc.length > 100){
              data.data[i].tnc_long_desc = data.data[i].tnc_long_desc.slice(0,60) + "......"
            }
          }
            res.json(data)
        } else {
            return res.error("Data not found")
        }
    })().catch(next)
}

exports.form = (req, res, next) => {
    (async () => {
        let isActionAllowed = await res._canUserAction(["add", "edit"])
        if (!isActionAllowed) {
            if (req.xhr) return res.error("invalid action")
            return res.render("404_cms");
        }
  
      // - get event detail if id is undefined
      let data = {};
  
      if (req.params.id !== undefined && req.params.id !== "") {
        data = await req.queries("dp_benefit").getBenefitById(req.db, req.params.id);
  
        if (data != null) {
          if (data.desktop_image_banner !== "") {
            let desktop_image_banner = data.desktop_image_banner;
            data.desktop_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + desktop_image_banner
          }

          if(data.mobile_image_banner !== ""){
            let mobile_image_banner = data.mobile_image_banner
            data.mobile_image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + mobile_image_banner
          }

          if(data.tnc_image_header !== ""){
            let tnc_image_header = data.tnc_image_header
            data.tnc_image_header = myConfig.aws_url + "uploads/images/digitalpassport/i/" + tnc_image_header
          }

        } else {
          res.render("404_cms", {});
          return;
        }
      }
  
      // - render to views
      res.render("dp_benefit_form", {
        data
      });
    })().catch(next);
};

exports.manage = (req, res, next) => {
    (async () => {
  
      let isActionAllowed = await res._canUserAction(["add", "edit"])
          if (!isActionAllowed) {
              if (req.xhr) return res.error("invalid action")
              return res.render("404_cms");
          }
      
      let param = [{
          
        name: 'title',
        rules:[
            'required'
        ],
        message: 'Title is required'
        },{
        name: 'short_desc',
        rules:[
            'required'
        ],
        message: 'Short Description is required'
        },{
          name: 'tier',
          rules:[
              'required'
          ],
          message: 'Benefit Tier is required'
          },
        ]
        
        req.validate(req,param)

        //check if folder image exist
        let s3_loc_image = "uploads/images/digitalpassport/i/";
        if (typeof req.files != "undefined") {
             // - set allowed mime
             let image_mime = [
              "image/png",
              "image/jpg",
              "image/jpeg",
              "image/gif",
              "image/webp",
            ];
          let required_desktop_image_banner = false;
          let required_mobile_image_banner = false;
  
          if (req.files.length != 0) {
            for (let i in req.files) {
              if (req.files[i].fieldname == "desktop_image_banner") {
                required_desktop_image_banner = true;
    
                // - validate mime type
                if (
                  req
                  .lib("image_helper")
                  .validateMimeType(req.files[i], image_mime) === false
                ) {
                  res.error("Desktop Image type must be: jpg, png, gif, jpeg!");
                  return;
                }
              }else if (req.files[i].fieldname == "mobile_image_banner") {
                required_mobile_image_banner = true;
    
                // - validate mime type
                if (
                  req
                  .lib("image_helper")
                  .validateMimeType(req.files[i], image_mime) === false
                ) {
                  res.error("Mobile Image type must be: jpg, png, gif, jpeg!");
                  return;
                }
              }
            }
  
            if (
                req.body.id == "" ||
                req.body.id == null ||
                req.body.id == undefined
              ) {
                if (required_desktop_image_banner == false || required_mobile_image_banner == false) {
                  res.error("Desktop or Mobile Image are required!");
                  return;
                }
              }
  
          for (let i in req.files) {
            if (req.files[i].fieldname == "desktop_image_banner") {
              req.body.desktop_image_banner = await req
                .lib("aws_s3")
                .upload(
                  req,
                  req.files[i].fieldname,
                  s3_loc_image,
                  false,
                  false,
                  false,
                  image_mime
                );
              if (req.body.desktop_image_banner === "Invalid") {
                res.error("Desktop Image has invalid file type!");
                return;
              }
            }else if (req.files[i].fieldname == "mobile_image_banner"){
                req.body.mobile_image_banner = await req
                .lib("aws_s3")
                .upload(
                  req,
                  req.files[i].fieldname,
                  s3_loc_image,
                  false,
                  false,
                  false,
                  image_mime
                );
              if (req.body.mobile_image_banner === "Invalid") {
                res.error("Mobile Image has invalid file type!");
                return;
              }
            }
          }
        } else if (req.body.id == "") {
          res.error("Desktop or Mobile Image are required");
          return;
        }
      }else if(req.body.id == ""){
        res.error("Desktop or Mobile Image are Required!");
        return;
      }
      
        if (typeof req.files != "undefined") {
          // - set allowed mime
          let image_mime = [
           "image/png",
           "image/jpg",
           "image/jpeg",
           "image/gif",
           "image/webp",
         ];
          let required_tnc_image_header = false;

          if (req.files.length != 0) {
            for (let i in req.files) {
              if (req.files[i].fieldname == "tnc_image_header") {
                required_tnc_image_header = true;
 
                // - validate mime type
                if (
                  req
                  .lib("image_helper")
                  .validateMimeType(req.files[i], image_mime) === false
                ){
                  res.error("Tnc Image Header type must be: jpg, png, gif, jpeg!");
                  return;
                }
              }
            }

            for (let i in req.files) {
              if (req.files[i].fieldname == "tnc_image_header") {
                req.body.tnc_image_header = await req
                .lib("aws_s3")
                .upload(
                req,
                req.files[i].fieldname,
                s3_loc_image,
                false,
                false,
                false,
                image_mime
              );
                if (req.body.tnc_image_header === "Invalid") {
                res.error("Tnc Image Header has invalid file type!");
                return;
                }
              }
            }
          } 
        }

      if(req.body.tnc_image_header == "" || 
         req.body.tnc_image_header == "undefined" || 
         req.body.tnc_image_header == undefined){
          
          req.body.tnc_image_header = null
        }
      
      await req.queries('dp_benefit').manage(req.db,req.body)
  
       // - return response based on id
       let message = 'Success insert data'
       if (req.body.id != null && req.body.id != '') {
           message = 'Success update data'
       }
  
       return res.success({
        message: message
      })
    })().catch(next)
};

exports.destroy = (req, res, next) => {
  (async () => {
      let isActionAllowed = await res._canUserAction(["delete"])
      if (!isActionAllowed) {
          if (req.xhr) return res.error("invalid action")
          return res.render("404_cms");
      }
      // - validate request data value
      let param = [{
          name: 'id',
          rules: [
              'required'
          ]
      }]
      req.validate(req, param)

      // - save to database
      req.queries('dp_benefit').destroyToTrash(req.db, req.body.id)

      return res.success({
          message: 'Success delete data'
      })
  })().catch(next)
}