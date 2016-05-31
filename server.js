'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);
//GET https://www.googleapis.com/customsearch/v1?q=grumpy+cat&cx=014623854566396067634%3As9nuuvh_xxs&fileType=jpg&key={YOUR_API_KEY}
mongoose.connect(process.env.MONGO_URI);




var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});