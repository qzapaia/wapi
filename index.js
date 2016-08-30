var Router = require('router');
var cors = require('cors');
var fs = require('fs');
var _ = require('lodash');
var Router = require('router');

module.exports = function(api){
	var router = Router();

	router.use(cors());

	router.use(require('./helpers/resolveHostname'))

	router.use('/browser/:id', require('./endpoints/browser'));
	// legacy support
	router.use('/browser.js',function(req, res, next){
		res.write("console.warn('WAPI: /browser.js URL is deprecated. use /browser/index.js instead.');");
  	next();
	},require('./endpoints/browser'));


	router.use('/:resource/:id?', require('./endpoints/api'));

	return router;
};
