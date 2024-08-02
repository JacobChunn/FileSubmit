"use client"
import React, { useContext } from 'react';
import { ApprovalContext } from './approval-context-wrapper';
import SubordinateTimesheet from './subordinate-timesheet';
import SubordinateExpense from './subordinate-expense';

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
                <SubordinateTimesheet /> 
                : 
                <SubordinateExpense />
            )}
        </>
    );
}