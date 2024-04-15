'use client';

import { deleteTimesheetDetails, editTimesheetDetails, fetchTimesheetDetailsEditFormData } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Options, TimesheetDetails, TimesheetDetailsEditInfo, timesheetDetailsLabels } from '@/app/lib/definitions';
import FormTextEntry from '@/app/ui/forms/edit-form/form-entry';
import FormBoolEntry from '@/app/ui/forms/edit-form/form-bool-entry';
import FormErrorHandling from '@/app/ui/forms/form-error-handling';
import FormSubmitButton from '@/app/ui/forms/form-submit-button';
import { getServerSession } from 'next-auth';
import { useContext, useEffect, useState } from 'react';
import SelectWithFocusControl from '@/app/ui/forms/general-helper-components/select-w-description';
import SelectWithFocusControl2 from '@/app/ui/forms/general-helper-components/select-w-description2';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { TimesheetContext } from '../timesheet-context-wrapper';
import Input from '@/app/ui/forms/general-helper-components/inputDetails';
import FormSubmitDetailsButton from '@/app/ui/forms/form-submit-details-button';
import { IconButton, Tooltip } from '@/app/ui/material-tailwind-wrapper';

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

	const [TSDDataAndOptions, setTSDDataAndOptions] = useState<{options: Options, timesheetDetails: TimesheetDetails[]} | null>(null);
	const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = editTimesheetDetails.bind(null, timesheetID);
    const [state, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

	useEffect(() => {
		const fetchData = async () => {
			console.log('TS-ID', timesheetID)
			try {
				context.setLocalTimesheetDetails(null);
				setTSDDataAndOptions(null);
				const TSDDataReturn = await fetchTimesheetDetailsEditFormData(timesheetID);
				setTSDDataAndOptions(TSDDataReturn);
				context.setLocalTimesheetDetails(TSDDataReturn.timesheetDetails);
			} catch (error) {
				console.error(error);
				notFound();
			}
		}

		fetchData();
	}, [timesheetID]);

	useEffect(() => {
		console.log("need a repaint?")
	},[timesheetID, context.localTimesheetDetails])

	if (!TSDDataAndOptions) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, timesheetDetails} = TSDDataAndOptions;
		
	if (timesheetDetails == null) {
		console.log("notfound2")
		notFound();
	}

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
			key={"key-" + val.id + "-" + index}
			unfocused-label={val.id}
		>
			{val.id + ": " + val.description}
		</option>
    ));

    const dayStyle = 'h-1/2 w-full p-0';
    const dayRegStyle = dayStyle;
    const dayOTStyle = dayStyle + ' bg-zinc-200';

	const selectStyle = 'h-12 w-full';
	const descStyle = 'h-12 w-full';

	const dayRowStyle = 'w-11'
	const projectRowStyle = 'w-1/6'
	const phaseRowStyle = 'w-1/6'
	const costCodeRowStyle = 'w-1/6'
	const descRowStyle = 'w-1/6'

	console.log("localTSDs", context.localTimesheetDetails);
	const TSDLen = context.localTimesheetDetails?.length || 0;
	console.log("localTSD length", context.localTimesheetDetails?.length);

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
				{context.localTimesheetDetails ? context.localTimesheetDetails.map((val, index) => (
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
							<SelectWithFocusControl2
								info={"TSD" + index + "[" + project + "]"}
								info2={"TSD" + index + "[" + project + "] " + timesheetID}
								value={val.projectid}
								className = {selectStyle}
							>
								{projectOptions}
							</SelectWithFocusControl2>
						</td>

						<td className={phaseRowStyle}>
							{/* Phase */}
							<SelectWithFocusControl
								info={"TSD" + index + "[" + phase + "]"}
								value={val.phase}
								className = {selectStyle}
							>
								{phaseOptions}
							</SelectWithFocusControl>
						</td>
						<td className={costCodeRowStyle}>
							{/* Cost Code */}
							<SelectWithFocusControl
								info={"TSD" + index + "[" + costcode + "]"}
								value={val.costcode}
								className = {selectStyle}
							>
								{costCodeOptions}
							</SelectWithFocusControl>
						</td>

						{/* Description */}
						<td className={descRowStyle}>
							<Input
								index={index}
								attr='description'
								info={"TSD" + index + "[" + description + "]"}
								value={val.description}
								className={descStyle}
								type='text'
							/>
						</td>
						
						{/* Monday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='mon'
								info={"TSD" + index + "[" + mon + "]"}
								className={dayRegStyle}
								value={val.mon}
							/>
							<Input
								index={index}
								attr='monot'
								info={"TSD" + index + "[" + monot + "]"}
								className={dayOTStyle}
								value={val.monot}
							/>
						</td>

						{/* Tuesday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='tues'
								info={"TSD" + index + "[" + tues + "]"}
								className={dayRegStyle}
								value={val.tues}
							/>
							<Input
								index={index}
								attr='tuesot'
								info={"TSD" + index + "[" + tuesot + "]"}
								className={dayOTStyle}
								value={val.tuesot}
							/>
						</td>

						{/* Wednesday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='wed'
								info={"TSD" + index + "[" + wed + "]"}
								className={dayRegStyle}
								value={val.wed}
							/>
							<Input
								index={index}
								attr='wedot'
								info={"TSD" + index + "[" + wedot + "]"}
								className={dayOTStyle}
								value={val.wedot}
							/>
						</td>

						{/* Thursday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='thurs'
								info={"TSD" + index + "[" + thurs + "]"}
								className={dayRegStyle}
								value={val.thurs}
							/>
							<Input
								index={index}
								attr='thursot'
								info={"TSD" + index + "[" + thursot + "]"}
								className={dayOTStyle}
								value={val.thursot}
							/>
						</td>

						{/* Friday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='fri'
								info={"TSD" + index + "[" + fri + "]"}
								className={dayRegStyle}
								value={val.fri}
							/>
							<Input
								index={index}
								attr='friot'
								info={"TSD" + index + "[" + friot + "]"}
								className={dayOTStyle}
								value={val.friot}
							/>
						</td>

						{/* Saturday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='sat'
								info={"TSD" + index + "[" + sat + "]"}
								className={dayRegStyle}
								value={val.sat}
							/>
							<Input
								index={index}
								attr='satot'
								info={"TSD" + index + "[" + satot + "]"}
								className={dayOTStyle}
								value={val.satot}
							/>
						</td>

						{/* Sunday */}
						<td className={dayRowStyle}>
							<Input
								index={index}
								attr='sun'
								info={"TSD" + index + "[" + sun + "]"}
								className={dayRegStyle}
								value={val.sun}
							/>
							<Input
								index={index}
								attr='sunot'
								info={"TSD" + index + "[" + sunot + "]"}
								className={dayOTStyle}
								value={val.sunot}
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
							<IconButton
								className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center p-"
								variant='text'
								type='button'
								onClick={() => {
									console.log(index);
									const currentTSDs = context.localTimesheetDetails || [];
									context.setLocalTimesheetDetails(null);

									context.setLocalTimesheetDetails(() => {
										
										console.log([
											...currentTSDs.slice(0, index),
											...currentTSDs.slice(index + 1)
										]);
										if (!currentTSDs) return [];
										return [
											...currentTSDs.slice(0, index),
											...currentTSDs.slice(index + 1)
										]
									});
								}}
								
							>
								<Tooltip content='Delete Entry'>
									<TrashIcon className='w-4 h-4' />
								</Tooltip>
							</IconButton>
						</td>
					</tr>
				)) : null}
					<tr>
						<td/>
						<td/>
						<td/>
						<td>
							<p className='text-right'>
								Total: 
							</p>
						</td>
					</tr>
				</tbody>
			</table>
            <FormSubmitDetailsButton
                text='Submit Edits'
            />
        </form>
    );
}


