"use strict"
const rp = require('request-promise');
const config = require('../config');
const log = require('../utils');
const _mysql = require('../manage');
const models = require('../models');

module.exports = (users, socketIo) => {
    return (payload) => {

        // {actionName: 'getInitData',
        // data: {
        //     bitrix_user_id: 1,
        //     group_id: 500,
        //     task_id: 1999,
        //     time_stamp: ...
        // }}
        let actionName = payload.actionName;
        let actionData = payload.data;

        switch (actionName) {
            case 'getInitData':
                getInitDataHandler();
                break;
            case 'startTask':
                startTaskHandler(actionData);
                break;
            case 'stopTask':
                stopTaskHandler(actionData);
                break;
        }
        function getInitDataHandler(){
            Promise.all([require('./general_methods/generateUsersList.js')(users)]).then((resolve) => {
                socketIo.emit('updateData', resolve[0]);
            }).catch((err) => {
                log.info('Some error in getInitDataHandler function ' + err)
            })
        }
        function startTaskHandler(actionData){
            Promise.all([require('./general_methods/generateUsersList.js')(users), require('./general_methods/getAllItems')('task.item.list'), require('./general_methods/getAllItems')('sonet_group.get'), addWorkPointIntoDB(actionData, 'START')]).then((resolve) => {
                let currentProject = null;
                let currentTask = null;
                let updatedUserList = resolve[0];
                for(let project of resolve[2]){
                    if(actionData.group_id == project.ID){
                        currentProject = project['NAME'];
                        break;
                    }
                }
                for(let task of resolve[1]){
                    if(actionData.task_id == task.ID){
                        currentTask = task['TITLE'];
                        break;
                    }
                }

                for(let user of updatedUserList){
                    if(user.id == resolve[3]['bitrix_user_id']){
                        user.currentProject = currentProject;
                        user.currentTask = currentTask;
                        break;
                    }
                }

                socketIo.emit('updateData', updatedUserList);
                updatedUserList
            }).catch((err) => {
                log.info('Some error in process updating user list startTaskHandler ' + err)
            })
        }
        function stopTaskHandler(actionData){
            Promise.all([require('./general_methods/generateUsersList.js')(users), addWorkPointIntoDB(actionData, 'STOP')]).then((resolve)=>{
                let updatedUserList = resolve[0];
                for(let user of updatedUserList){
                    if(user.id == resolve[1]['bitrix_user_id']){
                        user.currentProject = null;
                        user.currentTask = null;
                        break;
                    }
                }

                socketIo.emit('updateData', updatedUserList);
                updatedUserList
            }).catch((err) => {
                log.info('Some error in process updating user list stopTaskHandler ' + err)
            })
        }
    }

    function addWorkPointIntoDB(actionData, type){
        return models.User.findAll({
            attributes: ['id'],
            where: {
                bitrix_user_id: actionData.bitrix_user_id
            }
        }).then((data)=>{
            return data[0].dataValues.id
        }).then((data)=>{
            return models.WorkHour
                .create({
                    user_id: data,
                    group_id: actionData.group_id,
                    task_id: actionData.task_id,
                    time_stamp: actionData.time_stamp,
                    t_tipe: type
                }).then(() => {
                return {bitrix_user_id: actionData.bitrix_user_id}
            })
        })
    }
}

// function getChildDepartments(parentDepartment, departments) {
//     let childDepartments = [];
//     childDepartments.push(parentDepartment);
//     getChildDepartmentStep(parentDepartment);
//     function getChildDepartmentStep(parentDepartment){
//         for(let i= 0; i < departments.length; i++){
//             if(departments[i]['PARENT'] == parentDepartment['ID']){
//                 childDepartments.push(departments[i])
//                 getChildDepartmentStep(departments[i])
//             }
//         }
//     }
//     return childDepartments;
// }
// function getAllItems(method){
//     return new Promise((resolve, reject) => {
//         let items = [];
//         getPartOfItems(0);
//         function getPartOfItems(start){
//             rp(config.bitrix24_api_url + method + '?start=' + start)
//                 .then((response) => {
//                     let result = JSON.parse(response);
//                     items = items.concat(result.result);
//                     if(result.next !== undefined){
//                         getPartOfItems(result.next)
//                     }else{
//                         resolve(items)
//                     }
//                 })
//                 .catch((err) => {
//                     reject(err);
//                 });
//         }
//     })
// }
// function filteredDepartments(){
//     return new Promise ((resolve, reject) => {
//         getAllItems('department.get')
//             .then((result) => {
//                 resolve(getChildDepartments({"ID": config.head_department_id}, result));
//             }).catch((err) => {
//             reject(err)
//         })
//     })
// }
// function intersectionUsersVsDepartments(biggerArr, shorterArr){
//     return biggerArr.filter((biggerArrEl) => {
//         for(let element of shorterArr){
//             if(biggerArrEl["UF_DEPARTMENT"][0] == element["ID"]){
//                 return true;
//             }
//         }
//     })
// }
//
// function getWorkedTime() {
//     return new Promise((resolve, reject) => {
//         let SQLquery = "SELECT * FROM users INNER JOIN work_time ON users.id = work_time.user_id;"
//         _mysql(SQLquery, (err, rows) => {
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(rows);
//             }
//         })
//     })
// }
