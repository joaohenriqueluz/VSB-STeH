var WebSocketServer = require('websocket').server;
var http = require('http');
const mqtt = require('mqtt');

const host = 'broker.emqx.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `wss://mqtt.cloud.pozyxlabs.com:443`;
const client = mqtt.connect(connectUrl, {
	clientId,
	clean: true,
	connectTimeout: 4000,
	username: '61389310eb57089d554596c8',
	password: '98bb50d2-1181-40f5-9ada-0c37a66b6f75',
	reconnectPeriod: 1000,
});
let connection;


var server = http.createServer(function (request, response) {
	console.log(new Date() + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});
server.listen(8080, function () {
	console.log(new Date() + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false,
});

function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

wsServer.on('request', function (request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log(
			new Date() + ' Connection from origin ' + request.origin + ' rejected.'
		);
		return;
	}

	connection = request.accept('echo-protocol', request.origin);
	console.log(new Date() + ' Connection accepted.');
	
	// connection.on('message', function (message) {
	// 	if (message.type === 'utf8') {
	// 		console.log('Received Message: ' + message.utf8Data);
	// 		connection.sendUTF(message.utf8Data);
	// 	} else if (message.type === 'binary') {
	// 		console.log(
	// 			'Received Binary Message of ' + message.binaryData.length + ' bytes'
	// 		);
	// 		connection.sendBytes(message.binaryData);
	// 	}
	// });
	connection.on('close', function (reasonCode, description) {
		console.log(
			new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
		);
	});
});

// const topic = '/nodejs/mqtt';
// const topic = '/tags';
const topic = '61389310eb57089d554596c8';
console.log(topic);
client.on('connect', () => {
	console.log('Connected');
	client.subscribe([topic], () => {
		console.log(`Subscribe to topic '${topic}'`);
	});
	// client.publish(
	// 	topic,
	// 	'nodejs mqtt test',
	// 	{ qos: 0, retain: false },
	// 	(error) => {
	// 		if (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// );
});
client.on('message', (topic, payload) => {
	console.log('Received Message:', topic, payload.toString());
	if(connection){
        connection.sendUTF(payload.toString());
    }
});
