var _ = require('underscore');
var moment = require('moment');
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
  onPeakDownload: function(req, res) {
    // var start = req.query.start;
    // var end = req.query.end;
    this.teksavvyClient.getUsage(req.params.api_key).then(function(usage) {
      var xAxis = ['x'];

      var onPeakDownload = ['On Peak Download'];
      var onPeakUpload = ['On Peak Upload'];
      var offPeakDownload = ['Off Peak Download'];
      var offPeakUpload = ['Off Peak Upload'];

      logger.info(usage);

      _.each(usage, function(us) {
        // need to change date format - c3's date parsing sucks
        xAxis.push(moment(us.Date).format('YYYY-MM-DD'));
        onPeakDownload.push(us.OnPeakDownload);
        onPeakUpload.push(us.OnPeakUpload);
        offPeakDownload.push(us.OffPeakDownload);
        offPeakUpload.push(us.OffPeakUpload);
      });

      res.send({
        xAxis: xAxis,
        onPeakDownload: onPeakDownload,
        onPeakUpload: onPeakUpload,
        offPeakDownload: offPeakDownload,
        offPeakUpload: offPeakUpload
      });
    }, function(err) {
      logger.error('Unable to fetch usage: %s', err);
      res.send(500);
    }).catch(function(err) {
      logger.fatal('%d - uncaught exception when fetching usage', err);
    });
  }
});

module.exports.UsageController = UsageController;
