const router = require('express').Router();
const mysql_query = require('../manage');
const models = require('../models');

function initRoute(io){
    router.get('/', (req, res) => {
        // models.WorkHour.create({
        //     group_id: 66,
        //     task_id: 13654,
        //     time_stamp: new Date(),
        //     t_tipe: 'STOP',
        //     user_id: 1
        // }).then(function(data) {
        //     res.send(data);
        // }).catch((err) => {
        //     console.log(err)
        // })

        // models.WorkHour.create({
        //     group_id: 46,
        //     task_id: 11946,
        //     time_stamp: new Date(),
        //     t_tipe: 'STOP',
        //     user_id: 3
        // }).then(function(data) {
        //     res.send(data);
        // }).catch((err) => {
        //     console.log(err)
        // })














        // models.User.create({
        //     bitrix_user_id: 508,
        //     bitrix_user_token: 'token508',
        //     bitrix_service_hash: 'hash508'
        // }).then(function(data) {
        //     res.send(data);
        // }).catch((err) => {
        //     console.log(err)
        // })

        models.WorkHour.findAll({
            attributes: ['id', 'group_id', 'task_id', 'time_stamp','t_tipe'],
            include:  [ {model: models.User, attributes: ['id', 'bitrix_user_id', 'bitrix_user_token', 'bitrix_service_hash'], required: true}]
        }).then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log(err)
            })
        // let addWorkTime = new Promise((resolve, reject) => {
        //     // let data = {
        //     //     user_id: 111,
        //     //     group_id: 125,
        //     //     task_id: 99,
        //     //     time_start: 1499696277821,
        //     //     t_time: 'START'
        //     // };
        //     let data = [111, 125, 99, 1499696277821, 'START']
        //     mysql_query('INSERT INTO work_time SET user_id = ?, group_id = ?, task_id = ?, time_start = ?, t_time = ?', data, (err, rows) => {
        //         if(err){
        //             console.log(err);
        //         }
        //         console.log(rows)
        //         res.send(rows)
        //     })
        // })
    })
    return router;
}


module.exports = initRoute;
