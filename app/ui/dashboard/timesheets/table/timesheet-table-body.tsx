"use client"
import { useContext } from "react";
import { TimesheetContext } from "./timesheet-wrapper";
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

    const rowStyles = 'p-2 align-middle border-b border-blue-gray-50';
    const variant = 'small';
    const color = 'blue-gray';
    const addonStyles = '';

    
    return (
        <tbody>
            {context.timesheets !== null ?
                context.timesheets.map((data, index) => (
                <tr key={index}>
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
                    <td className={rowStyles}>
                        <DateEntry>
                            {data['weekending']}
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
                            <IconButton variant="text" onClick={() => context.setSelectedTimesheet(data['id'])}>
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
                ))

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