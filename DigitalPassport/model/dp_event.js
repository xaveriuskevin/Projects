'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          title : {
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
          event_date: {
            type: Sequelize.DATE,
            allowNull: true
          },
          event_end_date: {
            type: Sequelize.DATE,
            allowNull: true
          },
          event_location: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
         status: {
          type: Sequelize.ENUM('Active', 'Inactive', 'Trash'),
          defaultValue: 'Active',
          allowNull: true,
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
    }
    let dp_event = db.getConnection().define('dp_event', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt:'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return dp_event
}