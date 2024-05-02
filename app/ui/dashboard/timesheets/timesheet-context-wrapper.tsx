"use client"

import { Timesheet, TimesheetDetailsExtended, TimesheetDetailsState } from "@/app/lib/definitions";
import { DateTime } from "luxon";
import { createContext, useState } from "react";

type timesheetContextType = {
    employeeid: number;

    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;

    localTimesheets: Timesheet[] | null;
    setLocalTimesheets: React.Dispatch<React.SetStateAction<Timesheet[] | null>>;

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

    timesheetIsSaving: boolean;
    setTimesheetIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [localTimesheets, setLocalTimesheets] = useState<Timesheet[] | null>(null);
    const [localTimesheetDetails, setLocalTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [databaseTimesheetDetails, setDatabaseTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [timesheetDetailsState, setTimesheetDetailsState] = useState<TimesheetDetailsState>(null);
	const [localTimesheetWeekEnding, setLocalTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);
	const [databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [timesheetIsSaving, setTimesheetIsSaving] = useState<boolean>(false);

    return (
        <TimesheetContext.Provider
            value={{
                employeeid,
                selectedTimesheet, setSelectedTimesheet,
                localTimesheets, setLocalTimesheets,
                localTimesheetDetails, setLocalTimesheetDetails,
                databaseTimesheetDetails, setDatabaseTimesheetDetails,
                timesheetDetailsState, setTimesheetDetailsState,
				localTimesheetWeekEnding, setLocalTimesheetWeekEnding,
				databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding,
                timesheetIsSaving, setTimesheetIsSaving,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}