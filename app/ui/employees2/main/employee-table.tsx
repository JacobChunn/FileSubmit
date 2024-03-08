"use client"
import { Employee } from "@/app/lib/definitions";
import TableDoubleTextEntry from "../../table/entries/table-double-text-entry";
import TableBoolEntry from "../../table/entries/table-bool-entry";
import TableCheckEntry from "../../table/entries/table-check-entry";
import TableTextEntry from "../../table/entries/table-text-entry";
import TableEditEntry from "../../table/entries/table-edit-entry";
import TableUserAvatarEntry from "../../table/entries/table-user-avatar-entry";
import ListTable from "@/app/ui/table/list-table";

export default function EmployeeTable2({
	employeePromise,
}: {
	employeePromise: Promise<Employee[]>;
}) {
    // Define table headers + tabs + logic
	const TABLE_HEAD = [
		"Employee", "Cell/Home", "Employee Status", "Contractor Status", "Login", "Numeric ID", "Manager ID",
		"Access Level", "Timesheet Required", "Overtime Eligible", "Tab Navigate", "Email Expense Copy",
		"I Enter Time Data", "Sheet Summaries", "Expense Summaries", "Default Rows", "ID", "Edit"
	] as const;

    const TABS = [
        {
            label: "Active",
            value: "active",
        },
        {
            label: "Inactive",
            value: "inactive",
        },
        {
            label: "All",
            value: "all",
        },
    ] as const;

    function tabFilter(employee: Employee, tabValue: string) {
		switch (tabValue){
			case "active":
				return employee.activeemployee == true;
			case "inactive":
				return employee.activeemployee == false;
			case "all":
				return true;
            default:
                return false;
		}
	}


    return (
        <ListTable<Employee>
			title="Employee list"
			description="See information about all employees"
			addText="Add Employee"
			addHref="/dashboard/employees/add"
            dataPromise={employeePromise}
			TABLE_HEAD={TABLE_HEAD}
            TABS={TABS}
			defaultTabValue="active"
            tabFilterUnbound={tabFilter}
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