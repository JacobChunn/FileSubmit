import Link from "next/link";
import { Button } from "../../material-tailwind-wrapper";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function AddTimesheetButton({
	className,
}: {
	className: string,
}) {

	return (
		<div className={className}>
			<Link href={"/dashboard/add"}>
				<button
					className={`flex h-10 items-center gap-3 rounded-lg px-4 text-sm font-medium text-white transition-colors
					bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600`}
				>
					<UserPlusIcon strokeWidth={2} className="h-4 w-4" />
					Add Timesheet
				</button>
			</Link>
		</div>
	)
}