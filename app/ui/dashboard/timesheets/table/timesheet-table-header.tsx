import { CheckIcon, DocumentArrowUpIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TimesheetTableHeader({
    children
}: {
    children?: React.ReactNode
}) {

	const signedIcon = <PencilSquareIcon className="w-6 h-6"/>
	const approvedIcon = <CheckIcon className="w-6 h-6"/>
	const processedIcon = <DocumentArrowUpIcon className="w-6 h-6"/>

    const TABLE_HEAD = [
		"End Date",
		signedIcon, approvedIcon, processedIcon,
		"Signatory", "Reg", "OT", "Total", "Edit", "Delete",
	] as const;

    return (
		<>
			<thead>
				<tr>
					{TABLE_HEAD.map((head, index) => (
						<th
							key={"head-" + index}
							className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2"
						>
							<div
								className="font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
							>
								{head}
							</div>
							{/*" "*/}{/*index !== TABLE_HEAD.length - 1 && (
									<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
							)*/}
						</th>
					))}
				</tr>
				{children}
			</thead>
		</>
    )
}