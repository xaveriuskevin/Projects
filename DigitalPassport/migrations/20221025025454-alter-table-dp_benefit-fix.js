'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
      let migrations = [];
        migrations.push(
          queryInterface.removeColumn('dp_benefit', 'is_tnc')
        );
        migrations.push(
          queryInterface.removeColumn('dp_benefit', 'tnc_title')
        );
        migrations.push(
          queryInterface.renameColumn('dp_benefit', 'icon' , 'desktop_image_banner')
        );
        migrations.push(
          queryInterface.renameColumn('dp_benefit', 'image_banner' , 'mobile_image_banner')
        );
        return Promise.all(migrations);
    },
    down: function (queryInterface) {
        // 
        let migrations = [];
        return Promise.all(migrations);
    }
}