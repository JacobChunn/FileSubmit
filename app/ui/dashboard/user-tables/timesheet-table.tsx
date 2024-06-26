"use client"
import { Timesheet } from "@/app/lib/definitions";
import TableCheckEntry from "../../table/entries/table-check-entry";
import TableTextEntry from "../../table/entries/table-text-entry";
import TableEditEntry from "../../table/entries/table-edit-entry";
import UserTable from "../../table/user-table";
import TableDateEntry from "../../table/entries/table-date-entry";
import TableDeleteEntry from "../../table/entries/table-delete-entry";
import TableArgumentEntry from "../../table/entries/table-argument-entry";
import { useContext } from "react";
import { TimesheetContext } from "../timesheets/timesheet-context-wrapper";
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

    // Define table headers
	const TABLE_HEAD = [
		"ID", "Employee ID", "End Date", "Signed", "Approved", "Processed",
		"Signed by", "Reg", "OT", "Total", "Edit", "Delete", "Edit Details",
	] as const;

    return (
        <UserTable<Timesheet>
			title="Timesheets"
			addHref="/dashboard/add"
			addText="Add Timesheet"
            dataPromise={timesheetPromise}
			TABLE_HEAD={TABLE_HEAD}
        >
			{/* ID */}
			<TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={'id'}
			/>

			{/* Employee ID */}
			<TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={'employeeid'}
			/>

			{/* End Date */}
			<TableDateEntry<Timesheet, keyof Timesheet>
				dataProperty={'weekending'}
			/>

			{/* Comment */}

			{/* User Committed */}
			<TableCheckEntry<Timesheet, keyof Timesheet>
				dataProperty={'usercommitted'}
			/>

			{/* Approved */}
			<TableCheckEntry<Timesheet, keyof Timesheet>
				dataProperty={'mgrapproved'}
			/>

			{/* Processed */}
			<TableCheckEntry<Timesheet, keyof Timesheet>
				dataProperty={'processed'}
			/>

			{/* Signed By */}
			<TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={'submittedby'}
			/>

			{/* Reg */}
			<TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={'totalreghours'}
			/>

			{/* OT */}
			<TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={'totalovertime'}
			/>

			{/* Total */}
			<TableArgumentEntry
				arg="INSERT_TOTAL"
			/>

			{/* Edit Timesheet*/}
			<TableEditEntry<Timesheet, keyof Timesheet>
				dataProperty={'id'}
				hrefBeforeID="/dashboard/"
				hrefAfterID="/edit"				
			/>

			{/* Delete */}
			<TableDeleteEntry<Timesheet, keyof Timesheet>
				dataProperty={'id'}
				hrefBeforeID="/dashboard/"
				hrefAfterID="/delete"				
			/>

			{/* Edit Details */}
			{/* <TableEditEntry<Timesheet, keyof Timesheet>
				dataProperty={'id'}
				hrefBeforeID="/dashboard/"
				hrefAfterID="/edit/details"				
			/> */}
			<button
			// 	onClick={() => context.setSelectedTimesheet()}
			>
				<Tooltip content="Edit Entry">
					<IconButton variant="text">
						<PencilIcon className="h-4 w-4"/>
					</IconButton>
				</Tooltip>
			</button>


        </UserTable>
    )

}