'use client';

import { deleteTimesheetDetails, editTimesheetDetails, fetchTimesheetDetailsEditFormData } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Options, TimesheetDetails, SavingState } from '@/app/lib/definitions';
import FormTextEntry from '@/app/ui/forms/edit-form/form-entry';
import FormBoolEntry from '@/app/ui/forms/edit-form/form-bool-entry';
import FormErrorHandling from '@/app/ui/forms/form-error-handling';
import FormSubmitButton from '@/app/ui/forms/form-submit-button';
import { getServerSession } from 'next-auth';
import { useContext, useEffect, useState } from 'react';
import SelectWithFocusControl from '@/app/ui/forms/general-helper-components/select-w-description';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { TimesheetContext } from '../timesheet-context-wrapper';
import InputDetailsNumber from '@/app/ui/forms/general-helper-components/input-details-number';
import FormSubmitDetailsButton from '@/app/ui/forms/form-submit-details-button';
import { IconButton, Tooltip } from '@/app/ui/material-tailwind-wrapper';
import InputDetailsDesc from '@/app/ui/forms/general-helper-components/input-details-desc';
import DeleteDetailButton from './delete-detail-button';
import ControlledSelect from '@/app/ui/forms/general-helper-components/controlled-sel-w-desc';
import { compareTimesheetDetailsExtended, compareWeekEnding } from '@/app/lib/utils';
import DoubleControlledSelect from '@/app/ui/forms/general-helper-components/double-controlled-sel-w-desc';

