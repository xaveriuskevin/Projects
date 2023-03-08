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
          spice_id_recruit: {
            type: Sequelize.INTEGER,
            allowNull: true,
          }, 
          status_mgm : {
            type: Sequelize.ENUM("Registered","Completed"),
            allowNull: true,
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
    let model = db.getConnection().define('mgm_leaderboard', schema, {
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