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
				<Button className="flex items-center gap-3" size="sm">
					<UserPlusIcon strokeWidth={2} className="h-4 w-4" /> {"Add Timesheet"}
				</Button>
			</Link>
		</div>
	)
}