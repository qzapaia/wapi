var Router = require('router');
var cors = require('cors');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var fs = require('fs');

var endpoints = ['forms','browser.js'];



exports.api = function(config){
	var router = Router();
	var api = {};

	// ## basic middlwares
	router.use(cors());
	router.use(bodyParser.json({limit: '50mb'}));

	setup(api,config);

	// ## setup all middelwares
	endpoints.forEach(function(epName){			
		router.use('/'+epName+'/:id?', require('./endpoints/' + epName)(api, config));
	});

	return router;
}

var setup = function(api,config){
	api.email = nodemailer.createTransport(config.smtp);
}