const counter = document.querySelector("#counter");

setInterval(() => {
    let req = new XMLHttpRequest();
    req.open("POST", "/presentinator/api/hostinfo/", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200) {
            counter.textContent = JSON.parse(req.response).votes + "";
        }
    };
    req.send(JSON.stringify({}));
}, 100);