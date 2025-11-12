const express = require("express");

const app = express();

console.log("CUM server running");

app.use(express.json());

type Room = {
	votes: number,
	lastUsed: number
};

let rooms: { [name: string]: Room; } = {};

let votes = 0;

app.post("/", (req, res) => {
	let vote = Math.sign(req.body.vote);
	if(req.body.room in rooms) {
		votes += vote;
		rooms[req.body.room].votes += vote;
		rooms[req.body.room].lastUsed = Date.now();
		res.send({code: 0, votes: rooms[req.body.room].votes});
	} else {
		res.send({code: 1, error: "Room does not exist"});
	}
});

app.post("/create/", (req, res) => {
	if(req.body.room in rooms) {
		res.send({code: 2, error: "Room already exists"});
	} else {
		rooms[req.body.room] = {votes: 0, lastUsed: Date.now()};
		console.log(`Created room {req.body.room}`);
		res.send({code: 0});
	}
});

app.post("/hostinfo/", (req, res) => {
	if(req.body.room in rooms) {
		res.send({code: 0, votes: rooms[req.body.room].votes});
		rooms[req.body.room].lastUsed = Date.now();
	} else {
		res.send({code: 1, error: "Room does not exist"});
	}
});

app.listen(8787, () => {
    console.log("CUM hosting on 8787");
});
