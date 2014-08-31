var _ = require('underscore');
var RSVP = require('rsvp');
var request = require('request');

var logger = require('../utility/logger').createLogger('teksavvy-client');

var TeksavvyClient = function(options) {
  this.apiKey = options.apiKey;

  if (options.logger) {
    logger = options.logger;
  }
  if (_.isUndefined(this.apiKey)) {
    logger.error('Teksavvy API key is required');
    throw new TypeError('Teksavvy API key is required');
  }

  this.url = 'https://api.teksavvy.com/web/Usage/UsageRecords';
}

_.extend(TeksavvyClient.prototype, {
  _fetchUsage: function() {
    var headers = {'Teksavvy-APIKey': this.apiKey};
    var url = this.url;

    var deferred = RSVP.defer();
    var allUsage = [];

    var fetch = function() {
      return new RSVP.Promise(function(resolve, reject) {
        request({
          url: url,
          json: true,
          method: 'get',
          headers: headers
        }, function(err, res, body) {
          if (err || !/2\d\d/.test(res.statusCode)) {
            logger.error('Unable to get usage! %d: %s', res ? res.statusCode : 500, err);
            reject(err);
          } else {
            resolve(body);
          }
        });
      }).then(function(usage) {
        logger.debug('Retrieved %d usage records', usage.value.length);
        allUsage = allUsage.concat(usage.value);
        if (usage['odata.nextLink']) {
          url = usage['odata.nextLink'];
          fetch();
        } else {
          deferred.resolve(allUsage);
        }
      });
    };
    fetch();
    return deferred.promise;
  },
  getUsage: function(start, end) {
    var allUsage = [];
    return this._fetchUsage().then(function(usage) {
      logger.debug('Retrieved %d total usage records', usage.length);
    }, function(err) {
      logger.info('Error when fetching usage', err);
    });
  }
});

module.exports = TeksavvyClient;
