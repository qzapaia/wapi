# WAPI
WAPI is a middleware generator for express that make the common tasks in an API (REST, emails, etc .. ) easier

# Setup

## Node

```js

var express = require('express');
var wapi = require('wapi');
var port = process.env.PORT || 3004;
var app = express();

app.use(wapi.api({
	// ... options
}));

app.listen(port,function(){
	console.log(port);
})

```
#### Options

| Option  | Detail | Default Value |
| ------------- | ------------- | ------------- |
| baseURL  | Is the base URL used by browser/index.js | localhost.origin value |

## Browser (Vanilla JS)
```html
	...
	<script type="text/javascript" src="http://apihost/browser/index.js"></script>
</body>
```

## Browser (Angular)


```html
		...
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
	</head>
	<body ng-app="ngWapi" ng-cloak>
		...
		<script type="text/javascript" src="http://apihost/ng-wapi.js"></script>
	</body>
```
*NOTE:* If the app is already an Angular application just call `ng-wapi.js` and
set the `wapi` module as dependency of your app.

```js
	// example
	angular.module('myApp',['ngWapi']);
```

## SMTP
This is necesary for all the endpoints that send emails

```js

app.use(wapi.api({
	// ....
	smtp:{
	  host: 'smtp-pulse.com',
	  port: 2525,
	  auth: {
	      user: 'email@domain.com',
	      pass: 'password'
	  }
	}
	// ....

}));

```
## Forms

#### Node

Every key in the **forms** object will generate a new enpoint to the api (/forms/{key})

**IMPORTANT:** SMTP config is necesary


```js
app.use(wapi.api({
	// ....
	forms:{
		contact:{
			from:'"My name" <me@company.space>',
			to:'hi@gmail.com',
			subject:'Contact from site',
			template:'Name: {{name}}. <br /> Email:{{email}}' // data from req.body
		}
		//... other forms
	}
	// ....
}))


```

#### Browser (Vanilla)

It use the `.wapi-form-wrapper` `.wapi-form` `.wapi-form-done` `.wapi-form-fail`
classes to work

**IMPORTANT**: **data-form-name** attribute is necesary in the wrapper

```html
	<div class="wapi-form-wrapper" data-form-name="contact">
		<form class="wapi-form">
			<input type="text" name="email" value="test@test.com" />  
			<button>Enviar</button>
		</form>

		<div class="wapi-form-done">
			Great
		</div>
		<div class="wapi-form-fail">
			:(
		</div>
	</div>

	...

	<script type="text/javascript" src="http://apihost/browser.js"></script>
	<script>
		wapi.autoInitForms();
	</script>
</body>
```
#### Browser (Angular)
1. Setup the `w-form` diretive with the form name
2. Place the `ng-submit` listener and call the `submit()` method
3. Set all the input that you wanna send with `ng-model="data.fieldName"`
4. Use ng-show to show `submitted` or `fail` states

```html
<form w-form="contact" ng-submit="submit()">

	<form class="wapi-form">
		<input type="text" ng-model="data.email" value="test@test.com" />
		<button>Enviar</button>
	</form>

	<div class="wapi-form-done" ng-show="submitted">
		Great
	</div>
	<div class="wapi-form-fail" ng-show="fail">
		:(
	</div>
</form>
```
