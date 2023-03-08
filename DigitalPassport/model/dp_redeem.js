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
          checkin_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          reward_name: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          redeem_date: {
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
    let dp_redeem = db.getConnection().define('dp_redeem', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt:'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return dp_redeem
}