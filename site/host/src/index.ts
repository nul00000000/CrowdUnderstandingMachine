import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const opinion = document.querySelector("#opinion") as HTMLDivElement;
const engagement = document.querySelector("#engagement") as HTMLDivElement;
const score = document.querySelector("#score") as HTMLDivElement;
const roomCode = document.querySelector("#roomCode") as HTMLInputElement;
const minMaxRow = document.querySelector("#minMaxRow") as HTMLInputElement;
const roomMax = document.querySelector("#roomMax") as HTMLInputElement;
const roomMin = document.querySelector("#roomMin") as HTMLInputElement;
const joinButton = document.querySelector("#join") as HTMLButtonElement;

const voteGraph = document.querySelector("#voteGraph") as HTMLCanvasElement;

let chart: Chart;

let room: string;
let roomJoined = false;

let intervalId: NodeJS.Timeout;

let roomData: Room = {votes: 0, voteGraph: [], startTime: 0};

let voteData: VoteTick[] = [];

let voteGraphPoints: {x: number, y:number}[] = [];
let engageGraphPoints: {x: number, y:number}[] = [];

type VoteTick = {
    time: number,
    votes: number
};

type Room = {
    votes: number,
    voteGraph: VoteTick[],
	startTime: number
};

type HostInfo = {
    code: number,
    room?: Room,
    error?: number
};

function createRoom(roomCode: string) {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/create/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            let resp: HostInfo = JSON.parse(req.response);
            if(resp.code == 0) {
                console.log("Room created successfully");
            } else {
                console.log("Room creation failed with code " + resp.code);
            }
        }
    };
    req.send(JSON.stringify({room: roomCode, max: roomMax.value, min: roomMin.value}));
}

function updateChart() {
	voteGraphPoints = voteData.map((val: VoteTick) => {return {x: val.time, y: val.votes}});
	engageGraphPoints = new Array(Math.floor(voteData[voteData.length - 1].time) + 1);

	let totalOpinion = 0;

	for(let i = 0; i < engageGraphPoints.length - 1; i++) {
		engageGraphPoints[i] = {x: i, y: 0};
	}
	engageGraphPoints[engageGraphPoints.length - 1] = {x: voteData[voteData.length - 1].time, y:0};
	for(let i = 0; i < voteData.length; i++) {
		engageGraphPoints[Math.floor(voteData[i].time)].y++;
		if(i != 0) {
			totalOpinion += (voteData[i].votes + voteData[i - 1].votes) / 2 * (voteData[i].time - voteData[i - 1].time);
		}
	}

	chart.data.datasets[0].data = [...voteGraphPoints];
	chart.data.datasets[1].data = [...engageGraphPoints];
	chart.update("none");

	let opinionScore = totalOpinion / voteData[voteData.length - 1].time;
	let engagementScore = voteData.length / voteData[voteData.length - 1].time;

	opinion.textContent = "Opinion Score: " + Math.floor(opinionScore * 100) / 100;
	engagement.textContent = "Engagement Score: " + Math.floor(engagementScore * 100) / 100;
	score.textContent = "Score: " + Math.floor((opinionScore + engagementScore) * 100) / 100;

}

function loop() {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/hostinfo/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            roomData = (JSON.parse(req.response) as HostInfo).room;
			voteData = roomData.voteGraph;
			updateChart();
        }
    };
    req.send(JSON.stringify({room: room}));
}

function setup() {
	const urlParams = new URLSearchParams(window.location.search);
	if(urlParams.has("room")) {
		roomCode.value = urlParams.get("room");
	}
    chart = new Chart(voteGraph, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Opinion',
				data: voteGraphPoints,
				fill: true,
				pointRadius: 0
			}, {
                label: "Engagement",
                data: [],
                fill: true,
                pointRadius: 0
            }]
		},
		options: {
			indexAxis: "x",
			scales: {
				x: {
					type: "linear",
					beginAtZero: true,
					title: {
						text: "Time",
						display: true
					},
					bounds: "data"
				},
				y: {
					type: "linear",
					beginAtZero: true,
					title: {
						text: "Votes",
						display: true
					}
				}
			  }
		}
	});

    roomCode.oninput = () => {
        let req = new XMLHttpRequest();
        req.open("POST", "/presentinator/api/hostinfo/", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = () => {
            if(req.readyState == 4 && req.status == 200) {
                let resp: HostInfo = JSON.parse(req.response);
                if(resp.code == 0) {
                    joinButton.textContent = "Join";
                } else {
                    joinButton.textContent = "Create";
                }
            }
        };
        req.send(JSON.stringify({room: roomCode.value}));
    };

    joinButton.onclick = () => {
        if(roomJoined) {
            clearInterval(intervalId);
			voteData.push({time: (Date.now() - roomData.startTime) / 1000, votes: voteData[voteData.length - 1].votes});
			updateChart();
        } else {
            room = roomCode.value;
            let req = new XMLHttpRequest();
            req.open("POST", "/presentinator/api/hostinfo/", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200) {
                    let resp: HostInfo = JSON.parse(req.response);
                    if(resp.code == 0) {
                        //room variable already set
                    } else {
                        createRoom(room);
                    }
                    intervalId = setInterval(loop, 100);
					minMaxRow.style.display = "none";
                    joinButton.textContent = "End Room";
                    roomCode.disabled = true;
                    roomJoined = true;

					window.history.pushState({id: "100"}, `Room: ${room}`, `/presentinator/host/?room=${room.toLowerCase()}`);
                }
            };
            req.send(JSON.stringify({room: room}));
        }
    };
}

setup();
