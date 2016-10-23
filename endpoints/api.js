var bodyParser = require('body-parser');
var Router = require('router');
var _ = require('lodash');
var multimiddHelper = require('../helpers/multipart-middleware.js');
var url = require('url');
var cache = require('memory-cache');
var devEnv = process.env.NODE_ENV == 'development';

var getAccessToken = function(req){
  var headerToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  if(headerToken){
    return headerToken;
  }else if(req.query.access_token){
    return req.query.access_token;
  }else{
    return null;
  }
}

module.exports = function(api){

  var router = Router({mergeParams: true});

  router.use(bodyParser.json({limit: '50mb'}))
  router.use(multimiddHelper());

  router.use(function(req,res,next){
    var methodName = _.camelCase(req.method + '-' + req.params.resource);
    var referer = null;
    var cacheKey = req.method + req.originalUrl;

    if(req.headers.referer){
      referer = url.parse(req.headers.referer);
      referer.origin = referer.protocol + '//' + referer.host;
    }

    var options = _.chain(req)
                   .pick(['body', 'files', 'headers', 'query'])
                   .assign({
                      referer:referer,
                      payload:req.body,
                      resourceName:req.params.resource,
                      id:req.params.id,
                      access_token:getAccessToken(req),
                      options:req.query,
                      baseURL:req._api.baseURL
                   })
                   .value();

    // response time
    if(req.method == 'GET' && cache.get(cacheKey)){
      console.log('response from cache ',cacheKey);
      res.json(cache.get(cacheKey));
      return;
    }

    var promise = api[methodName] && api[methodName](options);

    if(promise && promise.then){
      promise = promise.then(function(response){
        cache.put(cacheKey, response, devEnv ? 30000 : 10000);
        console.log('response from promise',cacheKey)
        res.json(response);
      });

      promise[promise.catch ? 'catch' : 'fail'](function(err){
        var error = _.defaults(error,{ status:400,data:JSON.strignify(err) })

        res.status(error.status).json(JSON.strignify(error.data));
      });
    }else{
      console.log('WAPI: method '+methodName+' doesn\'t return a Promise');
      next();
    }
  });

  return router;
}
