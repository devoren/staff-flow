import { useState } from "react";

import { Button } from "src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useToast } from "src/components/ui/use-toast";

interface LoginProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => void;
}

const LoginDialog: React.FC<LoginProps> = ({ open, setOpen, onSubmit }) => {
	const { toast } = useToast();
	const lsUser = localStorage.getItem("user");
	const [user, setUser] = useState<string | undefined>(lsUser ?? "");

	const onOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setUser("");
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser(e.target.value);
	};

	const handleSubmit = () => {
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
		setOpen(false);

		onSubmit();
	};

	return (
		<Dialog
			open={open}
			defaultOpen={false}
			modal
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Профиль</DialogTitle>
					<DialogDescription>
						Пожалуйста, введите Ваше имя
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Имя
						</Label>
						<Input
							id="name"
							className="col-span-3"
							value={user}
							onChange={onChange}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleSubmit}>Сохранить</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;
