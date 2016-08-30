var multiparty = require('multiparty');
var bodyParser = require('body-parser');
var Router = require('router');
var router = Router();
var _ = require('lodash');

router.use(bodyParser.json({limit: '50mb'}))

router.use(function(req,res,next){

  if(req.method == 'POST' || req.method == 'PUT'){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

      if(fields){
        req.body = req.body || {};

        Object.keys(fields).forEach(function(k){
          req.body[k] = fields[k][0];
        });
      }

      if(files){
        req.files = req.files || {};

        Object.keys(files).forEach(function(k){
          req.files[k] = files[k][0];
        });
      }

      next();
    });
  }

});

router.use(function(req,res,next){
  console.log(req.files)
  next();
});

module.exports = router;
