"use client"

import { Timesheet, TimesheetDetailsExtended, TimesheetDetailsState } from "@/app/lib/definitions";
import { DateTime } from "luxon";
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

	localTimesheetWeekEnding: DateTime<true> | DateTime<false> | null;
	setLocalTimesheetWeekEnding: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

	databaseTimesheetWeekEnding: DateTime<true> | DateTime<false> | null;
	setDatabaseTimesheetWeekEnding: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;
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
	const [localTimesheetWeekEnding, setLocalTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);
	const [databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);

    return (
        <TimesheetContext.Provider
            value={{
                employeeid,
                selectedTimesheet, setSelectedTimesheet,
                timesheets, setTimesheets,
                localTimesheetDetails, setLocalTimesheetDetails,
                databaseTimesheetDetails, setDatabaseTimesheetDetails,
                timesheetDetailsState, setTimesheetDetailsState,
				localTimesheetWeekEnding, setLocalTimesheetWeekEnding,
				databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}