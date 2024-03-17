import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import Loader from "../ui/loader";
import { CircleCheck } from "lucide-react";

interface QrReaderProps {
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	onScanSuccess: (result: string) => void;
	loading: boolean;
	success: boolean;
}

const QrReader: React.FC<QrReaderProps> = ({
	setShow,
	onScanSuccess,
	loading,
	success,
}) => {
	const { toast } = useToast();
	const scanner = useRef<QrScanner>();
	const videoEl = useRef<HTMLVideoElement>(null);
	const [qrOn, setQrOn] = useState(true);
	const [shouldReload, setShouldReload] = useState(false);
	const [scanResult, setScanResult] = useState<string | null>(null);

	const onScanFail = (err: string | Error) => {
		console.log(err);
		if (err !== "No QR code found") {
			if (typeof err === "string") {
				toast({
					description: err,
					variant: "destructive",
				});
			} else {
				toast({
					description: err.message,
					variant: "destructive",
				});
			}
		}
	};

	useEffect(() => {
		if (scanResult) {
			onScanSuccess(scanResult);
		}
	}, [scanResult]);

	useEffect(() => {
		if (videoEl?.current && !scanner.current) {
			scanner.current = new QrScanner(
				videoEl?.current,
				(res) => {
					setScanResult(res.data);
				},
				{
					onDecodeError: onScanFail,
					preferredCamera: "environment",
					highlightScanRegion: true,
					highlightCodeOutline: true,
					maxScansPerSecond: 1,
				}
			);

			scanner?.current
				?.start()
				.then(() => setQrOn(true))
				.catch((err) => {
					if (err) setQrOn(false);
				});
		}

		return () => {
			if (!videoEl?.current) {
				scanner?.current?.stop();
			}
		};
	}, []);

	useEffect(() => {
		if (!qrOn) {
			setShouldReload(true);
			toast({
				description:
					"Камера заблокирована или недоступна. Пожалуйста, разрешите камеру в разрешениях вашего браузера и перезагрузите.",
				variant: "destructive",
			});
			setScanResult(null);
		}
	}, [qrOn]);

	if (shouldReload) {
		return (
			<div className="flex items-center justify-center">
				<Button onClick={() => location.reload()}>
					Что-то пошло не так. Перезагрузить страницу
				</Button>
			</div>
		);
	}

	return (
		<div className="sm:px-20 w-full flex flex-col items-center gap-4">
			<div className="relative w-full">
				<video ref={videoEl}></video>
				{loading && (
					<div className="absolute inset-0 bg-black/70 z-99 flex items-center justify-center">
						<Loader color="white" />
					</div>
				)}
				{success && (
					<div className="absolute inset-0 bg-black/70 z-99 flex items-center justify-center w-full">
						<div className="p-4 rounded-[8px] bg-white animate-scale-up">
							<CircleCheck
								className="h-16 w-16 text-primary/60"
								color="#22bb33"
							/>
						</div>
					</div>
				)}
			</div>
			<Button
				onClick={() => {
					setShow(false);
					setScanResult(null);
				}}
				disabled={loading || success}
			>
				Назад
			</Button>
		</div>
	);
};

export default QrReader;
