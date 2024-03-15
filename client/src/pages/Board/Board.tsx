import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { nanoid } from "nanoid";
import { Button } from "src/components/ui/button";

type Qr = {
	value: string;
	createdAt: Date;
};

const qrValue = nanoid(24);

const Board = () => {
	const user = localStorage.getItem("user");
	const [scanned, setScanned] = useState(false);
	const [qr, setQr] = useState<Qr>({
		createdAt: new Date(),
		value: qrValue,
	});
	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (user && !scanned) {
			intervalId.current = setInterval(() => {
				setQr({
					createdAt: new Date(),
					value: nanoid(24),
				});
			}, 10 * 60 * 1000);
		} else {
			clearInterval(intervalId.current as NodeJS.Timeout);
		}

		return () => clearInterval(intervalId.current as NodeJS.Timeout);
	}, [scanned, user]);

	return (
		<div className="flex flex-col items-center justify-center h-dvh gap-4">
			<div className="mb-4">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
					{`Привет, ${user}!`}
				</h1>
			</div>
			<QRCode value={qr.value} size={512} />
			<Button style={{ fontSize: 36 }} size={"xlg"}>
				Сканировать
			</Button>
		</div>
	);
};

export default Board;
