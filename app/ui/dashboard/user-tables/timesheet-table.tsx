"use client"
import { Employee, Timesheet } from "@/app/lib/definitions";
import SortableTable from "@/app/ui/table/list-table";
import TableDoubleTextEntry from "../../table/entries/table-double-text-entry";
import TableBoolEntry from "../../table/entries/table-bool-entry";
import TableCheckEntry from "../../table/entries/table-check-entry";
import TableTextEntry from "../../table/entries/table-text-entry";
import TableEditEntry from "../../table/entries/table-edit-entry";
import TableUserAvatarEntry from "../../table/entries/table-user-avatar-entry";
import ListTable from "@/app/ui/table/list-table";
import UserTable from "../../table/user-table";
import TableDateEntry from "../../table/entries/table-date-entry";

export default function TimesheetTable({
	timesheetPromise,
}: {
	timesheetPromise: Promise<Timesheet[]>;
}) {
    // Define table headers + tabs + logic
	const TABLE_HEAD = [
		"id", "employeeid", "weekending", "processed", "mgrapproved", "usercommitted",
		"totalreghours", "totalovertime", "approvedby", "submittedby", "processedby",
		"dateprocessed", "message",
	] as const;

    return (
        <UserTable<Timesheet>
			title="Timesheets"
            dataPromise={timesheetPromise}
			TABLE_HEAD={TABLE_HEAD}
        >                
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
			{/* <TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={''}
			/> */}
        </UserTable>
    )

}