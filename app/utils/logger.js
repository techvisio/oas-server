var winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'log';
const fs = require('fs');
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.File)({
      filename: `${logDir}/application.log`,
      timestamp: tsFormat,
      colorize: true,
    })
  ]
});


module.exports = (function () {
  return {
    debug: debug,
    error: error,
    silly: silly,
    info: info,
    verbose: verbose,
    warn: warn,
    setLoggerLevel: setLoggerLevel,
    getLoggerLevel: getLoggerLevel
  };

  function debug(msg) {
    logger.debug(msg);
  }
  function error(msg) {
    logger.error(msg);
  }
  function silly(msg) {
    logger.silly(msg);
  }
  function info(msg) {
    logger.info(msg);
  }
  function verbose(msg) {
    logger.verbose(msg);
  }
  function warn(msg) {
    logger.warn(msg);
  }

  function getLoggerLevel() {
    return logger.level;
  }

  function setLoggerLevel(levelValue) {
    if (levelValue == 'debug' || levelValue == 'info' || levelValue == 'silly' || levelValue == 'warn' || levelValue == 'error' || levelValue == 'verbose') {
      winston.level = levelValue;
      return;
    }

    logger.error('Not vaild logger level');
  }
}())