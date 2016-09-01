var bodyParser = require('body-parser');
var Router = require('router');
var router = Router({mergeParams: true});
var _ = require('lodash');
var multimiddHelper = require('../helpers/multipart-middleware.js');

router.use(bodyParser.json({limit: '50mb'}))
router.use(multimiddHelper());

module.exports = function(api){

  router.use(function(req,res,next){
    var methodName = _.camelCase(req.method + '-' + req.params.resource);
    var options = _.chain(req)
                   .pick(['body', 'files', 'headers', 'query'])
                   .defaults({
                    resourceName:req.params.resource,
                    id:req.params.id
                   })
                   .value();

    var prom = api[methodName] && api[methodName](options);

    if(prom && prom.then){
      prom.then(function(success){
        res.json(success)
      }).catch(function(error){
        error = _.defaults(error,{ status:400,data:{error:error.toString()} })
        res.status(error.status).json(error.data);
      });
    }else{
      console.log('WAPI: method '+methodName+' doesn\'t return a Promise');
    }
  });

  return router;
}
