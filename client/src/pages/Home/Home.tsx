import { useState } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useToast } from "src/components/ui/use-toast";

const Home = () => {
	const { toast } = useToast();
	const lsUser = localStorage.getItem("user");
	const [user, setUser] = useState<string | undefined>(lsUser ?? "");

	if (lsUser) {
		return <Navigate to={"/board"} replace />;
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser(e.target.value);
	};

	const onSubmit = () => {
		if (!user?.length) {
			return toast({
				description: "Пожалуйста, введите Ваше имя.",
				variant: "destructive",
			});
		}

		localStorage.setItem("user", user);
		toast({
			description: "Вы успешно вошли в систему.",
		});
	};

	return (
		<div className="flex justify-center h-dvh">
			<div className="flex flex-col justify-center gap-4 max-w-screen-sm">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
					StaffFlow: Employee Attendance Manager
				</h1>
				<p className="text-sm font-normal tracking-tight lg:text-xl text-center">
					Пожалуйста, введите Ваше имя
				</p>
				<Label htmlFor="user">Имя</Label>
				<Input
					id="user"
					placeholder="Имя"
					value={user}
					onChange={onChange}
				/>
				<Button onClick={onSubmit}>Войти</Button>
			</div>
		</div>
	);
};

export default Home;
