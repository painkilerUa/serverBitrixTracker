const mysql_query = require('../manage');
const models = require('../models');
const log = require('../utils');

module.exports = (socket, socketIo) => {
    return (data) => {
        models.User.create({
            bitrix_user_id: data.bitrix_user_id,
            bitrix_user_token: data.user_token,
            bitrix_service_hash: data.service_hash
        }).then((data) => {
            socketIo.to(socket.id).emit('account created');
            // Emit updateData action
        }).catch((err) => {
            if(err.original.errno === 1062){
                return models.User.update({
                                        bitrix_user_token: data.user_token,
                                        bitrix_service_hash: data.service_hash
                                    },  {
                                        where: {bitrix_user_id: data.bitrix_user_id}
                                    })
            }else{
                log.info('Error during creating new user, ' + err)
            }
        }).then((data) => {
            // socket.emit('account created');
            socketIo.to(socket.id).emit('account created');
            // Emit updateData action
        })
        // let createAccountDB = new Promise((resolve, reject) => {
        //     mysql_query("INSERT INTO users (bitrix_user_id, bitrix_user_token, bitrix_service_hash) VALUES (" + data.bitrix_user_id + ",'" + data.bitrix_user_token + "', '" + data.bitrix_service_hash + "') ON DUPLICATE KEY UPDATE bitrix_user_token='" + data.bitrix_user_token +  "', bitrix_service_hash='" + data.bitrix_service_hash + "';", (err, rows) => {
        //         if(err){
        //             console.log(err);
        //         }
        //         console.log(rows);
        //         // Emit updateData action
        //     })
        // });
}};