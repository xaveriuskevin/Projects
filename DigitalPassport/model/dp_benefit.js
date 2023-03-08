'use strict'

module.exports = (db) => {
    let schema = {
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
            type: Sequelize.TEXT("LONG"),
            allowNull: true,
          },
          desktop_image_banner: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          mobile_image_banner: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          tier :{
            type: Sequelize.STRING(255),
            allowNull: true
          },
          tnc_image_header: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          tnc_long_desc: {
            type: Sequelize.TEXT("LONG"),
            allowNull: true
          },
          status:{
            type: Sequelize.ENUM('Active', 'Inactive', 'Trash'),
            defaultValue: 'Active',
            allowNull: false,
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
    let dp_benefit = db.getConnection().define('dp_benefit', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt:'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return dp_benefit
}