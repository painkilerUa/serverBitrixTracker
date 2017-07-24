const mysql_query = require('../manage');



module.exports = (data) => {
    let createAccountDB = new Promise((resolve, reject) => {
        mysql_query("INSERT INTO users (bitrix_user_id, bitrix_user_token, bitrix_service_hash) VALUES (" + data.bitrix_user_id + ",'" + data.bitrix_user_token + "', '" + data.bitrix_service_hash + "') ON DUPLICATE KEY UPDATE bitrix_user_token='" + data.bitrix_user_token +  "', bitrix_service_hash='" + data.bitrix_service_hash + "';", (err, rows) => {
            if(err){
                console.log(err);
            }
            console.log(rows);
            // Emit updateData action
        })
    });
};