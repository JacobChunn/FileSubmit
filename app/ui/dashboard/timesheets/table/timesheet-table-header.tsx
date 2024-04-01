export default function TimesheetTableHeader({
    children
}: {
    children?: React.ReactNode
}) {

    const TABLE_HEAD = [
		"ID", "Employee ID", "End Date", "Signed", "Approved", "Processed",
		"Signed by", "Reg", "OT", "Total", "Edit", "Delete", "Edit Details",
	] as const;

    return (
        <thead>
            <tr>
                {TABLE_HEAD.map((head, index) => (
                    <th
                        key={head + index}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2 transition-colors hover:bg-blue-gray-50 text-left"
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
		</thead>
    )
}