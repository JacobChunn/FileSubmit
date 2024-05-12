'use client';

import { useFormState } from 'react-dom';
import { ExpenseDetails, ExpenseOptions, SavingState } from '@/app/lib/definitions';
import { useContext, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import InputDetailsNumber from '@/app/ui/forms/general-helper-components/input-details-number';
import FormSubmitDetailsButton from '@/app/ui/forms/form-submit-details-button';
import InputDetailsDesc from '@/app/ui/forms/general-helper-components/input-details-desc';
import ControlledSelect from '@/app/ui/forms/general-helper-components/controlled-sel-w-desc';
import { compareExpenseDetailsExtended, compareDateStart } from '@/app/lib/utils';
import DoubleControlledSelect from '@/app/ui/forms/general-helper-components/double-controlled-sel-w-desc';
import { ExpenseContext } from '../expense-context-wrapper';
import { fetchExpenseDetailsEditFormData } from '@/app/lib/actions';

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
			compareDateStart(localDateStart, databaseDateStart)
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

	const tableHeaders = [
		"Project", "Phase - Cost Code", "Description",
		"Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", "Tot",
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

	type DayKey = 'mon' | 'tues' | 'wed' | 'thurs' | 'fri' | 'sat' | 'sun';
	type OvertimeKey = 'monot' | 'tuesot' | 'wedot' | 'thursot' | 'friot' | 'satot' | 'sunot';
	function calculateTotalHoursForDay(day: DayKey, overtime: OvertimeKey) {
		const details = context?.localExpenseDetails;
		return details ? 
			details.reduce((accumulator, currentValue) => {
				return accumulator + Number(currentValue[day]) + Number(currentValue[overtime]);
			}, 0) :
			0;
	}

	const monTot = calculateTotalHoursForDay('mon', 'monot');
	const tuesTot = calculateTotalHoursForDay('tues', 'tuesot');
	const wedTot = calculateTotalHoursForDay('wed', 'wedot');
	const thursTot = calculateTotalHoursForDay('thurs', 'thursot');
	const friTot = calculateTotalHoursForDay('fri', 'friot');
	const satTot = calculateTotalHoursForDay('sat', 'satot');
	const sunTot = calculateTotalHoursForDay('sun', 'sunot');

	const totalTot = monTot + tuesTot + wedTot + thursTot + friTot + satTot + sunTot;

	const isNotEditable = !(context.expenseDetailsState == "saved" || context.expenseDetailsState == "unsaved");
	const isNotSubmitable =
		context.expenseDetailsState == "saving" || 
		context.expenseDetailsState == "saved" ||
		context.expenseDetailsState == "signed";

	//const isNotEditable = false
	//const isNotSubmitable = false

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
				<thead>
					<tr>
						{tableHeaders.map((val, index) => (
							<th
								key={"header"+index}
							>
								{val}
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
							<td className={projectRowStyle}>
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

								{/* Project */}
								<ControlledSelect
									index={index}
									attr='projectid'
									info={"EXD" + index + "[" + "project" + "]"}
									value={val.projectid}
									dbValue={dbVal?.projectid}
									className = {selectStyle}
									disabled={isNotEditable}
								>
									{projectOptions}
								</ControlledSelect>
							</td>

							{/* PhaseCostCode*/}
							<td className={phaseCostCodeRowStyle}>
								<DoubleControlledSelect
									index={index}
									phaseAttr='phase'
									costcodeAttr='costcode'
									info={"EXD" + index + "[" + "phase_costcode" + "]"}
									phaseValue={val.phase}
									costcodeValue={val.costcode}
									phaseDbValue={dbVal?.phase}
									costcodeDbValue={dbVal?.costcode}
									className = {selectStyle}
									disabled={isNotEditable}
								>
									{phaseCostCodeOptions}
								</DoubleControlledSelect>
							</td>

							{/* Description */}
							<td className={descRowStyle}>
								<InputDetailsDesc
									index={index}
									attr='description'
									info={"EXD" + index + "[" + "description" + "]"}
									value={val.description}
									dbValue={dbVal?.description}
									readOnly={isNotEditable}
								/>
							</td>
							
							{/* Monday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='mon'
									info={"EXD" + index + "[" + "mon" + "]"}
									className={dayStyle}
									value={val.mon}
									dbValue={dbVal?.mon}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='monot'
									info={"EXD" + index + "[" + "monOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.monot}
									dbValue={dbVal?.monot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Tuesday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='tues'
									info={"EXD" + index + "[" + "tues" + "]"}
									className={dayStyle}
									value={val.tues}
									dbValue={dbVal?.tues}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='tuesot'
									info={"EXD" + index + "[" + "tuesOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.tuesot}
									dbValue={dbVal?.tuesot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Wednesday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='wed'
									info={"EXD" + index + "[" + "wed" + "]"}
									className={dayStyle}
									value={val.wed}
									dbValue={dbVal?.wed}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='wedot'
									info={"EXD" + index + "[" + "wedOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.wedot}
									dbValue={dbVal?.wedot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Thursday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='thurs'
									info={"EXD" + index + "[" + "thurs" + "]"}
									className={dayStyle}
									value={val.thurs}
									dbValue={dbVal?.thurs}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='thursot'
									info={"EXD" + index + "[" + "thursOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.thursot}
									dbValue={dbVal?.thursot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Friday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='fri'
									info={"EXD" + index + "[" + "fri" + "]"}
									className={dayStyle}
									value={val.fri}
									dbValue={dbVal?.fri}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='friot'
									info={"EXD" + index + "[" + "friOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.friot}
									dbValue={dbVal?.friot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Saturday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='sat'
									info={"EXD" + index + "[" + "sat" + "]"}
									className={dayStyle}
									value={val.sat}
									dbValue={dbVal?.sat}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='satot'
									info={"EXD" + index + "[" + "satOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.satot}
									dbValue={dbVal?.satot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Sunday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='sun'
									info={"EXD" + index + "[" + "sun" + "]"}
									className={dayStyle}
									value={val.sun}
									dbValue={dbVal?.sun}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='sunot'
									info={"EXD" + index + "[" + "sunOT" + "]"}
									className={dayStyle}
									isOT={true}
									value={val.sunot}
									dbValue={dbVal?.sunot}
									disabled={isNotEditable}
								/>
							</td>

							{/* Total */}
							<td className={dayRowStyle}>
								<div className="max-w-sm mx-auto m-0.5 bg-white border border-black">
									<p className='text-sm'>
										{Number(val.mon) + Number(val.tues) + Number(val.wed) + Number(val.thurs) + Number(val.fri) + Number(val.sat) + Number(val.sun)}
									</p>
								</div>
								<div className="max-w-sm mx-auto m-0.5 bg-zinc-200 border border-black">
									<p className='text-sm'>
										{Number(val.monot) + Number(val.tuesot) + Number(val.wedot) + Number(val.thursot) + Number(val.friot) + Number(val.satot) + Number(val.sunot)}

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
					<tr>
						<td colSpan={3}>
							<p className='text-right'>
								Total: 
							</p>
						</td>
						<td>
							{monTot}
						</td>
						<td>
							{tuesTot}
						</td>
						<td>
							{wedTot}
						</td>
						<td>
							{thursTot}
						</td>
						<td>
							{friTot}
						</td>
						<td>
							{satTot}
						</td>
						<td>
							{sunTot}
						</td>
						<td>
							{totalTot}
						</td>
					</tr>
				</tbody>
			</table>
            <FormSubmitDetailsButton
				submitDisabled={isNotSubmitable}
            /> 
        </form>
		// Add "row was removed" text somewhere
    );
}


