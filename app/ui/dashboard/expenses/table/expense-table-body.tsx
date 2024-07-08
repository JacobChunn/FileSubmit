"use client"
import { useContext, useEffect, useState } from "react";
import { IconButton, Tooltip, Typography } from "../../../material-tailwind-wrapper";
import { DateTime } from "luxon";
import TextEntry from "../../entries/text-entry";
import DateEntry from "../../entries/date-entry";
import BoolEntry from "../../entries/bool-entry";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ExpenseContext } from "../expense-context-wrapper";
import { Expense } from "@/app/lib/definitions";

export default function ExpenseTableBody({
    children
}: {
    children?: React.ReactNode
}) {

    const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const [isFading, setIsFading] = useState(false);
	const [shouldRender, setShouldRender] = useState(true);

	useEffect(() => {
		if (context.selectedExpense == null) {
			setShouldRender(true);
			setTimeout(() => {
				setIsFading(false);
			}, 0); // Start fading in immediately
		} else {
			setIsFading(true);
			setTimeout(() => {
				setShouldRender(false);
			}, 300); // Duration should match the CSS transition duration
		}
	}, [context.selectedExpense]);

    const rowStyles = 'p-2 align-middle border-b border-blue-gray-50';
	const transitionStyles = ` transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-80'}`

    const databaseDS = context.databaseExpenseDateStart;
    const localDS = context.localExpenseDateStart;
    //console.log(databaseDS && localDS && databaseDS.equals(localDS));

    const handleEditDetails = (data: Expense) => {
        const dateString = data['datestart'];
        const jsDate = new Date(dateString);
        const luxonDateTime = DateTime.fromJSDate(jsDate);

        context.setSelectedExpense(data['id']);
        context.setLocalExpenseDateStart(luxonDateTime);
        context.setDatabaseExpenseDateStart(luxonDateTime);
    }


    return (
        <tbody className="w-full h-full">
            {context.localExpenses !== null ?
                context.localExpenses.map((data, index) => {
                    
                    const expenseIsSelected = data['id'] == context.selectedExpense;

                    const expenseSameDSStyles = databaseDS && localDS && databaseDS.equals(localDS) ? "text-blue-gray-900" : "text-red-500 italic underline";
                    const selectedExpenseUnsavedDateStyles = expenseIsSelected ? expenseSameDSStyles : "text-blue-gray-900";
                    return (
                        <tr key={index} className={`w-min h-12 ${expenseIsSelected ? "bg-blue-50" : "bg-white"}`}>
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

                            {/* Start Date */}
                            <td className={rowStyles + ` ${selectedExpenseUnsavedDateStyles}`}>
                                <Tooltip content="Edit Entry">
                                    <button
                                        className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-900/10 active:bg-gray-900/20"
                                        onClick={() => handleEditDetails(data)}
                                    >
                                        <DateEntry>
                                            {expenseIsSelected ? localDS?.toLocaleString() : data['datestart']}
                                        </DateEntry>
                                    </button>
                                </Tooltip>
                            </td>
							{shouldRender ? (
								<>
									{/* User Committed */}
									<td className={rowStyles + transitionStyles}>
										<BoolEntry>
											{data['usercommitted']}
										</BoolEntry>
									</td>

									{/* Approved */}
									<td className={rowStyles + transitionStyles}>
										<BoolEntry>
											{data['mgrapproved']}
										</BoolEntry>
									</td>

									{/* Paid */}
									<td className={rowStyles + transitionStyles}>
										<BoolEntry>
											{data['paid']}
										</BoolEntry>
									</td>

									{/* Signed By */}
									<td className={rowStyles + transitionStyles}>
										<TextEntry>
											{data['submittedby']}
										</TextEntry>
									</td>

									{/* Date Paid */}
									<td className={rowStyles + transitionStyles}>
										<DateEntry>
											{data['datepaid']}
										</DateEntry>
									</td>

									{/* Total */}
									<td className={rowStyles + transitionStyles}>
										<TextEntry>
											{"$" + Number(data['totalexpenses']).toFixed(2)}
										</TextEntry>
									</td>

									

									{/* Delete */}
									<td className={rowStyles + transitionStyles}>
										<Link href={"/dashboard/expenses/" + data['id'] + "/delete"}>
											<Tooltip content="Delete Entry">
												<IconButton variant="text">
													<TrashIcon className="h-4 w-4" />
												</IconButton>
											</Tooltip>
										</Link>
									</td>
								</>
							) : null}
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