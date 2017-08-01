const log = require('../../utils');
const models = require('../../models');


module.exports = (users) => {
    return Promise.all([require('./getAllItems')('task.item.list'), require('./getAllItems')('sonet_group.get'), getWorkedTime()]).then((result) => {
        let usersInfo = [];
        users.forEach((user, i, arr) => {
            let previousProject = [];
            result[2].forEach((row) => {
                if(user.id == row.User.dataValues.bitrix_user_id){
                    if(row.dataValues.t_tipe == "START"){
                        let project = {};
                        for(let group of result[1]){
                            if(group.ID == row.dataValues.group_id){
                                project.group = group['NAME'];
                                break;
                            }
                        }
                        for(let task of result[0]){
                            if(task.ID == row.dataValues.task_id){
                                project.task = task['TITLE'];
                                break;
                            }
                        }

                        if(project.group === undefined) project.group = 'Project has been finished. Id = ' + row.group_id;
                        if(project.task === undefined) project.task = 'Task has been finished. Id = ' + row.task_id;

                        project.time_start = row.dataValues.time_stamp;
                        project.time_stop = null;

                        previousProject.push(project);
                    }else{
                        previousProject[previousProject.length - 1]['time_stop'] = row.dataValues.time_stamp;
                    }
                }
            });
            user.previousProject = previousProject;
            usersInfo.push(user);
        });
        return usersInfo;
    }, (error) => {
        throw error;
    })
}



function getWorkedTime() {
    return models.WorkHour.findAll({
        attributes: ['id', 'group_id', 'task_id', 'time_stamp','t_tipe'],
        include:  [ {model: models.User, attributes: ['id', 'bitrix_user_id', 'bitrix_user_token', 'bitrix_service_hash', 'timer_date'], required: true}]
    })
}