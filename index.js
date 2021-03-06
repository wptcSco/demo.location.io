#!/usr/bin/env node
// -*- js -*-

function getPortParameter() {
	
	var args = process.argv.slice(2);
	if (args.length < 1) {
		console.log("usage  <port>");
		process.exit(1);
	}
	
	return args[0];
}


var http = require('http'),
    ss = require('socketstream');

ss.api.root = ss.root = __dirname;

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'app.css', 'libs/angular-ui.css', 'libs/bootstrap.css', 'libs/bootstrap-responsive.css'],
  code: ['libs/jquery-1.9.1.js',
         'libs/angular.min.js', 
         'libs/bootstrap.js',
         'app'
        ],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
//ss.client.templateEngine.use(require('ss-hogan'));
ss.client.formatters.add(require('ss-less'));
ss.client.templateEngine.use('angular');

ss.responders.add(require('ss-angular'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
try {
	server.listen(getPortParameter(), "0.0.0.0");
} catch (err) {
	console.error("Error: [%s] Call: [%s]", err.message, err.syscall);
	process.exit(1);
}

// Start SocketStream
ss.start(server);



/*setInterval(function() {
	ss.api.publish.all('newMessage', "test message"); 	
}, 1000);*/

