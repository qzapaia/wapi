## Setup

```js
// Server

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

```
// Client
<script type="text/javascript" src="http://localhost:3004/wapi.js"></script>
```


## Options

| Option  | Detail |
| ------------- | ------------- |
| baseUrl  | Base URL for all the endpoints  |


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
**NOTE:** SMTP config is necesary

```js
// Server

app.use(wapi.api({
	// ....
	forms:{
		contact:{
			from:'"My name" <me@company.space>',
			to:'hi@gmail.com',
			subject:'Contact from site',
			template:'Name: {{name}}. <br /> Email:{{email}}' // data from req.body
		}
	}
	// ....
}))


```

```
// Client

<script type="text/javascript" src="http://localhost:3004/wapi.js"></script>
<script>
	wapi.autoInitForms();
</script>
```
