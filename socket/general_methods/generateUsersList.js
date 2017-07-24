const rp = require('request-promise');
const _mysql = require('../../manage');
const config = require('../../config');
const log = require('../../utils');

module.exports = (users) => {
    return Promise.all([getAllItems('task.item.list'), getAllItems('sonet_group.get'), getWorkedTime()]).then((result) => {
        let usersInfo = [];
        users.forEach((user, i, arr) => {
            let previousProject = [];
            result[2].forEach((row) => {
                if(user.id == row.bitrix_user_id){
                    if(row.t_time == "START"){
                        let project = {};
                        for(let group of result[1]){
                            if(group.ID == row.group_id){
                                project.group = group['NAME'];
                                break;
                            }
                        }
                        for(let task of result[0]){
                            if(task.ID == row.task_id){
                                project.task = task['TITLE'];
                                break;
                            }
                        }

                        if(project.group === undefined) project.group = 'Project has been finished. Id = ' + row.group_id;
                        if(project.task === undefined) project.task = 'Task has been finished. Id = ' + row.task_id;

                        project.time_start = row.time_start;
                        project.time_stop = null;

                        previousProject.push(project);
                    }else{
                        previousProject[previousProject.length - 1]['time_stop'] = row.time_start;
                    }
                }
            });
            user.previousProject = previousProject;
            usersInfo.push(user);
            return usersInfo;
        });
    }, (error) => {
        throw error;
    })
}

function getAllItems(method){
    return new Promise((resolve, reject) => {
        let items = [];
        getPartOfItems(0);
        function getPartOfItems(start){
            rp(config.bitrix24_api_url + method + '?start=' + start)
                .then((response) => {
                    let result = JSON.parse(response);
                    items = items.concat(result.result);
                    if(result.next !== undefined){
                        getPartOfItems(result.next)
                    }else{
                        resolve(items)
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }
    })
}

function getWorkedTime() {
    return new Promise((resolve, reject) => {
        let SQLquery = "SELECT * FROM users INNER JOIN workhours ON users.id = workhours.user_id;"
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
}