const stream = require("stream");
const XMLSocket = require("xmlsocket");
const fs = require("fs");
const express = require("express");
const amf = require("amf-packet");

let app = express();
let server = app.listen(80, listening);
function listening(){
	console.log("listening");
}



app.use(
  express.raw({
    inflate: true,
    limit: '50mb',
    type: () => true, // this matches all content types
  })
);
let currentResponseUri = 0;
app.post("/amfphp/gateway.php", (req,res)=>{
	const packet = amf.deserializeAMF(req.body);
	let returnMessages = [];
	packet.messages.forEach(message=>{
		console.log(message);
		let body;
		let status = "status";
		
		if(message.targetUri=="Core.isLoggedIn"){
			if(message.body[0] == 3){//DWMI: Daleks
				body = {
					user_id: 1,
					screen_name: "gato",
					high_score: 1,
					level_unlock: 8,
					hash: "cats"
				};
			}else if(message.body[0] == 2){
				body = {//Maze
					user_id: 1,
					screen_name: "gato",
					high_score: 1,
					level_unlock: 11,
					hash: "cats"
				}
			}else if(message.body[0] == 1){
				body = {//Keys
					user_id: 1,
					screen_name: "gato",
					high_score: 1,
					level_unlock: 0b111111111111111111,
					hash: "cats"
				}
			}else if(message.body[0] == 5){
				body = {//silence
					user_id: 1,
					screen_name: "gato",
					high_score: 1,
					level_unlock: 10,
					hash: "cats"
				}
			}else if(message.body[0] == 6){
				body = {//match
					user_id: 1,
					screen_name: "gato",
					high_score: 1,
					hash: "cats"
				}
			}
			status = "result";
		}else if(message.targetUri=="Core.checkUserCards"){
			const count = message.body[0].length;
			body = [];
			for(let i = 0; i < count; i++){
				body.push(true);
			}
			status = "result";
			
		}
		//DWMI: TARDIS
		else if(message.targetUri=="Tardis.getTardis"){
			body = [false, [
				{type: "doctors", claimed: false, rare: "common", id: 1, unlockable: false}
			]];
			status = "result";
		}
		
		
		
		
		let rs = "/onResult"
		if(status != "result") rs = "/onStatus";
		
		returnMessages.push({targetUri: message.responseUri+rs, responseUri: "/"+currentResponseUri++, body});
	});
	console.log(returnMessages);
	res.send(amf.serializeAMF({}, returnMessages));
});

app.use(express.static("static"));

app.use((req, res, next) => {
	console.log(req.originalUrl, req.headers)
	console.log(req.method)
	console.log(req.body.toString())
	res.status(200).send("");
})


sockPolicy = `<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
	<site-control permitted-cross-domain-policies="all"/>
	<allow-access-from domain="*" to-ports="*" />
</cross-domain-policy>`;


const messageColours = {
	"warn": "\x1b[33m",
	"error": "\x1b[31m",
	"info": "\x1b[34m",
	"debug": "\x1b[32m",
	"fatal": "\x1b[37m\x1b[41m", 
	"trace": "\x1b[36m"
	
};






let XmlSPS = new XMLSocket.SocketPolicyFileServer([], sockPolicy);

let XmlSock = new XMLSocket.Server({host:"localhost", port: 4444}, socket=>{
	socket.on("close", (...args)=>{
		console.log("close event: ", args);
	});
	socket.on("connect", (...args)=>{
		console.log("connect event: ", args);
	});
	socket.on("connectionAttempt", (...args)=>{
		console.log("connectionAttempt event: ", args);
	});
	socket.on("connectionAttemptFailed", (...args)=>{
		console.log("connectionAttemptFailed event: ", args);
	});
	socket.on("connectionAttemptTimeout", (...args)=>{
		console.log("connectionAttemptFailed event: ", args);
	});
	socket.on("data", data=>{
		const messages = data.toString().split("!SOS");
		messages.shift();
		messages.forEach(message=>{
			//console.log(message)
			const messageType = message.split('<')[1].split(' ')[0];
			
			//console.log(messageType);
			if(messageType == "showMessage"){
				const key = message.split("key='")[1].split("'")[0];
				const contents = message.split("'>")[1].split("</showMessage>")[0];
				const colStr = messageColours[key]||"";
				
				
				console.log(colStr+contents+"\x1b[0m");
				
				
			}else console.log("SOS message:", message);
		});
		
		
		//console.log("data event: ", data.toString());
	});
	socket.on("drain", (...args)=>{
		console.log("drain event: ", args);
	});
	socket.on("end", (...args)=>{
		console.log("end event: ", args);
	});
	socket.on("error", (...args)=>{
		console.log("error event: ", args);
	});
	socket.on("lookup", (...args)=>{
		console.log("lookup event: ", args);
	});
	socket.on("ready", (...args)=>{
		console.log("ready event: ", args);
	});
	socket.on("timeout", (...args)=>{
		console.log("timeout event: ", args);
	});
	
});



