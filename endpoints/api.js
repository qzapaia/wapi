var bodyParser = require('body-parser');
var Router = require('router');
var camelcase = require('camelcase');
var router = Router({mergeParams: true});
var _ = require('lodash');
var multimiddHelper = require('../helpers/multipart-middleware.js');

router.use(bodyParser.json({limit: '50mb'}))
router.use(multimiddHelper());

module.exports = function(api){

  router.use(function(req,res,next){
    var methodName = camelcase(req.method + '-' + req.params.resource);
    var options = _.pick(req,['body','files'])

    var prom = api[methodName] && api[methodName](options);

    if(prom && prom.then){
      prom.then(function(success){
        res.json(success)
      }).catch(function(error){
        console.log(error);
        error = _.defaults(error,{ status:400 })
        res.status(error.status).end();
      });
    }else{
      console.log('WAPI: method '+methodName+' doesn\'t return a Promise');
    }
  });

  return router;
}
