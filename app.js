var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require( 'cookie-parser' ),
  port = process.env.PORT || 3000;
require('pug');
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('./controllers'));



app.listen(port, function() {
  console.log('Listening on port ' + port);
});