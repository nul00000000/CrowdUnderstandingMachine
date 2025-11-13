export {};

const upvote = document.querySelector("#upvote") as HTMLDivElement;
const downvote = document.querySelector("#downvote") as HTMLDivElement;

const roomFinder = document.querySelector("#roomFinder") as HTMLDivElement;
const votingContainer = document.querySelector("#votingContainer") as HTMLDivElement;
const roomCode = document.querySelector("#roomCode") as HTMLInputElement;
const joinButton = document.querySelector("#join") as HTMLButtonElement;

let room2: string;

type HostInfo = {
    code: number,
    votes?: number,
    error?: number
};

function setup() {
    roomCode.oninput = () => {
        let req = new XMLHttpRequest();
        req.open("POST", "/presentinator/api/hostinfo/", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = () => {
            if(req.readyState == 4 && req.status == 200) {
                let resp: HostInfo = JSON.parse(req.response);
                joinButton.disabled = resp.code != 0;
            }
        };
        req.send(JSON.stringify({room: roomCode.value}));
    };

    joinButton.onclick = () => {
        room2 = roomCode.value;

        roomFinder.style.display = "none";
        votingContainer.style.display = "flex";
    };
}

setup();

upvote.onclick = () => {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            console.log(JSON.parse(req.response).votes);
        }
    };
    req.send(JSON.stringify({room: room2, vote: 1}));
};

downvote.onclick = () => {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            console.log(JSON.parse(req.response).votes);
        }
    };
    req.send(JSON.stringify({room: room2, vote: -1}));
};
