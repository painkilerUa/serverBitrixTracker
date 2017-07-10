const router = require('express').Router();
const mysql_query = require('../manage');


function initRoute(io){
    router.get('/', (req, res) => {
        let addWorkTime = new Promise((resolve, reject) => {
            let data = {
                user_id: 111,
                group_id: 125,
                task_id: 99,
                time_start: 1499696277821,
                t_time: 'START'
            };
            mysql_query("INSERT INTO work_time SET ?", data, (err, rows) => {
                if(err){
                    console.log(err);
                }
                console.log(rows)
                res.send(rows)
            })
        })
    })
    return router;
}


module.exports = initRoute;
