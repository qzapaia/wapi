var _ = require('lodash');
var mustache = require('mustache');
var multiparty = require('multiparty');
var util = require('util');

module.exports = function(api,mainConfig){

	var defaults = {
		subject:'',
		template:''
	}

	return function(req,res,next){
		var formConfig = _.get(mainConfig,['forms',req.params.id]);

		if(!req.body || !formConfig){ next(); return; }

		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files) {
			var data = {};

			Object.keys(fields).forEach(function(name){
				data[name] = fields[name][0];
			});

			var emailConfig = _.defaults(formConfig,defaults);

			var emailOptions = {
			    from: emailConfig.from,
			    to: emailConfig.to,
			    subject: mustache.render(emailConfig.subject, data),
			    html: mustache.render(emailConfig.template, data),
					attachments: Object.keys(files).map(function(f){
						return { path:files[f][0].path }
					})
			};

			api.email.sendMail(emailOptions, function(error, response){
		    if(error){
		      res.status(400).json({error:error});
		    }else{
					res.status(200).json({result:response});
		    }
			});

    });
	};

}
