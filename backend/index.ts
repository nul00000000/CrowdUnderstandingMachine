const express = require("express");

const app = express();

console.log("CUM server running");

app.use(express.json());

type VoteTick = {
	votes: number,
	time: number
};

type Room = {
	votes: number,
	voteGraph: VoteTick[],
	lastUsed: number
};

let rooms: { [name: string]: Room; } = {};

app.post("/", (req, res) => {
	let name = req.body.room;
	let vote = Math.sign(req.body.vote);
	if(name in rooms) {
		rooms[name].votes += vote;
		rooms[name].voteGraph.push({votes: rooms[name].votes, time: Date.now()});
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
		rooms[req.body.room] = {votes: 0, voteGraph: [], lastUsed: Date.now()};
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
