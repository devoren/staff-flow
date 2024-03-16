import { useEffect, useLayoutEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

import { getQR } from "src/api/qr";
import Loader from "src/components/ui/loader";

const Board = () => {
	const lsUser = localStorage.getItem("user");
	const [qr, setQr] = useState<string | null>(null);
	const intervalId = useRef<NodeJS.Timeout | null>(null);

	useLayoutEffect(() => {
		getQR().then(({ data }) => {
			setQr(data.token);
		});
	}, []);

	useEffect(() => {
		if (lsUser) {
			intervalId.current = setInterval(() => {
				getQR().then(({ data }) => {
					setQr(data.token);
				});
			}, 10 * 60 * 1000);
		} else {
			clearInterval(intervalId.current as NodeJS.Timeout);
		}

		return () => clearInterval(intervalId.current as NodeJS.Timeout);
	}, [lsUser]);

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="mb-4">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
					Пожалуйста, сканируйте QR код
				</h1>
			</div>
			{qr ? <QRCode value={qr} size={512} /> : <Loader />}
		</div>
	);
};

export default Board;
