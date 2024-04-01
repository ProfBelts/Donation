const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/public"));
const server = app.listen(8000);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

let cash = 100;

app.get("/", function (req, res) {
    res.render("index", { cash: cash });
});

// io.emit updates the cash to all connected clients

io.on("connection", function (socket) {
    socket.on("donate", () => {
        cash += 10;
        io.emit("cashUpdated", cash);
    });

    socket.on("redeem", () => {
        cash -= 10;
        io.emit("cashUpdated", cash);
    });

    socket.emit("cashUpdated", cash);
});
