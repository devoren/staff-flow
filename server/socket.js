const EVENTS = {
	connection: "connection",
	disconnect: "disconnect",
};

function socket(io) {
	console.log("Sockets enabled");

	io.on(EVENTS.connection, (socket) => {
		console.log(`User connected ${socket.id}!`);

		socket.emit("test", "value");
		socket.on("scan", (data) => {
			console.log("scan:", data);
			socket.broadcast.emit("scanData", data);
		});

		socket.on(EVENTS.disconnect, (reason) => {
			console.log(`User disconnected: ${reason}`);
		});
	});
}

module.exports = socket;
