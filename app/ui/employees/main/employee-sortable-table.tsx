"use client"
import { Employee } from "@/app/lib/definitions";
import SortableTable from "@/app/ui/sortable-table";
import TableDoubleTextEntry from "./table-double-text-entry";
import TableBoolEntry from "./table-bool-entry";
import TableCheckEntry from "./table-check-entry";
import TableTextEntry from "./table-text-entry";

export default function EmployeeSortableTable({
	employeePromise,
}: {
	employeePromise: Promise<Employee[]>;
}) {
    // Define tabs + logic
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
        <SortableTable<Employee>
            dataPromise={employeePromise}
            TABS={TABS}
            tabFilterUnbound={tabFilter}
        >                
                {/* PFF, Name, and Email */}
                {/* <td className={classes}>
                    <div className="flex flex-grow items-center gap-3">
                        <Avatar src={demoImg} alt={firstname} variant="rounded" className="max-w-none" />
                        <div className="flex flex-col">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {firstname} {lastname}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70 text-xs"
                            >
                                {email}
                            </Typography>
                        </div>
                    </div>
                </td> */}

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
                {/* <TableBoolEntry
                    condition={contractor}
                    rowStyles={classes}
                    trueText="Contractor"
                    falseText="Employee"
                    trueAddStyles="bg-softYellow text-yellow-800"
                    falseAddStyles="bg-blue-200 text-blue-800"
                /> */}

                {/* Username and Password */}
                {/* <td className={classes}>
                    <div className="flex flex-col">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {username}
                        </Typography>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            PASSWORD
                        </Typography>
                    </div>
                </td> */}

                {/* Number */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={number}
                /> */}

                {/* Manager ID */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={managerid}
                /> */}

                {/* Access Level */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={accesslevel}
                /> */}

                {/* Timesheet Required */}
                <TableCheckEntry<Employee, keyof Employee>
                    dataProperty={'timesheetrequired'}
                />

                {/* Overtime Eligible */}
                {/* <TableCheckEntry
                    condition={overtimeeligible}
                    rowStyles={classes}
                /> */}

                {/* Tab Navigate OT*/}
                {/* <TableCheckEntry
                    condition={tabnavigateot}
                    rowStyles={classes}
                /> */}

                {/* Email Expense Copy */}
                {/* <TableCheckEntry
                    condition={emailexpensecopy}
                    rowStyles={classes}
                /> */}

                {/* I Enter Time Data */}
                {/* <TableCheckEntry
                    condition={ientertimedata}
                    rowStyles={classes}
                /> */}

                {/* Number of Sheet Summaries */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={numtimesheetsummaries}
                /> */}

                {/* Number of Expense Summaries */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={numexpensesummaries}
                /> */}

                {/* Number of Default Rows */}
                <TableTextEntry<Employee, keyof Employee>
                    dataProperty={'numdefaulttimerows'}
                />
                {/* ID */}
                {/* <TableTextEntry 
                    classes={classes}
                    text={id}
                /> */}

                {/* Edit User */}
                {/* <td className={classes}>
                    <Link href={`/dashboard/employees/${id}/edit`}>
                        <Tooltip content="Edit User">
                            <IconButton variant="text">
                                <PencilIcon className="h-4 w-4" />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </td> */}
        </SortableTable>
    )

}