var https = require('https');
var fs = require('fs'); // Using the filesystem module

var credentials = { 
	key: fs.readFileSync('/etc/letsencrypt/live/ac10580.itp.io/privkey.pem'), 
    cert: fs.readFileSync('/etc/letsencrypt/live/ac10580.itp.io/cert.pem')
};
	

// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// If the user just goes to the "route" / then run this function
app.get('/hello', function (req, res) {
	res.send('Hello World!')
  });
  

// Here is the actual HTTP server 
// var http = require('http');
// We pass in the Express object
var httpServer = https.createServer(credentials, app);
// Listen on port 443
httpServer.listen(443);

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(httpServer);

let messages = [];
var enrangestatus = 0;
let poswordlist = ["cute", "beautiful", "gentle", "elegant", "graceful",
"charming", "lovely", "radiant", "glowing", "sparkling",
"vibrant", "energetic", "lively", "spirited", "passionate",
"enthusiastic", "inspiring", "motivational", "empowering",
"confident", "bold", "daring", "adventurous", "courageous",
"resilient", "strong", "determined", "persistent", "persevering",
"wise", "intelligent", "smart", "clever", "knowledgeable",
"thoughtful", "considerate", "caring", "nurturing", "supportive",
"helpful", "generous", "giving", "sharing", "kind-hearted",
"compassionate", "empathetic", "understanding", "patient",
"peaceful", "calming", "soothing", "reassuring", "healing",
"joyful", "cheerful", "happy", "gleeful", "jovial",
"playful", "funny", "humorous", "witty", "silly",
"creative", "artistic", "inventive", "innovative", "original",
"fashionable", "stylish", "trendy", "chic", "sophisticated",
"elegant", "luxurious", "opulent", "lavish", "extravagant",
"mysterious", "intriguing", "fascinating", "captivating", "enchanting"
];
let negwordlist = ["ugly", "detest", "displeasure", "disappointed", "displeasing",
"criticize", "criticism", "bitter", "bitterness", "sorrow",
"unhappiness", "unhappy", "dislike", "disenjoyment", "turmoil",
"conflict", "agitation", "agitated", "disaffection", "disaffectionate",
"unkindness", "unkind", "rough", "harshness", "coldness",
"indifference", "apathy", "unsupportive", "neglect", "neglectful",
"neglecting", "valueless", "worthless", "condemnation",
"disrespect", "disrespectful", "disesteem", "abhor", "abhorrence",
"ingratitude", "ungrateful", "curse", "cursed", "disgrace",
"disgracious", "pessimism", "pessimistic", "downfall", "depressing"];

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);

		for (let i = 0; i < messages.length; i++) {
			socket.emit('chatmessage',messages[i]);
		}
		setInterval(() => {getranged()}, 30000);
		function getranged() {
			enrangestatus += 0;
			console.log("enranged status: " + enrangestatus);
		}
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("fillcolor :" + data.color);
			messages.push(data);

			// Send it to all of the clients
			//socket.broadcast.emit('chatmessage', data);
			
			let wordlist = data.message.split(' ');
			wordlist.forEach(elementA => {
				poswordlist.forEach(elementB => {
					if(elementA === elementB) {
						enrangestatus -= 1;
					}
				});
				negwordlist.forEach(elementB => {
					if(elementA === elementB) {
						enrangestatus += 1;
					}
				});
			});
			io.emit('chatmessage', data, enrangestatus);
			if(enrangestatus == 20){
				enrangestatus = 0;
			}

		});
		

        socket.on('clearchat', function(data) {
            messages = [];
            io.emit('clearchat', data);
        });

		socket.on('click', function(data) {
			io.emit('click', {});
		});

		socket.on('v', function(data) {
			io.emit('v', data);
		});
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
	
