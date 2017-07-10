const mysql = require('mysql');
const config = require('./config');
const log = require('./utils');

module.exports = (sql, values, next) => {

    if (arguments.length === 2) {
        next = values;
        values = null;
    }

    const connection = mysql.createConnection({
        host     : config.db_host,
        user     : config.db_user,
        port     : config.db_port,
        password : config.db_password,
        database : config.db_name
    });
    connection.connect((err) => {
        if (err) {
            log.info("[MYSQL] Error connecting to mysql:" + err);
        }
    });

    connection.query(sql, values, (err) => {
        connection.end();
        if (err) {
            throw err;
        }
        next.apply(this, arguments);
    });
};



































