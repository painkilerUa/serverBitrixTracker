"use strict"
const rp = require('request-promise');
const config = require('../config');
const log = require('../utils');
const mysql_query = require('../manage');


module.exports = (users) => {
        return (data) => {
            let filteredDepartments = new Promise ((resolve, reject) => {
                getAllItems('department.get')
                    .then((result) => {
                        resolve(getChildDepartments({"ID": config.head_department_id}, result));
                    }).catch((err) => {
                    reject(err)
                })
            });


            Promise.all([getAllItems('user.get'), filteredDepartments]).then((resolve) => {
                let usersFilteredByHeadDep = intersectionUsersVsDepartments(resolve[0], resolve[1]);
                users.length = 0;
                for(let user of usersFilteredByHeadDep){
                    let curUser = {
                        id: user["ID"],
                        name: user["NAME"],
                        lastName: user["LAST_NAME"],
                        secondName: user["SECOND_NAME"],
                        personalPhoto: user["PERSONAL_PHOTO"],
                        online: false,
                        currentTask: null
                    }
                    if(user["ID"] == data['id']){
                        curUser['online'] = true;
                    }
                    users.push(curUser);
                }
                console.log(users)
            }, (reject) => {
                log.info('some error in process getting authorization data from Bitrix server' + reject)
            })
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
function intersectionUsersVsDepartments(biggerArr, shorterArr){
    return biggerArr.filter((biggerArrEl) => {
        for(let element of shorterArr){
            if(biggerArrEl["UF_DEPARTMENT"][0] == element["ID"]){
                return true;
            }
        }
    })
}



