'use strict';
module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          spice_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          unique_code: {
            type: Sequelize.STRING(225),
            allowNull: true,
          },
          url_mgm: {
            type: Sequelize.STRING(225),
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM('Active','Inactive', 'Trash'),
            allowNull: false,
            defaultValue:'Active'
          },
          created_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          updated_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
    };
    let model = db.getConnection().define('mgm_log', schema, {
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    });
    return model;
}