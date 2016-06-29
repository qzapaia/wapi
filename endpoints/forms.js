var _ = require('lodash');
var mustache = require('mustache');

module.exports = function(api,mainConfig){
	
	var defaults = {
		subject:'',
		template:''
	}

	return function(req,res,next){
		var formConfig = _.get(mainConfig,['forms',req.params.id]);

		if(!req.body || !formConfig){ next(); return; }

		var emailConfig = _.defaults(formConfig,defaults);
		var data = req.body;

		var emailOptions = {
		    from: emailConfig.from, 
		    to: emailConfig.to, 
		    subject: mustache.render(emailConfig.subject, data),	    
		    html: mustache.render(emailConfig.template, data)
		};

		api.email.sendMail(emailOptions, function(error, response){
	    if(error){
	      res.status(400).json({error:error});
	    }else{
				res.status(200).json({result:response});
	    }
		});

	};

}