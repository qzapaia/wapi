var browserify = require('browserify');
var path = require('path');
var _ = require('lodash');




module.exports = function(api,mainConfig){
	var config = _.pick(mainConfig,['baseURL']);

	return function(req,res,next){
    var b = browserify();
		// probar esto
		b.add(path.resolve(__dirname,'../browser/',req.params.id));

		res.write('window._wapiConfigFromServer='+JSON.stringify(config)+';');
		b.bundle().pipe(res);
	}

}
