const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./database.js");

const app = express();
const port = process.env.PORT || 3000;
console.log(process.env.PORT);
app.use(
	cors({
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/api/users", (req, res, next) => {
	let sql = "select * from users";
	let params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
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
		console.log("getUser", row);
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		callback(row);
	});
}

function createUser(res, data) {
	let sql = "INSERT INTO users (name, status, arrival_time) VALUES (?,?, ?)";
	let params = [data.name, 1, new Date().toISOString()];
	db.run(sql, params, function (err, result) {
		console.log("createUser", { err, result });
		if (err) {
			res.status(400).json({ error: err.message });
			return null;
		}
		res.json({ message: "success", data: { ...data, status: 1 } });
	});
}

function updateUser(res, data) {
	var mew;
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
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: { ...data, status: data.status === 1 ? 2 : 1 },
		});
	});
	return mew;
}

app.post("/api/users/scan", (req, res, next) => {
	let data = {
		name: req.body.name,
	};
	getUser(res, data.name, (row) => {
		if (row) {
			updateUser(res, row);
		} else {
			createUser(res, data);
		}
	});
});

// app.get("/api/qr", (req, res, next) => {
// 	const token = jwt.sign({ key: "value"}, 'secret', {
// 	expiresIn: '1h',
// 	});
// });

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
