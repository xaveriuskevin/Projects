'use strict'

/**
 * Created by Kevin
 * GET dp_benefit DATATABLE
 */
exports.datatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT * FROM dp_benefit where status not like 'Trash' ORDER BY id ASC) as SRC",
        'id',
        ['id', 
         'title',
         'short_desc',
         'desktop_image_banner',
         'mobile_image_banner',
         'tier',
         'tnc_image_header',
         'tnc_long_desc',
         'status'
        ],
        req.input.post
    )
    return data;
}

exports.getBenefitById = (db, id) =>
  new Promise((resolve, reject) => {
    db.model("dp_benefit")
      .findOne({
        where: {
          id: id,
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });

  exports.manage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        id: post.id,
        title: post.title,
        short_desc: post.short_desc,
        tier : post.tier,
        status : post.status,
        tnc_long_desc : post.tnc_long_desc

    }

    if (post.id == null || post.id == '') {
        values.desktop_image_banner = post.desktop_image_banner
        values.mobile_image_banner = post.mobile_image_banner
        values.tnc_image_header = post.tnc_image_header

        db.model('dp_benefit').create(values).then((data) => {
        resolve(data)
        }).catch(reject)
    } else {

      if (
        post.desktop_image_banner !== "" &&
        post.desktop_image_banner !== "undefined" &&
        post.desktop_image_banner !== undefined
      ) {
        values.desktop_image_banner = post.desktop_image_banner;
      }

      if (
        post.mobile_image_banner !== "" &&
        post.mobile_image_banner !== "undefined" &&
        post.mobile_image_banner !== undefined
      ) {
        values.mobile_image_banner = post.mobile_image_banner;
      }

      if (
        post.tnc_image_header !== "" &&
        post.tnc_image_header !== "undefined" &&
        post.tnc_image_header !== undefined
      ) {
        values.tnc_image_header = post.tnc_image_header;
      }

        db.model('dp_benefit').update(values, {
            where: {
                id: post.id
            }
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

exports.destroyToTrash = (db, id) => new Promise((resolve, reject) => {
  db.model('dp_benefit').update({
      status: 'Trash'
  }, {
      where: {
          id: id
      }
  }).then((data) => {
      resolve(data)
  }).catch(reject)
})


exports.getDigitalPassportBenefit = (db) => new Promise((resolve, reject) => {
  db.model('dp_benefit').findAll({
      where :{
        status : "Active"
      },
      attributes : [
        'id',
        'title',
        'short_desc',
        'desktop_image_banner',
        'mobile_image_banner',
        'tier',
      ]
  }).then((data) => {
      resolve(data)
  }).catch(reject)
})


exports.getDetailDigitalPassportBenefit = (db,title) => new Promise((resolve, reject) => {
  db.model('dp_benefit').findAll({
      where :{
        title : title,
        status : "Active"
      }
  }).then((data) => {
      resolve(data)
  }).catch(reject)
})