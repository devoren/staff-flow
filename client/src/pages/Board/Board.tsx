import { CircleCheck } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

import { getQR } from "src/api/qr";
import Loader from "src/components/ui/loader";
import { useSockets } from "src/context/socket";
import { delay } from "src/utils";

const Board = () => {
	const { socket } = useSockets();
	const [qr, setQr] = useState<string | null>(null);
	const [tempUser, setTempUser] = useState<{
		user: string;
		status: number;
	} | null>(null);
	const intervalId = useRef<NodeJS.Timeout | null>(null);
	const greeting =
		tempUser && tempUser.status === 1
			? `Доброе утро, ${tempUser?.user}!`
			: `До свидание, ${tempUser?.user}!`;

	const onGetQR = () => {
		getQR().then(({ data }) => {
			setQr(data.token);
		});
	};

	useEffect(() => {
		socket.on("scanData", async (data) => {
			setTempUser(data);
			await delay(2000);
			setTempUser(null);
			onGetQR();
		});

		return () => {
			socket.off("scanData");
		};
	}, []);

	useLayoutEffect(() => {
		onGetQR();
	}, []);

	useEffect(() => {
		if (!tempUser) {
			intervalId.current = setInterval(() => {
				getQR().then(({ data }) => {
					setQr(data.token);
				});
			}, 10 * 60 * 1000);
		} else {
			clearInterval(intervalId.current as NodeJS.Timeout);
		}

		return () => clearInterval(intervalId.current as NodeJS.Timeout);
	}, [tempUser]);

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="mb-4">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
					Добро пожаловать в StaffFlow
				</h1>
				<h2 className="text-2xl font-medium tracking-tight lg:text-5xl text-center">
					Пожалуйста, сканируйте QR код
				</h2>
			</div>
			{qr ? (
				<div className="relative">
					<QRCode
						value={qr}
						size={
							window.innerWidth < 640
								? window.innerWidth - 40
								: 512
						}
						level="M"
					/>
					{tempUser && (
						<div className="absolute inset-0 bg-black/70 z-99 flex items-center justify-center w-full">
							<div className="p-4 rounded-[8px] bg-white animate-scale-up flex flex-col items-center justify-center gap-1">
								<CircleCheck
									className="h-16 w-16 text-primary/60"
									color="#22bb33"
								/>
								<h1 className="text-xl font-extrabold tracking-tight lg:text-2xl text-center">
									{greeting}
								</h1>
							</div>
						</div>
					)}
				</div>
			) : (
				<Loader />
			)}
		</div>
	);
};

export default Board;
