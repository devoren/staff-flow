const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./database.js");
const socket = require("./socket");

const port = process.env.PORT || 3000;
const qrSecret = process.env.QR_SECRET;

const app = express();
app.use(
	cors({
		credentials: true,
	})
);
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origins: "*",
	},
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/api/users", (req, res, next) => {
	let sql = "select * from users";
	let params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({ message: err.message });
			return;
		}
		res.json({
			message: "success",
			data: rows,
		});
	});
});

function getUser(res, name, callback) {
	let sql = "select * from users where name = ?";
	let params = [name];
	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ message: err.message });
			return;
		}
		callback(row);
	});
}

function createUser(res, data) {
	var time = new Date().toISOString();
	let sql = "INSERT INTO users (name, status, arrival_time) VALUES (?,?, ?)";
	let params = [data.name, 1, time];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ message: err.message });
			return;
		}
		res.json({
			message: "success",
			data: { ...data, status: 1, arrival_time: time, leave_time: null },
		});
	});
}

function updateUser(res, data) {
	let sql, params;
	if (data.status === 1) {
		sql = "UPDATE users SET status = 2, leave_time = ? WHERE name = ?";
	} else {
		sql = "UPDATE users SET status = 1, arrival_time = ? WHERE name = ?";
	}
	var time = new Date().toISOString();
	params = [time, data.name];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ message: err.message });
			return;
		}
		res.json({
			message: "success",
			data: {
				...data,
				status: data.status === 1 ? 2 : 1,
				arrival_time: data.status === 2 ? time : data.arrival_time,
				leave_time: data.status === 1 ? time : data.leave_time,
			},
		});
	});
}

function verifyToken(res, token) {
	var verified = false;
	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err || decoded.secret !== qrSecret) {
			console.log("jwt error:", err.message);
			res.status(403).json({
				message: "QR-код недействителен или поврежден",
			});
			return;
		}
		verified = true;
	});

	return verified;
}

app.post("/api/scan", (req, res, next) => {
	console.log("scanning....", new Date().getTime());
	let data = {
		name: req.body.name,
	};
	var verified = verifyToken(res, req.body.token);
	if (verified) {
		getUser(res, data.name, (row) => {
			if (row) {
				updateUser(res, row);
			} else {
				createUser(res, data);
			}
		});
	}
});

app.get("/api/qr", (req, res, next) => {
	const token = jwt.sign({ secret: qrSecret }, process.env.SECRET_KEY, {
		expiresIn: "10m",
	});

	res.json({
		message: "success",
		data: {
			token,
		},
	});
});

socket(io);

httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