export default function TimesheetDetailsEditForm({

}: {

}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const timesheetID = context.selectedTimesheet;

	if (timesheetID == null) {
		throw new Error(
			"selectedTimesheet of TimesheetContext has not been set!"
		);
	}

	// if (context.localTimesheets == null) {
	// 	throw new Error(
	// 		"timesheets of TimesheetContext has not been set!"
	// 	);
	// }

	const [TSDDataAndOptions, setTSDDataAndOptions] = useState<{options: Options, timesheetDetails: TimesheetDetails[]} | null>(null);
	const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = editTimesheetDetails.bind(null, timesheetID);
    const [formState, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

	useEffect(() => {
		const fetchData = async () => {
			console.log('TS-ID', timesheetID);
			try {
				context.setLocalTimesheetDetails(null);
				setTSDDataAndOptions(null);
				const TSDDataReturn = await fetchTimesheetDetailsEditFormData(timesheetID);

				setTSDDataAndOptions(TSDDataReturn);

				context.setLocalTimesheetDetails(TSDDataReturn.timesheetDetails);
				context.setDatabaseTimesheetDetails(TSDDataReturn.timesheetDetails);

				let initialTimesheetDetailsState: SavingState;
				if (context.localTimesheets?.find(timesheet => timesheet.id == timesheetID)?.usercommitted) {
					initialTimesheetDetailsState = "signed";
				} else {
					initialTimesheetDetailsState = "saved";
				}
				context.setTimesheetDetailsState(initialTimesheetDetailsState);
			} catch (error) {
				console.error(error);
				notFound();
			}
		}

		fetchData();
	}, [timesheetID]);

	// Change TSD state to saved upon successful save
	useEffect(() => {
		console.log("formState: " + JSON.stringify(formState));

		let timesheetDetailsState: SavingState;
		if (context.timesheetDetailsState === "signed") {
			timesheetDetailsState = "signed";
		} else if (context.timesheetDetailsState === null) {
			timesheetDetailsState = null;
		} else if (formState.success === true) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}

		let newDbTimesheetDetails;
		let newDbWeekEnding;
		let newLocalTimesheets;
		if (formState.success == false) {
			newDbTimesheetDetails = context.databaseTimesheetDetails;
			newDbWeekEnding = context.databaseTimesheetWeekEnding;
			newLocalTimesheets = context.localTimesheets;
		} else {
			newDbTimesheetDetails = context.localTimesheetDetails;
			newDbWeekEnding = context.localTimesheetWeekEnding;
			// Update selected timesheet weekending
			newLocalTimesheets = context.localTimesheets;
			if (newLocalTimesheets && newDbWeekEnding) {
				let toBeChangedTimesheet = newLocalTimesheets.find((ts) => ts.id == context.selectedTimesheet);
				if (toBeChangedTimesheet) {
					toBeChangedTimesheet.weekending = newDbWeekEnding.toLocaleString();
				}
			}
		}
		
		context.setLocalTimesheets(newLocalTimesheets);
		context.setDatabaseTimesheetWeekEnding(newDbWeekEnding);
		context.setDatabaseTimesheetDetails(newDbTimesheetDetails);
		context.setTimesheetDetailsState(timesheetDetailsState);
	},[formState])

	useEffect(() => {
		const localTSDs = context.localTimesheetDetails;
		const dbTSDs = context.databaseTimesheetDetails;
		const localWeekEnding = context.localTimesheetWeekEnding;
		const databaseWeekEnding = context.databaseTimesheetWeekEnding;

		let timesheetDetailsState: SavingState;
		if (context.timesheetDetailsState === "signed") {
			timesheetDetailsState = "signed";
		} else if (context.timesheetDetailsState === null) {
			timesheetDetailsState = null;
		} else if (
			compareTimesheetDetailsExtended(localTSDs, dbTSDs) && 
			compareWeekEnding(localWeekEnding, databaseWeekEnding)
		) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}
		context.setTimesheetDetailsState(timesheetDetailsState);
	}, [
		context.localTimesheetDetails,
		context.databaseTimesheetDetails,
		context.localTimesheetWeekEnding,
		context.databaseTimesheetDetails
	]);

	if (!TSDDataAndOptions) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, timesheetDetails} = TSDDataAndOptions;
		
	if (timesheetDetails == null) {
		console.log("notfound2")
		notFound();
	}

    // const {
    //     id, project, phase, costcode, phase_costcode, description, mon, monot, 
    //     tues, tuesot, wed, wedot, thurs, thursot, 
    //     fri, friot, sat, satot, sun, sunot 
    // } = timesheetDetailsLabels;

	const tableHeaders = [
		"Project", "Phase - Cost Code", "Description",
		"Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", "Tot",
	];

    const {projects, phaseCostCodes} = options;

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

	const phaseCostCodeOptions = phaseCostCodes.map((val, index) => (
        <option
			value={val.phase + "-" + val.costcode}
			className=' bg-white'
			key={"key-" + val.phase + val.costcode + "-" + index}
			unfocused-label={val.phase + "-" + val.costcode}
		>
			{val.phase + "-" + val.costcode + ": " + val.description}
		</option>
    ));

    // Changes to focused version after focused
    // const phaseOptions = phases.map((val, index) => (
    //     <option 
	// 		value={val.id}
	// 		className=' bg-white'
	// 		key={"key-" + val.id + "-" + index}
	// 		unfocused-label={val.id}
	// 	>
	// 		{val.id + ": " + val.description}
	// 	</option>
    // ));

    // Changes to focused version after focused
    // const costCodeOptions = costcodes.map((val, index) => (
    //     <option
	// 		value={val.id}
	// 		className=' bg-white'
	// 		key={"key-" + val.id + "-" + index}
	// 		unfocused-label={val.id}
	// 	>
	// 		{val.id + ": " + val.description}
	// 	</option>
    // ));

	const TSDLen = context.localTimesheetDetails?.length || 0;

	type DayKey = 'mon' | 'tues' | 'wed' | 'thurs' | 'fri' | 'sat' | 'sun';
	type OvertimeKey = 'monot' | 'tuesot' | 'wedot' | 'thursot' | 'friot' | 'satot' | 'sunot';
	function calculateTotalHoursForDay(day: DayKey, overtime: OvertimeKey) {
		const details = context?.localTimesheetDetails;
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

	const isNotEditable = !(context.timesheetDetailsState == "saved" || context.timesheetDetailsState == "unsaved");
	const isNotSubmitable =
		context.timesheetDetailsState == "saving" || 
		context.timesheetDetailsState == "saved" ||
		context.timesheetDetailsState == "signed";

	//const isNotEditable = false
	//const isNotSubmitable = false

	const dispatchWrapper = (payload: FormData) => {
		context.setTimesheetDetailsState("saving");
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
			key={"form" + timesheetID}
			id={"form" + timesheetID}
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
				{context.localTimesheetDetails && context.databaseTimesheetDetails ? context.localTimesheetDetails.map((val, index) => {
					const dbTSDs = context.databaseTimesheetDetails;
					const dbTSDsLen = dbTSDs ? dbTSDs.length : 0;

					const dbVal = dbTSDsLen > index && dbTSDs ? 
						dbTSDs[index] : null;

					return (
						<tr
							key={"k-" + index + timesheetID}
							className='w-full h-full'
						>
							<td className={projectRowStyle}>
								{/* Hidden TSD id */}
								<input
									id={"TSD" + index + "[" + "id" + "]"}
									key={"TSD" + index + "[" + "id" + "]"}
									name={"TSD" + index + "[" + "id" + "]"}
									value={val.id}
									className='w-0'
									readOnly
									hidden
								/>

								{/* Project */}
								<ControlledSelect
									index={index}
									attr='projectid'
									info={"TSD" + index + "[" + "project" + "]"}
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
									info={"TSD" + index + "[" + "phase_costcode" + "]"}
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
									info={"TSD" + index + "[" + "description" + "]"}
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
									info={"TSD" + index + "[" + "mon" + "]"}
									className={dayStyle}
									value={val.mon}
									dbValue={dbVal?.mon}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='monot'
									info={"TSD" + index + "[" + "monOT" + "]"}
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
									info={"TSD" + index + "[" + "tues" + "]"}
									className={dayStyle}
									value={val.tues}
									dbValue={dbVal?.tues}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='tuesot'
									info={"TSD" + index + "[" + "tuesOT" + "]"}
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
									info={"TSD" + index + "[" + "wed" + "]"}
									className={dayStyle}
									value={val.wed}
									dbValue={dbVal?.wed}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='wedot'
									info={"TSD" + index + "[" + "wedOT" + "]"}
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
									info={"TSD" + index + "[" + "thurs" + "]"}
									className={dayStyle}
									value={val.thurs}
									dbValue={dbVal?.thurs}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='thursot'
									info={"TSD" + index + "[" + "thursOT" + "]"}
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
									info={"TSD" + index + "[" + "fri" + "]"}
									className={dayStyle}
									value={val.fri}
									dbValue={dbVal?.fri}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='friot'
									info={"TSD" + index + "[" + "friOT" + "]"}
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
									info={"TSD" + index + "[" + "sat" + "]"}
									className={dayStyle}
									value={val.sat}
									dbValue={dbVal?.sat}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='satot'
									info={"TSD" + index + "[" + "satOT" + "]"}
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
									info={"TSD" + index + "[" + "sun" + "]"}
									className={dayStyle}
									value={val.sun}
									dbValue={dbVal?.sun}
									disabled={isNotEditable}
								/>
								<InputDetailsNumber
									index={index}
									attr='sunot'
									info={"TSD" + index + "[" + "sunOT" + "]"}
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

							{/* Delete TSD */}
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


