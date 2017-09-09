const mysql_query = require('../manage');
const models = require('../models');
const log = require('../utils');

module.exports = (socketIo) => {
    return (data) => {
        console.log('data', data)
        socketIo.to(data.socketId).emit('makeScreenshot')
        socketIo.emit('changeTimer', {userId: data.userId})
}}
