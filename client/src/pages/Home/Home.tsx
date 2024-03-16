import { useState } from "react";

import LoginDialog from "src/components/login";
import { Button } from "src/components/ui/button";

const Home = () => {
	const lsUser = localStorage.getItem("user");
	const [scanned, setScanned] = useState(false);
	const [open, setOpen] = useState(false);

	const onScan = () => {
		console.log("open camera");
	};

	const handleScan = () => {
		if (!lsUser) {
			setOpen(true);
			return;
		}

		onScan();
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="mb-8">
				{lsUser ? (
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
						{`Привет, ${lsUser}!`}
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
