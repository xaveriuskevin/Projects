"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    let migration = [
      queryInterface
      .createTable(
        "dp_benefit", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          title: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          short_desc : {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          icon: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          image_banner: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          createdate: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
          updatedate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
        }, {
          freezeTableName: true,
          engine: "InnoDB",
          charset: "utf8",
        }
      )
      .then(function () {
        return [queryInterface.addIndex("dp_benefit", ["id"])];
      }),
    ];
    return Promise.all(migration);
  },
  down: function (queryInterface) {
    let migration = [queryInterface.dropTable("dp_benefit")];
    return Promise.all(migration);
  },
};