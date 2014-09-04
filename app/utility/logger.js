var _ = require('underscore');
var bunyan = require('bunyan');
var bsyslog = require('bunyan-syslog');

module.exports.createLogger = function(name) {
  return bunyan.createLogger({
    name: name,
    src: process.env.NODE_ENV !== 'production',
    streams: [
      {
        level: 'debug',
        type: 'raw',
        stream: bsyslog.createBunyanStream({
          type: 'sys',
          facility: bsyslog.local0,
          host: 'localhost',
          port: 514
        })
      },
      {
        level: 'debug',
        stream: process.stdout
      }
    ]
  });
}
