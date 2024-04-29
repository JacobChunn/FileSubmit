import { Tooltip } from "@/app/ui/material-tailwind-wrapper";
import { CheckIcon, DocumentArrowUpIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TimesheetTableHeader({
    children
}: {
    children?: React.ReactNode
}) {

	const signedIcon = (
		<Tooltip content="Timesheet Signed">
			<PencilSquareIcon className="w-6 h-6"/>
		</Tooltip>
	)

	const approvedIcon = (
		<Tooltip content="Timesheet Approved">
			<CheckIcon className="w-6 h-6"/>
		</Tooltip>
	)
	const processedIcon = (
		<Tooltip content="Timesheet Processed">
			<DocumentArrowUpIcon className="w-6 h-6"/>
		</Tooltip>
	)

    const TABLE_HEAD = [
		"End Date",
		signedIcon, approvedIcon, processedIcon,
		"Signatory", "Reg", "OT", "Total", "Delete",
	] as const;

    return (
		<thead className="w-min h-min">
			<tr className="w-min h-min">
				{TABLE_HEAD.map((head, index) => (
					<th
						key={"head-" + index}
						className="w-min h-min border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2"
					>
						<div
							className="h-min font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
						>
							{head}
						</div>
					</th>
				))}
			</tr>
			{children}
		</thead>
    )
}