"use strict";
const config = require('./config');
const app = require('express')();
const log = require('./utils');
const SocketConnections = require('./socket/socketConnections');
const SosketHendler = require('./socket/socketHendler')
const routs = require('./router')
const models = require('./models');


let protocol = 'http';
const PORT = process.env.PORT || config.port;

const server = require('http').createServer(app);








const socketConnections = new SocketConnections();
const sosketHendler = new SosketHendler(server, socketConnections);
app.use('/', routs(sosketHendler));
sosketHendler.start()



models.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        log.info('Server ' + protocol + ' is running on port ' + PORT + '...');

    });
});


