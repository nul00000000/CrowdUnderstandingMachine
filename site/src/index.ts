const upvote = document.querySelector("#upvote") as HTMLDivElement;
const downvote = document.querySelector("#downvote") as HTMLDivElement;

upvote.onclick = () => {
    let upreq = new XMLHttpRequest();
    upreq.open("POST", "/presentinator/api/", true);
    upreq.setRequestHeader("Content-Type", "application/json");
    upreq.onreadystatechange = () => {
        // if(upreq.readyState == 4 && upreq.status == 200) {

        // }
    };
    upreq.send(JSON.stringify({vote: 1}));
};

downvote.onclick = () => {
    let upreq = new XMLHttpRequest();
    upreq.open("POST", "/presentinator/api/", true);
    upreq.setRequestHeader("Content-Type", "application/json");
    upreq.onreadystatechange = () => {
        // if(upreq.readyState == 4 && upreq.status == 200) {

        // }
    };
    upreq.send(JSON.stringify({vote: -1}));
};