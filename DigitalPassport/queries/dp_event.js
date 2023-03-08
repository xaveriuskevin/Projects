'use strict'
let op = Sequelize.Op;

/**
 * Created by Kevin
 * GET dp_event DATATABLE
 */
exports.datatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT * FROM dp_event where status not like 'Trash' ORDER BY id ASC) as SRC",
        'id',
        ['id', 
         'title',
         'short_desc',
         'icon',
         'image_banner',
         'event_date',
         'event_end_date',
         'event_location',
         'status'
        ],
        req.input.post
    )
    return data;
}

exports.getBenefitById = (db, id) =>
  new Promise((resolve, reject) => {
    db.model("dp_event")
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
        event_date : post.event_date,
        event_end_date : post.event_end_date,
        event_location : post.event_location,
        status : post.status
    }

    if (post.id == null || post.id == '') {
        values.icon = post.icon
        values.image_banner = post.image_banner

        db.model('dp_event').create(values).then((data) => {
        resolve(data)
        }).catch(reject)
    } else {

      if (
        post.icon !== "" &&
        post.icon !== "undefined" &&
        post.icon !== undefined
      ) {
        values.icon = post.icon;
      }

      if (
        post.image_banner !== "" &&
        post.image_banner !== "undefined" &&
        post.image_banner !== undefined
      ) {
        values.image_banner = post.image_banner;
      }

        db.model('dp_event').update(values, {
            where: {
                id: post.id
            }
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

exports.destroyToTrash = (db, id) => new Promise((resolve, reject) => {
  db.model('dp_event').update({
      status: 'Trash'
  }, {
      where: {
          id: id
      }
  }).then((data) => {
      resolve(data)
  }).catch(reject)
})

exports.getDigitalPassportEvent = (db,date_now) => new Promise((resolve, reject) => {
  db.model('dp_event').findAll({
      where :{
        status : "Active",
        event_end_date: {
          [op.gt]: date_now
        }
      },
      attributes :['title','short_desc','image_banner','event_date','event_end_date','event_location'],
      order: [
        ['event_date','ASC']
      ],
  }).then((data) => {
      resolve(data)
  }).catch(reject)
})

exports.getEventPaginationAll = async (
  db,
  req,
  limit,
  offset,
  end_date
) => {
  let data = await req
    .lib("general")
    .getDataPaging(
      db,
      "(SELECT id,title, short_desc, image_banner, event_date, event_end_date, event_location from dp_event where status = 'Active' and event_end_date >= '" + end_date + "' order by event_date ASC limit " + limit + " offset "+ offset +" ) as SRC",
      "id",
      [
        "id",
        "title",
        "short_desc",
        "image_banner",
        "event_date",
        "event_end_date",
        "event_location"
      ],
      req.input.post
    );
  return data;
};

exports.getEventPaginationOngoing = async (
  db,
  req,
  limit,
  offset,
  end_date
) => {
  let data = await req
    .lib("general")
    .getDataPaging(
      db,
      "(SELECT id,title, short_desc, image_banner, event_date, event_end_date, event_location from dp_event where status = 'Active' and event_date <= '" + end_date + "' and event_end_date >= '" + end_date + "' order by event_date ASC limit " + limit + " offset "+ offset +" ) as SRC",
      "id",
      [
        "id",
        "title",
        "short_desc",
        "image_banner",
        "event_date",
        "event_end_date",
        "event_location"
      ],
      req.input.post
    );
  return data;
};

exports.getEventPaginationUpcoming = async (
  db,
  req,
  limit,
  offset,
  end_date
) => {
  let data = await req
    .lib("general")
    .getDataPaging(
      db,
      "(SELECT id,title, short_desc, image_banner, event_date, event_end_date, event_location from dp_event where status = 'Active' and event_date >= '" + end_date + "' order by event_date ASC limit " + limit + " offset "+ offset +" ) as SRC",
      "id",
      [
        "id",
        "title",
        "short_desc",
        "image_banner",
        "event_date",
        "event_end_date",
        "event_location"
      ],
      req.input.post
    );
  return data;
};
