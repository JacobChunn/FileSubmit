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
    // Define table headers
	const TABLE_HEAD = [
		"ID", "Employee ID", "End Date", "Signed", "Approved", "Processed",
		"submittedby", "Reg", "OT", "Total",
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
			{/* <TableTextEntry<Timesheet, keyof Timesheet>
				dataProperty={''}
			/> */}

        </UserTable>
    )

}