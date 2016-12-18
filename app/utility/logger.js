var _ = require('underscore');
var bunyan = require('bunyan');

module.exports.createLogger = function(name) {
  return bunyan.createLogger({
    name: name,
    src: process.env.NODE_ENV !== 'production',
    streams: [
      {
        level: 'debug',
        stream: process.stdout
      }
    ]
  });
}
