var defaults = require('lodash/defaults');
var axios = require('axios');
var serialize = require('form-serialize');

var _ = {
	defaults:defaults
}

var config = _.defaults(window._wapiConfigFromServer || {},{
	baseURL:location.origin
});


console.log(config)

var http = axios.create({
  baseURL: config.baseURL
});



exports.autoInitForms = function(){
	var formsWrappers = document.querySelectorAll('.wapi-form-wrapper');

	formsWrappers.forEach(function(formWrapper){
		var form = formWrapper.querySelector('.wapi-form');
		var formDone = formWrapper.querySelector('.wapi-form-done');
		var formFail = formWrapper.querySelector('.wapi-form-fail');
		
		var url = '/forms/' + formWrapper.getAttribute('data-form-name');

		form.addEventListener('submit',function(e){
			e.preventDefault();

			var obj = serialize(e.target, { hash: true });

			return http.post(url, obj).then(function(){
				formDone.style.display = 'block';
				form.style.display = 'none';
			}).catch(function(){
				formDone.style.display = 'block';
				form.style.display = 'none';
			})

		})
	})	

}


window.wapi = module.exports; 