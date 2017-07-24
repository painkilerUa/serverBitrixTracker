"use strict";

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("User", {
        bitrix_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'bitrix_user_id_index'
        },
        bitrix_user_token: DataTypes.STRING,
        bitrix_service_hash: DataTypes.STRING
    }, {underscored: true});

    User.associate = function(models) {
        User.hasMany(models.WorkHour);
    }

    return User;
};

