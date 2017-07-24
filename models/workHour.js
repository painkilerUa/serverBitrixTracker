"use strict";

module.exports = (sequelize, DataTypes) => {
    let WorkHour = sequelize.define("WorkHour", {
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        task_id: {
            type: DataTypes.INTEGER, allowNull: false
        },
        time_stamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        t_tipe: {
            type: DataTypes.ENUM('START', 'STOP'),
            allowNull: false
        }
    }, {underscored: true});

    WorkHour.associate = function(models) {
        WorkHour.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    }

    return WorkHour;
};
