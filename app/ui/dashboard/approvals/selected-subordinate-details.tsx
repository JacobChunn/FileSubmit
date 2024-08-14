"use client"
import React, { useContext } from 'react';
import { ApprovalContext } from './approval-context-wrapper';
import SubordinateTimesheetDetails from './subordinate-timesheet-details';
import SubordinateExpenseDetails from './subordinate-expense-details';
import TimesheetDetailsWrapper from './timesheets/timesheet-details-wrapper';
import TimesheetDetailsHeader from './timesheets/details-header';
import ExpenseDetailsWrapper from './expenses/expense-details-wrapper';
import ExpenseDetailsHeader from './expenses/details-header';

export default function SelectedSubordinateDetails({
    children,
}: {
    children?: React.ReactNode,
}) {
    const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

    return (
        <>
            {context.selectedSubordinate && (
                context.selectedSubordinate[1] === "timesheet" ? 
                <TimesheetDetailsWrapper>
                    <TimesheetDetailsHeader/>
                    <SubordinateTimesheetDetails/> 
                </TimesheetDetailsWrapper>
                :
                <ExpenseDetailsWrapper>
                    <ExpenseDetailsHeader/>
                    <SubordinateExpenseDetails/>
                </ExpenseDetailsWrapper>
            )}
        </>
    );
}