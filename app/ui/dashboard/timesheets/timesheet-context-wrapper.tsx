"use client"

import { Timesheet, TimesheetDetails, TimesheetDetailsExtended, TimesheetDetailsState } from "@/app/lib/definitions";
import { createContext, useState } from "react";

type timesheetContextType = {
    employeeid: number;

    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;

    timesheets: Timesheet[] | null;
    setTimesheets: React.Dispatch<React.SetStateAction<Timesheet[] | null>>;

    localTimesheetDetails: TimesheetDetailsExtended[] | null;
    setLocalTimesheetDetails: React.Dispatch<React.SetStateAction<TimesheetDetailsExtended[] | null>>;

    databaseTimesheetDetails: TimesheetDetailsExtended[] | null;
    setDatabaseTimesheetDetails: React.Dispatch<React.SetStateAction<TimesheetDetailsExtended[] | null>>;

    timesheetDetailsState: TimesheetDetailsState;
    setTimesheetDetailsState: React.Dispatch<React.SetStateAction<TimesheetDetailsState>>;
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
    const [localTimesheetDetails, setLocalTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [databaseTimesheetDetails, setDatabaseTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [timesheetDetailsState, setTimesheetDetailsState] = useState<TimesheetDetailsState>(null);

    return (
        <TimesheetContext.Provider
            value={{
                employeeid,
                selectedTimesheet, setSelectedTimesheet,
                timesheets, setTimesheets,
                localTimesheetDetails, setLocalTimesheetDetails,
                databaseTimesheetDetails, setDatabaseTimesheetDetails,
                timesheetDetailsState, setTimesheetDetailsState,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}