import { LoaderIcon } from "lucide-react";
import { cn } from "src/utils";

const Loader = ({ className }: { className?: string }) => {
	return (
		<LoaderIcon
			className={cn(
				"my-28 h-16 w-16 text-primary/60 animate-spin",
				className
			)}
		/>
	);
};

export default Loader;
