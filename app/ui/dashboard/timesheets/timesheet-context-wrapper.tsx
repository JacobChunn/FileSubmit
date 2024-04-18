"use client"

import { LocalTimesheetDetails, Timesheet, TimesheetDetails } from "@/app/lib/definitions";
import { createContext, useState } from "react";

type timesheetContextType = {
    employeeid: number;

    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;

    timesheets: Timesheet[] | null;
    setTimesheets: React.Dispatch<React.SetStateAction<Timesheet[] | null>>

    localTimesheetDetails: LocalTimesheetDetails[] | null;
    setLocalTimesheetDetails: React.Dispatch<React.SetStateAction<LocalTimesheetDetails[] | null>>
}

export const TimesheetContext = createContext<timesheetContextType | null>(null)

export default function TimesheetContextWrapper({
    employeeid,
    children,
}: {
    employeeid: number,
    children: React.ReactNode,
}) {

	const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);
    const [timesheets, setTimesheets] = useState<Timesheet[] | null>(null);
    const [localTimesheetDetails, setLocalTimesheetDetails] = useState<LocalTimesheetDetails[] | null>(null);

    return (
        <TimesheetContext.Provider
            value={{
                employeeid,
                selectedTimesheet, setSelectedTimesheet,
                timesheets, setTimesheets,
                localTimesheetDetails, setLocalTimesheetDetails,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}