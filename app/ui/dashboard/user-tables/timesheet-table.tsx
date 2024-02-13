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
			{/* PFF, Name, and Email */}
			<TableUserAvatarEntry<Employee, keyof Employee>
				firstnameDataProperty={'firstname'}
				lastnameDataProperty={'lastname'}
				emailDataProperty={'email'}
			/>

			{/* Cell and Home Phone Numbers */}
			<TableDoubleTextEntry<Employee, keyof Employee>
				dataProperty1={'cellphone'}
				dataProperty2={'homephone'}
				addonStyles2="opacity-70"
			/>

			{/* Is Active Employee */}
			<TableBoolEntry<Employee, keyof Employee>
				dataProperty={'activeemployee'}
				trueText="Active"
				falseText="Inactive"
				/>

			{/* Is Contractor */}
			<TableBoolEntry<Employee, keyof Employee>
				dataProperty={'contractor'}
				trueText="Contractor"
				falseText="Employee"
				trueAddStyles="bg-softYellow text-yellow-800"
				falseAddStyles="bg-blue-200 text-blue-800"
			/>

			{/* Username and Password */}
			<TableDoubleTextEntry<Employee, keyof Employee>
				dataProperty1={'username'}
				dataProperty2={'password'}
				addonStyles2="opacity-70"
			/>

			{/* Number */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'number'}
			/>

			{/* Manager ID */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'managerid'}
			/>

			{/* Access Level */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'accesslevel'}
			/>

			{/* Timesheet Required */}
			<TableCheckEntry<Employee, keyof Employee>
				dataProperty={'timesheetrequired'}
			/>

			{/* Overtime Eligible */}
			<TableCheckEntry<Employee, keyof Employee>
				dataProperty={'overtimeeligible'}
			/>

			{/* Tab Navigate OT*/}
			<TableCheckEntry<Employee, keyof Employee>
				dataProperty={'tabnavigateot'}
			/>

			{/* Email Expense Copy */}
			<TableCheckEntry<Employee, keyof Employee>
				dataProperty={'emailexpensecopy'}
			/>

			{/* I Enter Time Data */}
			<TableCheckEntry<Employee, keyof Employee>
				dataProperty={'ientertimedata'}
			/>

			{/* Number of Sheet Summaries */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'numtimesheetsummaries'}
			/>

			{/* Number of Expense Summaries */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'numexpensesummaries'}
			/>

			{/* Number of Default Rows */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'numdefaulttimerows'}
			/>
			{/* ID */}
			<TableTextEntry<Employee, keyof Employee>
				dataProperty={'id'}
			/>

			{/* Edit User */}
			<TableEditEntry<Employee, keyof Employee>
				dataProperty={'id'}
				hrefBeforeID="/dashboard/employees/"
				hrefAfterID="/edit"
			/>
        </ListTable>
    )

}