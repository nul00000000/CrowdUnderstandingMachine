const upvote = document.querySelector("#upvote") as HTMLDivElement;
const downvote = document.querySelector("#downvote") as HTMLDivElement;

upvote.onclick = () => {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            console.log(JSON.parse(req.response).votes);
        }
    };
    req.send(JSON.stringify({vote: 1}));
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
    req.send(JSON.stringify({vote: -1}));
};