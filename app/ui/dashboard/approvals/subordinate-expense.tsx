"use client"
import React, { useContext } from 'react';
import { ApprovalContext } from './approval-context-wrapper';
import { Tooltip } from '../../material-tailwind-wrapper';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function SubordinateExpense({
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

	const TravelHeader = (
		<div className='flex flex-row justify-center items-center'>
			Travel 
			<Tooltip content="Air/Train/Bus/Taxi">
				<InformationCircleIcon className="w-4 h-4"/>
			</Tooltip>
		</div>
	)

	const CarFeesHeader = (
		<div className='w-full flex flex-row justify-center items-center'>
			Car Fees 
			<Tooltip content="Parking/Tolls/Gas">
				<InformationCircleIcon className="w-full h-4"/>
			</Tooltip>
		</div>
	)

    const topTableHeaders: [React.ReactNode, number][] = [
		["", 1], ["", 1], ["", 1],
		[TravelHeader, 2],
		["Lodging", 1],
		[CarFeesHeader, 1],
		["Car Rental", 1],
		["Mileage", 2],
		["Perdiem", 1],
		["Ent.", 1],
		["Misc", 2],
		["", 1], ["", 1],
	];

	const tableSubheaders = [
		"Day", "Job", "Purpose", 
		"To/From", "Amount",
		"Amount",
		"Amount",
		"Amount",
		"Miles", "Amount",
		"Amount",
		"Amount",
		"Description", "Amount",
		"Total", ''
	];


    return (
        <div className="w-full h-full bg-blue-100 shadow-md rounded-lg pt-4 pb-6 px-4">
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