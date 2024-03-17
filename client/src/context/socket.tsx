import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

import { HOST_URL } from "src/api";

const socket = io(HOST_URL, {
	extraHeaders: {
		"ngrok-skip-browser-warning": "69420",
	},
	autoConnect: true,
	reconnection: true,
	reconnectionAttempts: 10,
	reconnectionDelay: 2000,
	reconnectionDelayMax: 10000,
	timeout: 10000,
	ackTimeout: 5000,
});

export interface Message {
	message: string;
}

interface Context {
	socket: Socket;
}

const SocketContext = createContext<Context>({
	socket,
});

function SocketsProvider(props: any) {
	return (
		<SocketContext.Provider
			value={{
				socket,
			}}
		>
			{props.children}
		</SocketContext.Provider>
	);
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
