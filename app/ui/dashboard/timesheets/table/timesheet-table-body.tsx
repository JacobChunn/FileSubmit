"use client"
import { useContext, useEffect } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { IconButton, Tooltip, Typography } from "../../../material-tailwind-wrapper";
import { DateTime } from "luxon";
import TextEntry from "./entries/text-entry";
import DateEntry from "./entries/date-entry";
import BoolEntry from "./entries/bool-entry";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TimesheetTableBody({
    children
}: {
    children?: React.ReactNode
}) {

    const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

    //const rowStyles = '';
    const rowStyles = 'p-2 align-middle border-b border-blue-gray-50';
    const variant = 'small';
    const color = 'blue-gray';
    const addonStyles = '';
    
    const databaseWE = context.databaseTimesheetWeekEnding;
    const localWE = context.localTimesheetWeekEnding;
    console.log(databaseWE && localWE && databaseWE.equals(localWE));

    return (
        <tbody className="w-full h-full">
            {context.localTimesheets !== null ?
                context.localTimesheets.map((data, index) => {
                    if (context.databaseTimesheets == null) {
                        return (
                            <tr className="bg-red-600">ERROR! - Discrepancy in local and database timesheets.</tr>
                        )
                    }
                    
                    const timesheetIsSelected = data['id'] == context.selectedTimesheet;

                    const timesheetSameWEStyles = databaseWE && localWE && databaseWE.equals(localWE) ? "text-blue-gray-900" : "text-red-500 italic underline";
                    const selectedTSUnsavedDateStyles = timesheetIsSelected ? timesheetSameWEStyles : "text-blue-gray-900";
                    return (
                        <tr key={index} className={`w-min h-12 ${timesheetIsSelected ? "bg-blue-50" : "bg-white"}`}>
                            {/* ID */}
                            {/* <td className={rowStyles}>
                                <TextEntry>
                                    {data['id']}
                                </TextEntry>
                            </td> */}

                            {/* Employee ID */}
                            {/* <td className={rowStyles}>
                                <TextEntry>
                                    {data['employeeid']}
                                </TextEntry>
                            </td> */}

                            {/* End Date */}
                            <td className={rowStyles + ` ${selectedTSUnsavedDateStyles}`}>
                                <DateEntry>
                                    {timesheetIsSelected ? localWE?.toLocaleString() : data['weekending']}
                                </DateEntry>
                            </td>

                            {/* Comment */}


                            {/* User Committed */}
                            <td className={rowStyles}>
                                <BoolEntry>
                                    {data['usercommitted']}
                                </BoolEntry>
                            </td>

                            {/* Approved */}
                            <td className={rowStyles}>
                                <BoolEntry>
                                    {data['mgrapproved']}
                                </BoolEntry>
                            </td>

                            {/* Processed */}
                            <td className={rowStyles}>
                                <BoolEntry>
                                    {data['processed']}
                                </BoolEntry>
                            </td>

                            {/* Signed By */}
                            <td className={rowStyles}>
                                <TextEntry>
                                    {data['submittedby']}
                                </TextEntry>
                            </td>

                            {/* Reg */}
                            <td className={rowStyles}>
                                <TextEntry>
                                    {data['totalreghours']}
                                </TextEntry>
                            </td>

                            {/* OT */}
                            <td className={rowStyles}>
                                <TextEntry>
                                    {data['totalovertime']}
                                </TextEntry>
                            </td>

                            {/* Total */}
                            <td className={rowStyles}>
                                <TextEntry>
                                    {Number(data['totalreghours']) + Number(data['totalovertime'])}
                                </TextEntry>
                            </td>

                            {/* Edit Timesheet*/}
                            {/* <td className={rowStyles}>
                                <Typography
                                    variant={variant}
                                    color={color}
                                    className={`font-normal text-blue-gray-900 text-xs ${addonStyles}`}
                                >
                                    {data['id']}
                                </Typography>
                            </td> */}

                            {/* Edit Details */}
                            <td className={rowStyles}>
                                <Tooltip content="Edit Entry">
                                    <IconButton variant="text"
                                        onClick={() => {
                                            const dateString = data['weekending'];
                                            const jsDate = new Date(dateString);
                                            const luxonDateTime = DateTime.fromJSDate(jsDate);

                                            context.setSelectedTimesheet(data['id']);
                                            context.setLocalTimesheetWeekEnding(luxonDateTime);
                                            context.setDatabaseTimesheetWeekEnding(luxonDateTime);
                                        }}
                                    >
                                        <PencilIcon className="h-4 w-4"/>
                                    </IconButton>
                                </Tooltip>
                            </td>

                            {/* Delete */}
                            <td className={rowStyles}>
                                <Link href={"/dashboard/" + data['id'] + "/delete"}>
                                    <Tooltip content="Delete Entry">
                                        <IconButton variant="text">
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </Link>
                            </td>

                        </tr>
                    )
                })

                :
                <tr>
                    <td>
                        Loading...
                    </td>
                </tr>
            }
        </tbody>
    )
}