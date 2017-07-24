"use strict"
const Sequelize = require('sequelize');
const config = require('../config');
const fs = require('fs');
const path = require('path');


const sequelize = new Sequelize(config.db_name, config.db_user, config.db_password, {
    host: config.db_host,
    dialect: config.db_dialect,
    port: config.db_port,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

let db = {};

fs.readdirSync(__dirname).filter((file)=> {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;