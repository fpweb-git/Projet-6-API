const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});

app.use(bodyParser.json());

app.post("/api/auth/signup", (req, res, next) => {
	console.log(req.body);
});

app.use((req, res) => {
	res.json({ message: "Reçue !" });
});

module.exports = app;
