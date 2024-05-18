'use client';

import { useFormState } from 'react-dom';
import { ExpenseDetails, ExpenseOptions, SavingState } from '@/app/lib/definitions';
import { useContext, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { compareExpenseDetailsExtended, compareDates } from '@/app/lib/utils';
import { ExpenseContext } from '../expense-context-wrapper';
import { editExpenseDetails, fetchExpenseDetailsEditFormData } from '@/app/lib/actions';
import ControlledSelect from '@/app/ui/forms/expense-helper-components.tsx/controlled-sel-w-desc';
import InputDetailsDesc from '@/app/ui/forms/expense-helper-components.tsx/input-details-desc';
import InputDetailsNumber from '@/app/ui/forms/expense-helper-components.tsx/input-details-number';
import DeleteDetailButton from './delete-detail-button';
import FormSubmitDetailsButton from './details-submit-button';
import { Tooltip } from "@/app/ui/material-tailwind-wrapper";
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ExpenseDetailsEditForm({

}: {

}) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const expenseID = context.selectedExpense;

	if (expenseID == null) {
		throw new Error(
			"selectedExpense of ExpenseContext has not been set!"
		);
	}

	const [EXDDataAndOptions, setEXDDataAndOptions] = useState<{options: ExpenseOptions, expenseDetails: ExpenseDetails[]} | null>(null);
	const initialState = { message: null, errors: {} };
	const editExpenseDetailsWithID = editExpenseDetails.bind(null, expenseID);
    const [formState, dispatch] = useFormState(editExpenseDetailsWithID, initialState);

	useEffect(() => {
		const fetchData = async () => {
			console.log('EX-ID', expenseID);
			try {
				context.setLocalExpenseDetails(null);
				setEXDDataAndOptions(null);
				const EXDDataReturn = await fetchExpenseDetailsEditFormData(expenseID);

				setEXDDataAndOptions(EXDDataReturn);

				context.setLocalExpenseDetails(EXDDataReturn.expenseDetails);
				context.setDatabaseExpenseDetails(EXDDataReturn.expenseDetails);

				let initialExpenseDetailsState: SavingState;
				if (context.localExpenses?.find(expense => expense.id == expenseID)?.usercommitted) {
					initialExpenseDetailsState = "signed";
				} else {
					initialExpenseDetailsState = "saved";
				}
				context.setExpenseDetailsState(initialExpenseDetailsState);
			} catch (error) {
				console.error(error);
				notFound();
			}
		}

		fetchData();
	}, [expenseID]);

	// Change EXD state to saved upon successful save
	useEffect(() => {
		console.log("formState: " + JSON.stringify(formState));

		let expenseDetailsState: SavingState;
		if (context.expenseDetailsState === "signed") {
			expenseDetailsState = "signed";
		} else if (context.expenseDetailsState === null) {
			expenseDetailsState = null;
		} else if (formState.success === true) {
			expenseDetailsState = "saved";
		} else {
			expenseDetailsState = "unsaved";
		}

		let newDbExpenseDetails;
		let newDbDateStart;
		let newLocalExpenses;
		if (formState.success == false) {
			newDbExpenseDetails = context.databaseExpenseDetails;
			newDbDateStart = context.databaseExpenseDateStart;
			newLocalExpenses = context.localExpenses;
		} else {
			newDbExpenseDetails = context.localExpenseDetails;
			newDbDateStart = context.localExpenseDateStart;
			// Update selected expense date start
			newLocalExpenses = context.localExpenses;
			if (newLocalExpenses && newDbDateStart) {
				let toBeChangedExpense = newLocalExpenses.find((ts) => ts.id == context.selectedExpense);
				if (toBeChangedExpense) {
					toBeChangedExpense.datestart = newDbDateStart.toLocaleString();
				}
			}
		}
		
		context.setLocalExpenses(newLocalExpenses);
		context.setDatabaseExpenseDateStart(newDbDateStart);
		context.setDatabaseExpenseDetails(newDbExpenseDetails);
		context.setExpenseDetailsState(expenseDetailsState);
	},[formState])

	useEffect(() => {
		const localEXDs = context.localExpenseDetails;
		const dbEXDs = context.databaseExpenseDetails;
		const localDateStart = context.localExpenseDateStart;
		const databaseDateStart = context.databaseExpenseDateStart;

		let expenseDetailsState: SavingState;
		if (context.expenseDetailsState === "signed") {
			expenseDetailsState = "signed";
		} else if (context.expenseDetailsState === null) {
			expenseDetailsState = null;
		} else if (
			compareExpenseDetailsExtended(localEXDs, dbEXDs) && 
			compareDates(localDateStart, databaseDateStart)
		) {
			expenseDetailsState = "saved";
		} else {
			expenseDetailsState = "unsaved";
		}
		context.setExpenseDetailsState(expenseDetailsState);
	}, [
		context.localExpenseDetails,
		context.databaseExpenseDetails,
		context.localExpenseDateStart,
		context.databaseExpenseDetails
	]);

	if (!EXDDataAndOptions) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, expenseDetails} = EXDDataAndOptions;
		
	if (expenseDetails == null) {
		console.log("notfound2")
		notFound();
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
		["", 1], ["", 1],
		[TravelHeader, 2],
		["Lodging", 1],
		[CarFeesHeader, 1],
		["Car Rental", 1],
		["Mileage", 2],
		["Perdiem", 1],
		["Ent.", 1],
		["Misc", 2],
		["", 1],
	];

	const tableSubheaders = [
		"Job", "Purpose", 
		"To/From", "Amount",
		"Amount",
		"Amount",
		"Amount",
		"Miles", "Amount",
		"Amount",
		"Amount",
		"Description", "Amount",
		"Total"
	];

    const {projects, misc} = options;

    // Changes to focused version after focused
    const projectOptions = projects.map((val, index) => (
        <option
			value={val.id}
			className=' bg-white'
			key={"key-" + val.id + "-" + index}
			unfocused-label={val.number + ":" + val.shortname}
		>
			{val.number + ":" + val.description}
		</option>
    ));

	const miscOptions = misc.map((val, index) => (
        <option
			value={val.id}
			className=' bg-white'
			key={"key-" + val.id + "-" + index}
		>
			{val.description}
		</option>
    ));

	const EXDLen = context.localExpenseDetails?.length || 0;

	const mileage = context.localExpenseDetails?.[0]?.mileage ?? 0;

	type ExpenseTotalKey = 'transportation' | 'lodging' | 'cabsparking' | 'carrental' | 'miles' | 'perdiem' | 'entertainment' | 'miscvalue';
	function calculateTotal(key: ExpenseTotalKey) {
		const details = context?.localExpenseDetails;
		return details ? 
			details.reduce((accumulator, currentValue) => {
				return accumulator + Number(currentValue[key]);
			}, 0) :
			0;
	}

	const transportationTot = calculateTotal('transportation');
	const lodgingTot = calculateTotal('lodging');
	const cabsparkingTot = calculateTotal('cabsparking');
	const carrentalTot = calculateTotal('carrental');
	const milesTot = calculateTotal('miles'); // Note - this is just miles, not mileage
	const perdiemTot = calculateTotal('perdiem');
	const entertainmentTot = calculateTotal('entertainment');
	const miscvalueTot = calculateTotal('miscvalue');

	
	const mileageTot = milesTot * mileage;
	const totalTot = transportationTot + lodgingTot + cabsparkingTot + carrentalTot + mileageTot + perdiemTot + entertainmentTot + miscvalueTot;

	const isNotEditable = !(context.expenseDetailsState == "saved" || context.expenseDetailsState == "unsaved");
	const isNotSubmitable =
		context.expenseDetailsState == "saving" || 
		context.expenseDetailsState == "saved" ||
		context.expenseDetailsState == "signed";

	const dispatchWrapper = (payload: FormData) => {
		context.setExpenseDetailsState("saving");
		dispatch(payload);
	}
	const projectRowStyle = 'w-48';
	const phaseCostCodeRowStyle = 'w-32';
	const descRowStyle = 'w-max h-10';
	const dayRowStyle = 'w-11';

    const dayStyle = 'h-1/2 w-full p-0';
	const selectStyle = 'h-full w-full';

    return (
        <form
            action={dispatchWrapper}
            className='w-full h-full'
			key={"form" + expenseID}
			id={"form" + expenseID}
        >
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
				<tbody className='w-full'>
				{context.localExpenseDetails && context.databaseExpenseDetails ? context.localExpenseDetails.map((val, index) => {
					const dbEXDs = context.databaseExpenseDetails;
					const dbEXDsLen = dbEXDs ? dbEXDs.length : 0;

					const dbVal = dbEXDsLen > index && dbEXDs ? 
						dbEXDs[index] : null;

					return (
						<tr
							key={"k-" + index + expenseID}
							className='w-full h-full'
						>
							<td className={'w-32'}>
								{/* Hidden EXD id */}
								<input
									id={"EXD" + index + "[" + "id" + "]"}
									key={"EXD" + index + "[" + "id" + "]"}
									name={"EXD" + index + "[" + "id" + "]"}
									value={val.id}
									className='w-0'
									readOnly
									hidden
								/>

								{/* Job */}
								<ControlledSelect
									index={index}
									attr='jobid'
									info={"EXD" + index + "[" + "jobid" + "]"}
									value={val.jobid}
									dbValue={dbVal?.jobid}
									className = {selectStyle}
									disabled={isNotEditable}
								>
									{projectOptions}
								</ControlledSelect>
							</td>

							{/* Purpose */}
							<td className={"w-max"}>
								<InputDetailsDesc
									index={index}
									attr='purpose'
									info={"EXD" + index + "[" + "purpose" + "]"}
									value={val.purpose}
									dbValue={dbVal?.purpose}
									readOnly={isNotEditable}
								/>
							</td>

							{/* Travel To/From */}
							<td className={"w-max"}>
								<InputDetailsDesc
									index={index}
									attr='transportwhere'
									info={"EXD" + index + "[" + "transportwhere" + "]"}
									value={val.transportwhere}
									dbValue={dbVal?.transportwhere}
									readOnly={isNotEditable}
								/>
							</td>

							{/* Travel Amount */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='transportation'
									info={"EXD" + index + "[" + "transportation" + "]"}
									value={val.transportation}
									dbValue={dbVal?.transportation}
									disabled={isNotEditable}
								/>
							</td>

							{/* Lodging */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='lodging'
									info={"EXD" + index + "[" + "lodging" + "]"}
									value={val.lodging}
									dbValue={dbVal?.lodging}
									disabled={isNotEditable}
								/>
							</td>

							{/* Parking/Tolls/Gas */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='cabsparking'
									info={"EXD" + index + "[" + "cabsparking" + "]"}
									value={val.cabsparking}
									dbValue={dbVal?.cabsparking}
									disabled={isNotEditable}
								/>
							</td>

							{/* Car Rental */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='carrental'
									info={"EXD" + index + "[" + "carrental" + "]"}
									value={val.carrental}
									dbValue={dbVal?.carrental}
									disabled={isNotEditable}
								/>
							</td>

							{/* Mileage Miles */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='miles'
									info={"EXD" + index + "[" + "miles" + "]"}
									value={val.miles}
									dbValue={dbVal?.miles}
									disabled={isNotEditable}
								/>
							</td>

							{/* Mileage Amount - This is just a display*/}
							<td className={"w-20"}>
								<div className="max-w-sm mx-auto py-2.5 bg-white border border-black">
									<p className='text-sm px-1'>
										{Number(val.transportation) + Number(val.lodging) + Number(val.cabsparking) + Number(val.carrental) + (Number(val.miles) * Number(val.mileage)) + Number(val.perdiem) + Number(val.entertainment) + Number(val.miscvalue)}
									</p>
								</div>
							</td>

							{/* Perdiem */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='perdiem'
									info={"EXD" + index + "[" + "perdiem" + "]"}
									value={val.perdiem}
									dbValue={dbVal?.perdiem}
									disabled={isNotEditable}
								/>
							</td>

							{/* Entertainment */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='entertainment'
									info={"EXD" + index + "[" + "entertainment" + "]"}
									value={val.entertainment}
									dbValue={dbVal?.entertainment}
									disabled={isNotEditable}
								/>
							</td>

							{/* Misc Description */}
							{/* changing the width to 48 makes the description change size when resizing??? */}
							<td className={"w-32"}> 
								<ControlledSelect
									index={index}
									attr='miscid'
									info={"EXD" + index + "[" + "miscid" + "]"}
									value={val.miscid}
									dbValue={dbVal?.miscid}
									className = {selectStyle}
									disabled={isNotEditable}
								>
									{miscOptions}
								</ControlledSelect>
							</td>

							{/* Misc Amount */}
							<td className={"w-11"}>
								<InputDetailsNumber
									index={index}
									attr='miscvalue'
									info={"EXD" + index + "[" + "miscvalue" + "]"}
									value={val.miscvalue}
									dbValue={dbVal?.miscvalue}
									disabled={isNotEditable}
								/>
							</td>

							{/* Total - this is just a display */}
							<td className={"w-20"}>
								<div className="w-full py-2.5 bg-white border border-black">
									<p className='w-full text-sm px-1'>
										{Number(val.transportation) + Number(val.lodging) + Number(val.cabsparking) + Number(val.carrental) + (Number(val.miles) * Number(val.mileage)) + Number(val.perdiem) + Number(val.entertainment) + Number(val.miscvalue)}
									</p>
								</div>
							</td>

							{/* Delete EXD */}
							<td className='h-10 w-11'>
								<DeleteDetailButton
									index={index}
									hidden={isNotEditable}
								/>
							</td>
						</tr>
					)
				}) : null}
					{/* <tr>
						<td colSpan={3}>
							<p className='text-right'>
								Total: 
							</p>
						</td>
						<td>
							{transportationTot}
						</td>
						<td>
							{lodgingTot}
						</td>
						<td>
							{cabsparkingTot}
						</td>
						<td>
							{carrentalTot}
						</td>
						<td>
							{milesTot}
						</td>
						<td>
							{mileageTot}
						</td>
						<td>
							{perdiemTot}
						</td>
						<td>
							{entertainmentTot}
						</td>
						<td colSpan={2}>
							{miscvalueTot}
						</td>
						<td>
							{totalTot}
						</td>
					</tr> */}
				</tbody>
			</table>
            <FormSubmitDetailsButton
				submitDisabled={isNotSubmitable}
            /> 
        </form>
    );
}


