const express = require("express");

const app = express();

console.log("CUM server running");

app.post("/", (req, res) => {
    console.log(req);
});

app.listen(8787, () => {
    console.log("CUM hosting on 8787");
});