const log = require('winston');
const config = require('../config');

log.add(log.transports.File, { filename: config['file_log_name']});
module.exports = log;