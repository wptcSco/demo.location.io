
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var TrackerEventRouter = require('./tracker-event-router');

function getPortParameter() {
	
	var args = process.argv.slice(2);
	if (args.length < 1) {
		throw "usage  <port>";
	}
	
	return args[0];
}


try {
	server.listen(getPortParameter(), "0.0.0.0", function() {
		process.setuid("www-data");
	});
} catch (err) {
	console.error("Error: [%s] Call: [%s]", err.message, err.syscall);
	process.exit(1);
}

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));

var trackerEventRouter = new TrackerEventRouter(io);

