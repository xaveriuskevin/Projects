'use strict'

module.exports = (db) => {
    let schema = {
      id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          spice_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          event_name: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          venue_name: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          checkin_date: {
            type: Sequelize.DATE,
            allowNull: false
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
    let dp_checkin = db.getConnection().define('dp_checkin', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt:'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return dp_checkin
}