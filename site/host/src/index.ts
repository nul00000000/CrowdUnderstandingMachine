export {};

const counter = document.querySelector("#counter") as HTMLDivElement;
const roomCode = document.querySelector("#roomCode") as HTMLInputElement;
const joinButton = document.querySelector("#join") as HTMLButtonElement;

let room: string;

type HostInfo = {
    code: number,
    votes?: number,
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
                            counter.textContent = JSON.parse(req.response).votes + "";
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