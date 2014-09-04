var bodyParser = require('body-parser');
var bsyslog = require('bunyan-syslog');
var express = require('express');
var methodOverride = require('method-override');
var RSVP = require('rsvp');

var logger = require('./utility/logger').createLogger('teksavvy-usage');

var TeksavvyClient = require('./lib/teksavvy-client');
var UsageController = require('./controllers/usage-controller').UsageController;

RSVP.on('error', function(reason){
  logger.fatal('RSVP error ', reason);
  process.exit(1);
});

var app = express();
var address = process.env.ADDRESS || '0.0.0.0';
var port = process.env.PORT || 8080;

app.use(require('express-bunyan-logger')({
  name: 'teksavvy-usage',
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
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(express.static(__dirname + '/../public'));

var teksavvyClient = new TeksavvyClient({
  logger: logger.child({subcomponent: 'teksavvy-client'})
});

var usageController = new UsageController({teksavvyClient: teksavvyClient});
app.get('/usage/:api_key', function(req, res) {
  usageController.usage.apply(usageController, arguments);
});

logger.info('Express listening on port %d', port);
app.listen(port, address);
