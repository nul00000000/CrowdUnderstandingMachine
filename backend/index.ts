const express = require("express");

const app = express();

console.log("CUM server running");

app.use(express.json());

type VoteTick = {
	time: number, //time since room start in seconds
	votes: number //votes
};

type Room = {
	votes: number,
	voteGraph: VoteTick[],
	startTime: number,
	lastUsed: number
};

let rooms: { [name: string]: Room; } = {};

app.post("/", (req, res) => {
	let name = req.body.room;
	let vote = Math.sign(req.body.vote);
	if(name in rooms) {
		rooms[name].votes += vote;
		if(rooms[name].voteGraph.length == 0) {
			rooms[name].startTime = Date.now();
		}
		rooms[name].voteGraph.push({time: (Date.now() - rooms[name].startTime) / 1000, votes: rooms[name].votes});
		rooms[name].lastUsed = Date.now();
		res.send({code: 0, votes: rooms[name].votes});
	} else {
		res.send({code: 1, error: "Room does not exist"});
	}
});

app.post("/create/", (req, res) => {
	if(req.body.room in rooms) {
		res.send({code: 2, error: "Room already exists"});
	} else {
		rooms[req.body.room] = {votes: 0, voteGraph: [], startTime: Date.now(), lastUsed: Date.now()};
		console.log(`Created room ${req.body.room}`);
		res.send({code: 0});
	}
});

app.post("/hostinfo/", (req, res) => {
	if(req.body.room in rooms) {
		res.send({code: 0, room: rooms[req.body.room]});
		rooms[req.body.room].lastUsed = Date.now();
	} else {
		res.send({code: 1, error: "Room does not exist"});
	}
});

app.listen(8787, () => {
    console.log("CUM hosting on 8787");
});
