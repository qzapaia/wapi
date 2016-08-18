if(!window._wapiConfigFromServer){
	console.warn('_wapiConfigFromServer is not present. This could generate problems 😳');
}

require('whatwg-fetch');
var serialize = require('form-serialize');
var defaults = require('lodash/defaults');

var nativeFetch = window.fetch;


var _ = {
	defaults:defaults
}

var processOptions = function(options){
  var fetchDefaultOptions = {
    headers:new Headers({
      'Content-Type': 'application/json'
    })
  };

  const newOptions = _.defaults(options, fetchDefaultOptions);
  newOptions.body = newOptions.body && JSON.stringify(newOptions.body);
  return newOptions;
}

var config = _.defaults(window._wapiConfigFromServer || {},{
	baseURL:location.origin
});

var fetch = function(url,options){
  var fullURL = config.baseURL + url;

  return nativeFetch(fullURL, processOptions(options)).then(function(res){
    var json = res.json();
		if(res.status >= 400){
      throw json;
    }else{
      return json;
    }
  })
}

exports.submitForm = function(options){
  var url = '/forms/' + options.name;

  return fetch(url,{
    method: 'POST',
    body:options.body
  });
}
