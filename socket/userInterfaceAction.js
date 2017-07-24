"use strict"
const rp = require('request-promise');
const config = require('../config');
const log = require('../utils');
const _mysql = require('../manage');


module.exports = (users, socket) => {
    return (payload) => {

        // {actionName: 'startTask',
        // data: {
        //     user_id: 1,
        //     tack_id: 1999
        // }}
        let actionName = data.actionName;
        let actionData = payload.data;

        switch (actionName) {
            case 'startTask':
                startTaskHandler(actionData);
                break;
            case 'stopTask':
                stopTaskHandler(actionData);
                break;
            default:
//                return res.status(501).send('Unknown action for editing user')
        }
        function startTaskHandler(actionData){
            require('./general_methods/generateUsersList.js')(resolve, socket).then((resolve) => {

            }).catch((err) => {

            })
        }
        // Promise.all([getAllItems('user.get'), filteredDepartments()]).then((resolve) => {
        //     let usersFilteredByHeadDep = intersectionUsersVsDepartments(resolve[0], resolve[1]);
        //     users.length = 0;
        //     for(let user of usersFilteredByHeadDep){
        //         let curUser = {
        //             id: user["ID"],
        //             name: user["NAME"],
        //             lastName: user["LAST_NAME"],
        //             secondName: user["SECOND_NAME"],
        //             personalPhoto: user["PERSONAL_PHOTO"],
        //             online: false,
        //             currentTask: null,
        //             currentProject: null
        //         }
        //         if(user["ID"] == data['id']){
        //             curUser['online'] = true;
        //         }
        //         users.push(curUser);
        //     }
        //     return users;
        // }).then((resolve) => {
        //     return Promise.all([getAllItems('task.item.list'), getAllItems('sonet_group.get'), getWorkedTime()]).then((result) => {
        //         let usersInfo = [];
        //         resolve.forEach((user, i, arr) => {
        //             let previousProject = [];
        //             result[2].forEach((row) => {
        //                 if(user.id == row.bitrix_user_id){
        //                     if(row.t_time == "START"){
        //                         let project = {};
        //                         for(let group of result[1]){
        //                             if(group.ID == row.group_id){
        //                                 project.group = group['NAME'];
        //                                 break;
        //                             }
        //                         }
        //                         for(let task of result[0]){
        //                             if(task.ID == row.task_id){
        //                                 project.task = task['TITLE'];
        //                                 break;
        //                             }
        //                         }
        //
        //                         if(project.group === undefined) project.group = 'Project has been finished. Id = ' + row.group_id;
        //                         if(project.task === undefined) project.task = 'Task has been finished. Id = ' + row.task_id;
        //
        //                         project.time_start = row.time_start;
        //                         project.time_stop = null;
        //
        //                         previousProject.push(project);
        //                     }else{
        //                         previousProject[previousProject.length - 1]['time_stop'] = row.time_start;
        //                     }
        //                 }
        //             });
        //             user.previousProject = previousProject;
        //             usersInfo.push(user);
        //         });
        //         socket.emit('updateData', usersInfo)
        //     }, (error) => {
        //         throw error;
        //     })
        // }).catch((err) => {
        //     log.info('some error in process getting authorization data from Bitrix server' + err)
        // })

    }
}

function getChildDepartments(parentDepartment, departments) {
    let childDepartments = [];
    childDepartments.push(parentDepartment);
    getChildDepartmentStep(parentDepartment);
    function getChildDepartmentStep(parentDepartment){
        for(let i= 0; i < departments.length; i++){
            if(departments[i]['PARENT'] == parentDepartment['ID']){
                childDepartments.push(departments[i])
                getChildDepartmentStep(departments[i])
            }
        }
    }
    return childDepartments;
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
function filteredDepartments(){
    return new Promise ((resolve, reject) => {
        getAllItems('department.get')
            .then((result) => {
                resolve(getChildDepartments({"ID": config.head_department_id}, result));
            }).catch((err) => {
            reject(err)
        })
    })
}
function intersectionUsersVsDepartments(biggerArr, shorterArr){
    return biggerArr.filter((biggerArrEl) => {
        for(let element of shorterArr){
            if(biggerArrEl["UF_DEPARTMENT"][0] == element["ID"]){
                return true;
            }
        }
    })
}

function getWorkedTime() {
    return new Promise((resolve, reject) => {
        let SQLquery = "SELECT * FROM users INNER JOIN work_time ON users.id = work_time.user_id;"
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
}
