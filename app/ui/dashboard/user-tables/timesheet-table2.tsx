"use client"
import { Timesheet } from "@/app/lib/definitions";
import { useContext, useEffect, useState } from "react";
import { TimesheetContext } from "../timesheets/timesheet-wrapper";
import { IconButton, Tooltip } from "../../material-tailwind-wrapper";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function TimesheetTable({
	timesheetPromise,
}: {
	timesheetPromise: Promise<Timesheet[]>;
}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const [data, setData] = useState<Timesheet[] | undefined>(undefined);

    useEffect(() => {
		const handleDataPromise = async() => {
			const returnedData = await timesheetPromise;
			setData(returnedData);
		}
		
		handleDataPromise();
	
	}, []);


	// Define table headers
	const TABLE_HEAD = [
		"ID", "Employee ID", "End Date", "Signed", "Approved", "Processed",
		"Signed by", "Reg", "OT", "Total", "Edit", "Delete", "Edit Details",
	] as const;

	return (
		<table className="w-full h-full">
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
				{data !== undefined ?
					<tbody>
						
					</tbody>
					:
					<div>Loading...</div>
				}

		</table>
	)

}