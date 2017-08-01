"use strict"
const io = require('socket.io');
const log = require('../utils');
const rp = require('request-promise');
const config = require('../config');
//const EventEmitter = require('events');


// class ApiEmitter extends EventEmitter {}
// const apiEmitter = new ApiEmitter();
// apiEmitter.on('getAllDepartments', () => {
//     console.log(departments);
// });



class SocketHendler {
    constructor(server, socketConnections) {
        this.socketIo = io(server);
        this.connactions = socketConnections;
    }
    start(){
        let users = [];
        this.socketIo.on('connection', (socket) => {
            console.log('New connection ', socket.id );

            socket.on('createAccount', require('./createAccount'));

            socket.on('authorization', require('./authorization')(users, socket));

            socket.on('userInterfaceAction', require('./userInterfaceAction')(users, socket));

//            socket.on('startOrStopTask', )
//            scket.on('manualScreenshot',)

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('error', (error) => {
                log.info('Error during socked connection, ' + error)
            });
        })
//        getAllDepartments()
    }
}
module.exports = SocketHendler;

// function getAllDepartments(start){
//     let departments = [];
//     getPartOfDepartments(start);
//     function getPartOfDepartments(start){
//         rp(config.bitrix24_api_url + 'department.get?start=' + start)
//             .then((response) => {
//                 let result = JSON.parse(response);
//                 departments = departments.concat(result.result);
//                 if(result.next !== undefined){
//                     getPartOfDepartments(start + result.next)
//                 }else{
//                     // apiEmitter.emit('allDepartmentReceived');
//                     getChildDepartments({"ID": "356"}, departments)
//                 }
//             })
//             .catch((err) => {
//                 log.info('Error from getting data about Departments from Bitrix24 API ' + err);
//             });
//     }
// //    return departments;
// }


