import { AxiosError } from "axios";
import { useState } from "react";

import { scanQR } from "src/api/qr";
import LoginDialog from "src/components/login";
import QrReader from "src/components/qrReader/QrReader";
import { Button } from "src/components/ui/button";
import { useToast } from "src/components/ui/use-toast";
import { useSockets } from "src/context/socket";
import { delay } from "src/utils";

const Home = () => {
	const { toast } = useToast();
	const { socket } = useSockets();
	const lsUser = localStorage.getItem("user");
	const userStatus = localStorage.getItem("userStatus");
	const [showQrReader, setShowQrReader] = useState(false);
	const [open, setOpen] = useState(false);
	const [isLoadingScan, setIsLoadingScan] = useState(false);
	const [showSuccessScan, setShowSuccessScan] = useState(false);

	const greeting = `Привет, ${lsUser}! Ваш статус: ${
		userStatus === "1" ? "На работе" : "На рахате"
	}`;

	const onScan = async () => {
		setShowQrReader(true);
	};

	const onScanSuccess = (result: string) => {
		if (lsUser) {
			setIsLoadingScan(true);
			scanQR({
				name: lsUser,
				token: result,
			})
				.then(({ data }) => {
					setIsLoadingScan(false);
					localStorage.setItem("userStatus", `${data.status}`);
					setShowSuccessScan(true);
					delay(1000).then(() => {
						setShowSuccessScan(false);
						setShowQrReader(false);
					});
					socket.emit("scan", {
						user: lsUser,
						status: data.status,
					});
				})
				.catch((err: AxiosError<{ message: string }>) => {
					setIsLoadingScan(false);
					toast({
						description: err.response?.data.message,
						variant: "destructive",
					});
				});
		} else {
			toast({
				description: "Вы не вошли в систему. Перезагрузите страницу.",
				variant: "destructive",
			});
		}
	};

	const handleScan = () => {
		if (!lsUser) {
			setOpen(true);
			return;
		}

		onScan();
	};

	return showQrReader ? (
		<QrReader
			show={showQrReader}
			setShow={setShowQrReader}
			onScanSuccess={onScanSuccess}
			loading={isLoadingScan}
			success={showSuccessScan}
		/>
	) : (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="mb-8">
				{lsUser ? (
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
						{userStatus ? greeting : `Привет, ${lsUser}!`}
					</h1>
				) : (
					<div className="flex flex-col gap-2">
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
							Добро пожаловать в StaffFlow
						</h1>
						<p className="text-xl font-normal tracking-tight lg:text-xl text-center">
							Система учета и контроля рабочего времени
						</p>
					</div>
				)}
			</div>
			<Button
				className="sm:text-6xl text-3xl"
				size={"xlg"}
				onClick={handleScan}
			>
				Сканировать
			</Button>
			<LoginDialog open={open} setOpen={setOpen} onSubmit={onScan} />
		</div>
	);
};

export default Home;
