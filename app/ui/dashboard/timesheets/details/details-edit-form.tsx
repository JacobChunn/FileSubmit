'use client';

import { deleteTimesheetDetails, editTimesheetDetails, fetchTimesheetDetailsEditFormData } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Options, TimesheetDetails, TimesheetDetailsEditInfo, TimesheetDetailsState, timesheetDetailsLabels } from '@/app/lib/definitions';
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
import { compareTimesheetDetailsExtended } from '@/app/lib/utils';

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

	if (context.timesheets == null) {
		throw new Error(
			"timesheets of TimesheetContext has not been set!"
		);
	}

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

				let initialTimesheetDetailsState: TimesheetDetailsState;
				console.log("First set local");
				if (context.timesheets?.find(timesheet => timesheet.id == timesheetID)?.usercommitted) {
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

		let timesheetDetailsState: TimesheetDetailsState;
		if (context.timesheetDetailsState === null) {
			timesheetDetailsState = null;
		} else if (formState.success === true) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}
		
		context.setDatabaseTimesheetDetails(context.localTimesheetDetails);
		context.setTimesheetDetailsState(timesheetDetailsState);
	},[formState])

	useEffect(() => {
		console.log("localTimesheetDetails Changed!", context.timesheetDetailsState)
		const localTSDs = context.localTimesheetDetails;
		const dbTSDs = context.databaseTimesheetDetails;

		let timesheetDetailsState: TimesheetDetailsState;
		if (compareTimesheetDetailsExtended(localTSDs, dbTSDs)) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}
		console.log("changing TSDState to: ", timesheetDetailsState)
		context.setTimesheetDetailsState(timesheetDetailsState);
	}, [context.localTimesheetDetails]);

	if (!TSDDataAndOptions) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, timesheetDetails} = TSDDataAndOptions;
		
	if (timesheetDetails == null) {
		console.log("notfound2")
		notFound();
	}

	const currentTimesheet = context.timesheets.find(timesheet => timesheet.id == timesheetID);
	if (!currentTimesheet) {
		throw new Error(
			"Could not find selectedTimesheet in timesheets!"
		);
	}

	const timesheetIsSigned = currentTimesheet.usercommitted;

    const {
        id, project, phase, costcode, description, mon, monot, 
        tues, tuesot, wed, wedot, thurs, thursot, 
        fri, friot, sat, satot, sun, sunot 
    } = timesheetDetailsLabels;

	const tableHeaders = [
		"Project", "Phase", "Cost Code", "Description",
		"Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", "Tot",
	];

    const {projects, phases, costcodes} = options;

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

    // Changes to focused version after focused
    const phaseOptions = phases.map((val, index) => (
        <option 
			value={val.id}
			className=' bg-white'
			key={"key-" + val.id + "-" + index}
			unfocused-label={val.id}
		>
			{val.id + ": " + val.description}
		</option>
    ));

    // Changes to focused version after focused
    const costCodeOptions = costcodes.map((val, index) => (
        <option
			value={val.id}
			className=' bg-white'
			key={"key-" + val.id + "-" + index}
			unfocused-label={val.id}
		>
			{val.id + ": " + val.description}
		</option>
    ));

    const dayStyle = 'h-1/2 w-full p-0';

	const selectStyle = 'h-full w-full';

	const dayRowStyle = 'w-11'
	const projectRowStyle = 'w-1/6'
	const phaseRowStyle = 'w-1/6'
	const costCodeRowStyle = 'w-1/6'
	const descRowStyle = 'w-1/6 h-10'

	const TSDLen = context.localTimesheetDetails?.length || 0;

	const monTot = context.localTimesheetDetails ? 
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.mon) + Number(currentValue.monot);
		}, 0)
		:
		0;

	const tuesTot = context.localTimesheetDetails ? 
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.tues) + Number(currentValue.tuesot);
		}, 0)
		:
		0;

	const wedTot = context.localTimesheetDetails ? 
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.wed) + Number(currentValue.wedot);
		}, 0)
		:
		0;

	const thursTot = context.localTimesheetDetails ? 
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.thurs) + Number(currentValue.thursot);
		}, 0)
		:
		0;

	const friTot = context.localTimesheetDetails ?
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.fri) + Number(currentValue.friot);
		}, 0)
		:
		0;

	const satTot = context.localTimesheetDetails ?
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.sat) + Number(currentValue.satot);
		}, 0)
		:
		0;

	const sunTot = context.localTimesheetDetails ?
		context.localTimesheetDetails.reduce((accumulator, currentValue) => {
			return accumulator + Number(currentValue.sun) + Number(currentValue.sunot);
		}, 0)
		:
		0;

	const totalTot = monTot + tuesTot + wedTot + thursTot + friTot + satTot + sunTot;

    return (
        <form
            action={dispatch}
            className='w-full h-full'
			key={"form" + timesheetID}
			id={"form" + timesheetID + " " + TSDLen}
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
									id={"TSD" + index + "[" + id + "]"}
									key={"TSD" + index + "[" + id + "]"}
									name={"TSD" + index + "[" + id + "]"}
									value={val.id}
									className='w-0'
									readOnly
									hidden
								/>

								{/* Project */}
								<ControlledSelect
									index={index}
									attr='projectid'
									info={"TSD" + index + "[" + project + "]"}
									value={val.projectid}
									dbValue={dbVal?.projectid}
									className = {selectStyle}
									disabled={timesheetIsSigned}
								>
									{projectOptions}
								</ControlledSelect>
							</td>

							{/* Phase */}
							<td className={phaseRowStyle}>
								<ControlledSelect
									index={index}
									attr='phase'
									info={"TSD" + index + "[" + phase + "]"}
									value={val.phase}
									dbValue={dbVal?.phase}
									className = {selectStyle}
									disabled={timesheetIsSigned}
								>
									{phaseOptions}
								</ControlledSelect>
							</td>

							{/* Cost Code */}
							<td className={costCodeRowStyle}>
								<ControlledSelect
									index={index}
									attr='costcode'
									info={"TSD" + index + "[" + costcode + "]"}
									value={val.costcode}
									dbValue={dbVal?.costcode}
									className = {selectStyle}
									disabled={timesheetIsSigned}
								>
									{costCodeOptions}
								</ControlledSelect>
							</td>

							{/* Description */}
							<td className={descRowStyle}>
								<InputDetailsDesc
									index={index}
									attr='description'
									info={"TSD" + index + "[" + description + "]"}
									value={val.description}
									dbValue={dbVal?.description}
									readOnly={timesheetIsSigned}
								/>
							</td>
							
							{/* Monday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='mon'
									info={"TSD" + index + "[" + mon + "]"}
									className={dayStyle}
									value={val.mon}
									dbValue={dbVal?.mon}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='monot'
									info={"TSD" + index + "[" + monot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.monot}
									dbValue={dbVal?.monot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Tuesday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='tues'
									info={"TSD" + index + "[" + tues + "]"}
									className={dayStyle}
									value={val.tues}
									dbValue={dbVal?.tues}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='tuesot'
									info={"TSD" + index + "[" + tuesot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.tuesot}
									dbValue={dbVal?.tuesot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Wednesday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='wed'
									info={"TSD" + index + "[" + wed + "]"}
									className={dayStyle}
									value={val.wed}
									dbValue={dbVal?.wed}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='wedot'
									info={"TSD" + index + "[" + wedot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.wedot}
									dbValue={dbVal?.wedot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Thursday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='thurs'
									info={"TSD" + index + "[" + thurs + "]"}
									className={dayStyle}
									value={val.thurs}
									dbValue={dbVal?.thurs}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='thursot'
									info={"TSD" + index + "[" + thursot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.thursot}
									dbValue={dbVal?.thursot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Friday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='fri'
									info={"TSD" + index + "[" + fri + "]"}
									className={dayStyle}
									value={val.fri}
									dbValue={dbVal?.fri}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='friot'
									info={"TSD" + index + "[" + friot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.friot}
									dbValue={dbVal?.friot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Saturday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='sat'
									info={"TSD" + index + "[" + sat + "]"}
									className={dayStyle}
									value={val.sat}
									dbValue={dbVal?.sat}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='satot'
									info={"TSD" + index + "[" + satot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.satot}
									dbValue={dbVal?.satot}
									disabled={timesheetIsSigned}
								/>
							</td>

							{/* Sunday */}
							<td className={dayRowStyle}>
								<InputDetailsNumber
									index={index}
									attr='sun'
									info={"TSD" + index + "[" + sun + "]"}
									className={dayStyle}
									value={val.sun}
									dbValue={dbVal?.sun}
									disabled={timesheetIsSigned}
								/>
								<InputDetailsNumber
									index={index}
									attr='sunot'
									info={"TSD" + index + "[" + sunot + "]"}
									className={dayStyle}
									isOT={true}
									value={val.sunot}
									dbValue={dbVal?.sunot}
									disabled={timesheetIsSigned}
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
							<td className='h-auto w-11 relative'>
								<DeleteDetailButton
									index={index}
									hidden={timesheetIsSigned}
								/>
							</td>
						</tr>
					)
				}) : null}
					<tr>
						<td colSpan={4}>
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
				submitDisabled={timesheetIsSigned}
            /> 
        </form>
		// Add "row was removed" text somewhere
    );
}


