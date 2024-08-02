"use client"
import React, { useContext } from 'react';
import { ApprovalContext } from './approval-context-wrapper';

export default function SubordinateTimesheet({
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

    const topTableHeaders: [React.ReactNode, number][] = [
		["", 1], ["", 1], ["", 1],
		["", 1],
		["", 1],
		["", 1],
		["", 1],
        ["", 1],
		["", 1],
		["", 1],
		["", 1],
	];

	const tableSubheaders = [
		"Project", "Phase - Cost Code", "Description", 
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa",
		"Su",
		"Tot",
	];

    return (
        <div className="w-full h-full bg-red-100 shadow-md rounded-lg pt-4 pb-6 px-4">
            <table className='w-full'>
                <thead className='w-full'>
                    <tr className='w-full'>
                        {topTableHeaders.map((val, index) => (
                            <th
                                key={"header"+index}
                                colSpan={val[1]}
                                className={`w-min h-min border-t ${index != 0 ? "border-l" : ""} border-blue-gray-100 bg-blue-gray-50/50 pt-4 px-2`}
                            >
                                <div
                                    className="flex items-center justify-center w-full h-full font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
                                >
                                    {val[0]}
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr className='w-full'>
                        {tableSubheaders.map((val, index) => (
                            <th
                                key={"subheader"+index}
                                className={`w-min h-min border-b border-blue-gray-100 bg-blue-gray-50/50 pt-2 pb-4 px-2`}
                            >
                                <div
                                    className="w-min h-min font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
                                >
                                    {val}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                {context.selectedSubordinate}
            </table>
        </div>
    );
}