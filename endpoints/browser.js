var browserify = require('browserify');
var path = require('path');
var _ = require('lodash');

var b = browserify();

b.add(path.resolve(__dirname,'../browser/'));

module.exports = function(api,mainConfig){
	var config = _.pick(mainConfig,['baseURL']);

	return function(req,res,next){
		res.write('window._wapiConfigFromServer='+JSON.stringify(config)+';');
		b.bundle().pipe(res);
	}

}

