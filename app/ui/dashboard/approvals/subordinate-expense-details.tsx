"use client"
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { ApprovalContext } from './approval-context-wrapper';
import { Tooltip } from '../../material-tailwind-wrapper';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import assert from 'assert';
import { AllRates, ExpenseDetailsExtended, ExpenseOptions, ExpenseRates, SavingState } from '@/app/lib/definitions';
import { useFormState } from 'react-dom';
import { fetchSubordinateExpenseDetailsEditFormData, managerEditExpenseDetails } from '@/app/lib/actions';
import { compareExpenseDetailsExtended, getMostRecentRate, processRateArray } from '@/app/lib/utils';
import { notFound } from 'next/navigation';
import ControlledSelect from './expenses/controlled-sel-w-desc';
import InputDetailsDesc from './expenses/input-details-desc';
import InputDetailsNumber from './expenses/input-details-number';
import DeleteDetailButton from './expenses/delete-detail-button';
import DaySelector from './expenses/day-selector';
import ExpenseDetailButtons from './expenses/expense-detail-buttons';

export default function SubordinateExpenseDetails({
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

	const subordinateID = context.selectedSubordinate ? context.selectedSubordinate[0] : null
    const localSelectedExpense = context.localSubordinateExpenses?.find(expense => expense.subordinateid === subordinateID);
    const dBSelectedExpense = context.dBSubordinateExpenses?.find(expense => expense.subordinateid === subordinateID);

	if (subordinateID == null) {
		throw new Error(
			"selectedSubordinate of ApprovalContext has not been set!"
		);
	}

    if (!localSelectedExpense || !dBSelectedExpense) {
		throw new Error(
			"employeeid does not exist in subordinate expenses!"
		);
	}

    assert(localSelectedExpense.id == dBSelectedExpense.id);

    const expenseID = dBSelectedExpense.id;

	const [EXDRateAndOptions, setEXDRateAndOptions] = useState<{options: ExpenseOptions, rates: ExpenseRates} | null>(null);
	const [currentMileage, setCurrentMileage] = useState<number | null>(null);
	const [currentPerdiem, setCurrentPerdiem] = useState<number | null>(null);
	const [allRates, setAllRates] = useState<AllRates | null>(null);
	const initialState = { message: null, errors: {} };
	const editExpenseDetailsWithID = managerEditExpenseDetails.bind(null, subordinateID, expenseID);
    const [formState, dispatch] = useFormState(editExpenseDetailsWithID, initialState);

	useEffect(() => {
		const fetchData = async () => {
			console.log('EX-ID', expenseID);
			try {
				context.setLocalSubordinateDetails(null);
				setEXDRateAndOptions(null);

				const EXDDataReturn = await fetchSubordinateExpenseDetailsEditFormData(subordinateID, expenseID);
				setEXDRateAndOptions({options: EXDDataReturn.options, rates: EXDDataReturn.rates});

				const processedRates = {
					mileage: processRateArray(EXDDataReturn.rates.mileage),
					perdiem: processRateArray(EXDDataReturn.rates.perdiem)
				}

				setAllRates(processedRates);

				if (!context.expenseDatestart) {
					throw new Error(
						"expenseDatestart of ApprovalContext has not been set!"
					);
				}

				let mileage = getMostRecentRate(processedRates.mileage, context.expenseDatestart);
				let perdiem = getMostRecentRate(processedRates.perdiem, context.expenseDatestart);

				setCurrentMileage(mileage);
				setCurrentPerdiem(perdiem);

				context.setLocalSubordinateDetails(EXDDataReturn.expenseDetails);
				context.setDbSubordinateDetails(EXDDataReturn.expenseDetails);

				//const mileageData = await fetchMileageData();

				let initialExpenseDetailsState: SavingState;
				if (context.localSubordinateExpenses?.find(expense => expense.id == expenseID)?.usercommitted) {
					initialExpenseDetailsState = "signed";
				} else {
					initialExpenseDetailsState = "saved";
				}
				context.setSubordinateDetailsState(initialExpenseDetailsState);
			} catch (error) {
				console.error(error);
				notFound();
			}
		}

		fetchData();
	}, [context.selectedSubordinate]);

	// Change EXD state to saved upon successful save
	useEffect(() => {
		console.log("formState: " + JSON.stringify(formState));

		let expenseDetailsState: SavingState;
		if (context.subordinateDetailsState === "signed") {
			expenseDetailsState = "signed";
		} else if (context.subordinateDetailsState === null) {
			expenseDetailsState = null;
		} else if (formState.success === true) {
			expenseDetailsState = "saved";
		} else {
			expenseDetailsState = "unsaved";
		}

		let newDbExpenseDetails;
		if (formState.success == false) {
			newDbExpenseDetails = context.dbSubordinateDetails;
		} else {
			newDbExpenseDetails = context.localSubordinateDetails;
		}
		
		context.setDbSubordinateDetails(newDbExpenseDetails);
		context.setSubordinateDetailsState(expenseDetailsState);
	},[formState])

	useEffect(() => {
		const localEXDs = context.localSubordinateDetails as ExpenseDetailsExtended[];
		const dbEXDs = context.dbSubordinateDetails as ExpenseDetailsExtended[];

		console.log('localEXDs: ', localEXDs);
		console.log('dbEXDs: ', dbEXDs);

		let expenseDetailsState: SavingState;
		if (context.subordinateDetailsState === "signed") {
			expenseDetailsState = "signed";
		} else if (context.subordinateDetailsState === null) {
			expenseDetailsState = null;
		} else if (
			compareExpenseDetailsExtended(localEXDs, dbEXDs)
		) {
			expenseDetailsState = "saved";
		} else {
			expenseDetailsState = "unsaved";
		}
		context.setSubordinateDetailsState(expenseDetailsState);
	}, [
		context.localSubordinateDetails,
		context.dbSubordinateDetails,
	]);

	useEffect(() => {
		console.log("context.expenseDatestart changed!")
		let mileage = null;
		let perdiem = null;
		const dateStart = context.expenseDatestart;
		// recalculate current mileage and perdiem

		if (allRates && dateStart) {
			mileage = getMostRecentRate(allRates.mileage, dateStart);
			perdiem = getMostRecentRate(allRates.perdiem, dateStart);
		}

		setCurrentMileage(mileage);
		setCurrentPerdiem(perdiem);
	}, [context.expenseDatestart]);

	//console.log("currentMileage: ", currentMileage);
	//console.log("currentPerdiem: ", currentPerdiem);
	//console.log("context.localExpenseDateStart", context.localExpenseDateStart?.toLocaleString());

	if (!EXDRateAndOptions || !currentMileage || !currentPerdiem) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, rates} = EXDRateAndOptions;
		
	if (!context.localSubordinateDetails) {
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
		["", 1], ["", 1], ["", 1],
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
		"Day", "Job", "Purpose", 
		"To/From", "Amount",
		"Amount",
		"Amount",
		"Amount",
		"Miles", "Amount",
		"Amount",
		"Amount",
		"Description", "Amount",
		"Total",
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

	const mileage = currentMileage;
	const perdiem = currentPerdiem;

	type ExpenseTotalKey = 'transportation' | 'lodging' | 'cabsparking' | 'carrental' | 'miles' | 'perdiem' | 'entertainment' | 'miscvalue';
	function calculateTotal(key: ExpenseTotalKey) {
		const details = context?.localSubordinateDetails;
		return details ? 
			(details as ExpenseDetailsExtended[]).reduce((accumulator, currentValue) => {
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

	const isNotEditable = !(
		context.subordinateDetailsState == "saved" ||
		context.subordinateDetailsState == "unsaved" ||
		context.subordinateDetailsState == "saving"
	);
	const isNotSubmitable =
		context.subordinateDetailsState == "saving" || 
		context.subordinateDetailsState == "saved" ||
		context.subordinateDetailsState == "signed" ||
		context.subordinateDetailsState == "approved";

	const dispatchWrapper = (payload: FormData) => {
		context.setSubordinateDetailsState("saving");
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
				{context.localSubordinateDetails && context.dbSubordinateDetails ? (context.localSubordinateDetails as ExpenseDetailsExtended[]).map((val, index) => {
					const dbEXDs = context.dbSubordinateDetails;
					const dbEXDsLen = dbEXDs ? dbEXDs.length : 0;

					const dbVal = dbEXDsLen > index && dbEXDs ? 
						(dbEXDs as ExpenseDetailsExtended[])[index] : null;

					return (
						<Fragment key={'fragment-' + index}>
							<tr
								key={"k-" + index + expenseID}
								className={`w-full h-full ${context.selectedExpenseDetails == index ? 'bg-blue-500' : 'bg-white'}`}
							>
								{/* Day */}
								<td>
									<DaySelector
										index={index}
									/>
								</td>
								<td className={'w-24'} >
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
								<td className={"w-auto"}>
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
								<td className={"w-auto"}>
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
											{(Number(val.miles) * Number(mileage)).toFixed(2)}
										</p>
									</div>
								</td>
								{/* Perdiem */}
								<td className={"w-11"}>
								<div className="max-w-sm mx-auto py-2.5 bg-white border border-black">
										<p className='text-sm px-1'>
											{Number(perdiem).toFixed(2)}
										</p>
									</div>
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
											{(Number(val.transportation) + Number(val.lodging) + Number(val.cabsparking) + Number(val.carrental) + (Number(val.miles) * Number(mileage)) + Number(perdiem) + Number(val.entertainment) + Number(val.miscvalue)).toFixed(2)}
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
							{/* Entertainment Dropdown */}
							<tr
								key={'dropdown-' + index + expenseID}
								className={`h-10 bg-blue-50 ${context?.selectedExpenseDetails == index ? '' : 'hidden'}`}
							>
								<td colSpan={16}>
									<table className='w-full'>
										<thead>
											<tr>
												<th>Entertainment:</th>
												<th>Misc Details:</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<div className='grid grid-cols-[min-content,1fr] gap-4 p-4'>
														<label className='text-sm self-center'>Location:</label>
														<InputDetailsDesc
															index={index}
															attr='entlocation'
															info={"EXD" + index + "[" + "entlocation" + "]"}
															value={val.entlocation}
															dbValue={dbVal?.entlocation}
															readOnly={isNotEditable}
														/>
														
														<label className='text-sm self-center'>Activity:</label>
														<InputDetailsDesc
															index={index}
															attr='entactivity'
															info={"EXD" + index + "[" + "entactivity" + "]"}
															value={val.entactivity}
															dbValue={dbVal?.entactivity}
															readOnly={isNotEditable}
														/>

														<label className='text-sm self-center'>People:</label>
														<InputDetailsDesc
															index={index}
															attr='entwho'
															info={"EXD" + index + "[" + "entwho" + "]"}
															value={val.entwho}
															dbValue={dbVal?.entwho}
															readOnly={isNotEditable}
														/>

														<label className='text-sm self-center'>Purpose:</label>
														<InputDetailsDesc
															index={index}
															attr='entpurpose'
															info={"EXD" + index + "[" + "entpurpose" + "]"}
															value={val.entpurpose}
															dbValue={dbVal?.entpurpose}
															readOnly={isNotEditable}
														/>
													</div>
												</td>
												<td className='p-4 align-top'>
													<InputDetailsDesc
														index={index}
														attr='miscdetail'
														info={"EXD" + index + "[" + "miscdetail" + "]"}
														value={val.miscdetail}
														dbValue={dbVal?.miscdetail}
														readOnly={isNotEditable}
													/>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</Fragment>
					)
				}) : null}
					<tr>
						<td colSpan={4}>
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
							{mileageTot.toFixed(2)}
						</td>
						<td>
							{perdiemTot.toFixed(2)}
						</td>
						<td colSpan={2}>
							{entertainmentTot}
						</td>
						<td>
							{miscvalueTot}
						</td>
						<td>
							{totalTot.toFixed(2)}
						</td>
					</tr>
				</tbody>
				{context.selectedSubordinate}
			</table>
			<ExpenseDetailButtons
				submitDisabled={isNotSubmitable}
				mileage={mileage}
				perdiem={perdiem}
			/>
		</form>
    );
}