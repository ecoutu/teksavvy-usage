var _ = require('underscore');
var request = require('request');
var RSVP = require('rsvp');
require('ssl-root-cas')
    .inject()
    .addFile(__dirname + '../../../DigiCertSHA2HighAssuranceServerCA.pem');
var logger = require('../utility/logger').createLogger('teksavvy-client');

var TeksavvyClient = function(options) {
  if (options.logger) {
    logger = options.logger;
  }

  this.url = 'https://api.teksavvy.com/web/Usage/UsageRecords';
}

_.extend(TeksavvyClient.prototype, {
  getUsage: function(apiKey) {
    var headers = {
      'Teksavvy-APIKey': apiKey,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
    };

    var deferred = RSVP.defer();
    var allUsage = [];
    var url = this.url;

    var fetch = function() {
      return new RSVP.Promise(function(resolve, reject) {
        request({
          url: url,
          json: true,
          method: 'get',
          headers: headers
        }, function(err, res, body) {
          if (err || !/2\d\d/.test(res.statusCode)) {
            logger.error('%d error when requesting usage: %s', res ? res.statusCode : 500, err);
            reject(res ? res.statusCode : 500);
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
      }, function(err) {
        deferred.reject(err);
      });
    };
    fetch();
    return deferred.promise;
  }
});

module.exports = TeksavvyClient;
