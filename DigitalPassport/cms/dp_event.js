'use strict'

const fs = require('fs');

/**
 * Created by Kevin
 * RENDER dp_event LIST
 * - render to view
 */
exports.view = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('dp_event', {

        })
    })().catch(next)
}

/**
 * Created by Kevin
 * DATATABLE dp_event
 */
 exports.datatable = (req, res, next) => {
    (async () => {
        let data = await req.queries('dp_event').datatable(req.db, req)


        if (data != null) {
            for(let i in data.data){
                // let icon = data.data[i].icon;
                let image_banner = data.data[i].image_banner
                // let image = ''
                let thumbnail = ''
                // if(data.data[i].icon !== ''){
                //     image = myConfig.aws_url + "uploads/images/digitalpassport/i/" + icon
                //     image = '<img src="' + image + '" alt="th" width="60%" />'
                // }
                if(data.data[i].image_banner !== ''){
                    thumbnail = myConfig.aws_url + "uploads/images/digitalpassport/i/" + image_banner
                    thumbnail = '<img src="' + thumbnail + '" alt="th" width="60%" />'
                }
                // data.data[i].icon = image;
                data.data[i].image_banner = thumbnail;
                data.data[i].event_date = await req.lib("timehelper").format_ymd_his(data.data[i].event_date)
                data.data[i].event_end_date = await req.lib("timehelper").format_ymd_his(data.data[i].event_end_date)
                if(data.data[i].short_desc.length > 100){
                  data.data[i].short_desc = data.data[i].short_desc.slice(0,60) + "......"
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
        data = await req.queries("dp_event").getBenefitById(req.db, req.params.id);
        
        if(data.event_date !== ""){
            data.dataValues.event_date = await req.lib("timehelper").format_ymd_his(data.event_date);
        }

        if(data.event_end_date !== ""){
          data.dataValues.event_end_date = await req.lib("timehelper").format_ymd_his(data.event_end_date);
      }

        if (data != null) {
          if (data.icon !== "") {
            let icon = data.icon;
            data.icon = myConfig.aws_url + "uploads/images/digitalpassport/i/" + icon
          }

          if(data.image_banner !== ""){
            let image_banner = data.image_banner
            data.image_banner = myConfig.aws_url + "uploads/images/digitalpassport/i/" + image_banner
          }

        } else {
          res.render("404_cms", {});
          return;
        }
      }
  
      // - render to views
      res.render("dp_event_form", {
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
        name: 'event_date',
        rules:[
            'required'
        ],
        message: 'Event Start Date is required'
        },{
          name: 'event_end_date',
          rules:[
              'required'
          ],
          message: 'Event End Date is required'
          },{
        name: 'event_location',
        rules:[
            'required'
        ],
        message: 'Event Location is required'
        }]
        req.validate(req,param)

        if(req.body.event_end_date < req.body.event_date){
          return res.error("End Date tidak boleh lebih kecil dari Start Date")
        }
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
          let required_icon = false;
          let required_image_banner = false;
  
          if (req.files.length != 0) {
            for (let i in req.files) {
              if (req.files[i].fieldname == "icon") {
                required_icon = true;
    
                // - validate mime type
                if (
                  req
                  .lib("image_helper")
                  .validateMimeType(req.files[i], image_mime) === false
                ) {
                  res.error("Icon type must be: jpg, png, gif, jpeg!");
                  return;
                }
              }else if (req.files[i].fieldname == "image_banner") {
                required_image_banner = true;
    
                // - validate mime type
                if (
                  req
                  .lib("image_helper")
                  .validateMimeType(req.files[i], image_mime) === false
                ) {
                  res.error("Image Banner type must be: jpg, png, gif, jpeg!");
                  return;
                }
              }
            }
  
            if (
                req.body.id == "" ||
                req.body.id == null ||
                req.body.id == undefined
              ) {
                if (required_image_banner == false) {
                  res.error("Icon or Image Banner is required!");
                  return;
                }
              }
  
          for (let i in req.files) {
            if (req.files[i].fieldname == "icon") {
              req.body.icon = await req
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
              if (req.body.icon === "Invalid") {
                res.error("Place Icon has invalid file type!");
                return;
              }
            }else if (req.files[i].fieldname == "image_banner"){
                req.body.image_banner = await req
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
              if (req.body.image_banner === "Invalid") {
                res.error("Place Icon has invalid file type!");
                return;
              }
            }
          }
        } else if (req.body.id == "") {
          res.error("Icon or Image Banner is required");
          return;
        }
      }else if(req.body.id == ""){
        res.error("Icon or Image Banner is Required!");
        return;
      }
      
      if(req.body.icon == "" || 
         req.body.icon == "undefined" || 
         req.body.icon == undefined){
          
          req.body.icon = null
        }

      await req.queries('dp_event').manage(req.db,req.body)
  
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
      req.queries('dp_event').destroyToTrash(req.db, req.body.id)

      return res.success({
          message: 'Success delete data'
      })
  })().catch(next)
}