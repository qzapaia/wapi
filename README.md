# Setup

#### Server

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

#### Browser
```html
<script type="text/javascript" src="http://apihost/browser.js"></script>
```


## Simple Options (server side)

| Option  | Detail | Default Value |
| ------------- | ------------- | ------------- |
| baseURL  | Base URL for all the endpoints  | localhost.origin value |


## Complex Options (server side)

## SMTP
This is necesary for all the endpoints those emails 

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
#### Server

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

#### Browser

It use the **.wapi-form-wrapper .wapi-form .wapi-form-done .wapi-form-fail** classes to work

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
<script type="text/javascript" src="http://apihost/browser.js"></script>
<script>
	wapi.autoInitForms();
</script>
```
