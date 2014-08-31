var bodyParser = require('body-parser');
var express = require('express');
var methodOverride = require('method-override');
var morgan = require('morgan');
var RSVP = require('rsvp');

var logger = require('./utility/logger').createLogger('teksavvy-usage');

var TeksavvyClient = require('./lib/teksavvy-client');
// var UsageController = require('./controllers/usage-controller').UsageController;

RSVP.on('error', function(reason){
  logger.fatal('RSVP error ', reason);
  process.exit(1);
});

var app = express();
var port = process.env.PORT || 8080;

if (app.get('env') === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(express.static(__dirname + '/../public'));

var teksavvyClient = new TeksavvyClient({
  apiKey: '8C2A92AA9A08B06EFD9A6CCEB37D7606',
  logger: logger.child({subcomponent: 'teksavvy-client'})
});

teksavvyClient.getUsage();

// var usageController = new UsageController(teksavvyClient);
// app.get('/usage/:api_key', function(req, res) {
//   usageController.usage.apply(usageController, arguments);
// });

logger.info('Express listening on port %d', port);
app.listen(port);
