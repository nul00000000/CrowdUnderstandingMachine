import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const counter = document.querySelector("#counter") as HTMLDivElement;
const roomCode = document.querySelector("#roomCode") as HTMLInputElement;
const joinButton = document.querySelector("#join") as HTMLButtonElement;

const voteGraph = document.querySelector("#voteGraph") as HTMLCanvasElement;

let chart: Chart;

let room: string;

let roomData: Room = {votes: 0, voteGraph: [0]};

type Room = {
    votes: number;
    voteGraph: number[];
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
    req.send(JSON.stringify({room: roomCode}));
}

function setup() {
    chart = new Chart(voteGraph, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Bananas Over Time',
				data: roomData.voteGraph,
				fill: false,
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
						text: "Bananas",
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
                setInterval(() => {
                    let req = new XMLHttpRequest();
                    req.open("POST", "/presentinator/api/hostinfo/", true);
                    req.setRequestHeader("Content-Type", "application/json");
                    req.onreadystatechange = () => {
                        if(req.readyState == 4 && req.status == 200) {
                            roomData = (JSON.parse(req.response) as HostInfo).room;
                            chart.data.datasets[0].data = [...roomData.voteGraph];
                            chart.update("none");
                            counter.textContent = roomData.votes + "";
                        }
                    };
                    req.send(JSON.stringify({room: room}));
                }, 100);
                joinButton.style.visibility = "hidden";
                roomCode.disabled = true;
            }
        };
        req.send(JSON.stringify({room: room}));
    };
}

setup();