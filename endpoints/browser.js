var browserify = require('browserify');
var path = require('path');
var _ = require('lodash');
var cache = require('apicache').middleware;

module.exports = [cache('5 minutes'), function(req,res,next){
	var b = browserify();
	
	var configInjectedFromServer = {
		baseURL: req._api.baseURL
	};

	b.add(path.resolve(__dirname,'../browser/',req.params.id));

	res.write('window._wapiConfigFromServer='+JSON.stringify(configInjectedFromServer)+';');
	b.bundle().pipe(res);
}]
