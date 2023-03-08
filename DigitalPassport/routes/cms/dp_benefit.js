'use strict';

module.exports = (app, router) => {
  const ctr = app.controller('cms/dp_benefit')

  router.get('/', ctr.view)
  router.post('/', ctr.datatable)
  router.get('/new', ctr.form)
  router.get('/detail/:id', ctr.form)
  router.post('/manage', ctr.manage)
  router.post('/destroy', ctr.destroy)
}