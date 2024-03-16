import { useEffect, useLayoutEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

import { getQR } from "src/api/qr";
import Loader from "src/components/ui/loader";

const Board = () => {
	const [qr, setQr] = useState<string | null>(null);
	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useLayoutEffect(() => {
		getQR().then(({ data }) => {
			setQr(data.token);
		});
	}, []);

	useEffect(() => {
		intervalId.current = setInterval(() => {
			getQR().then(({ data }) => {
				setQr(data.token);
			});
		}, 10 * 60 * 1000);

		return () => clearInterval(intervalId.current as NodeJS.Timeout);
	}, []);

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
			{qr ? <QRCode value={qr} size={512} /> : <Loader />}
		</div>
	);
};

export default Board;
