var _ = require('underscore');
var moment = require('moment');
var momentRange = require('moment-range');
var RSVP = require('rsvp');

var logger = require('../utility/logger').createLogger('teksavvy-client');

var UsageController = function(options) {
  this.teksavvyClient = options.teksavvyClient;
  if (options.logger) {
    logger = options.logger;
  }
  if (_.isUndefined(this.teksavvyClient)) {
    logger.error('teksavvyClient is a required argument');
    throw new TypeError('teksavvyClient is a required argument');
  }
}

_.extend(UsageController.prototype, {
  usage: function(req, res) {
    this.teksavvyClient.getUsage(req.params.api_key).then(function(usage) {
      res.send(usage);
    }, function(err) {
      logger.error('Unable to fetch usage: %s', err);
      res.send(500);
    }).catch(function(err) {
      logger.fatal('%d - uncaught exception when fetching usage', err);
    });
  }
});

module.exports.UsageController = UsageController;
