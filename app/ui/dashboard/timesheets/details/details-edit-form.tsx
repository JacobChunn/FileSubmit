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
import Input from '@/app/ui/forms/general-helper-components/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { TimesheetContext } from '../table/timesheet-wrapper';

export default async function TimesheetDetailsEditForm({

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

	const [TSDData, setTSDData] = useState<{options: Options, timesheetDetails: TimesheetDetails[]} | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const TSDDataReturn = await fetchTimesheetDetailsEditFormData(timesheetID);
				setTSDData(TSDDataReturn);
			} catch (error) {
				console.error(error);
				notFound();
			}
			if (!TSDData) {
				notFound();
			}
		}

		fetchData();
	}, []);

	if (!TSDData) {
		notFound();
	}

	const {options, timesheetDetails} = TSDData
		
	if (timesheetDetails == null) {
		notFound();
	}




    const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = editTimesheetDetails.bind(null, timesheetID);
    const [state, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

    const {
        id, project, phase, costcode, description, mon, monot, 
        tues, tuesot, wed, wedot, thurs, thursot, 
        fri, friot, sat, satot, sun, sunot 
    } = timesheetDetailsLabels;

	const tableHeaders = [
		"Project", "Phase", "Cost Code", "Description",
		"Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun",
	];

    const {projects, phases, costcodes} = options;

	const oneTSDExists = timesheetDetails.length == 1;

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

	const dayRowStyle = 'w-1/32'
	const selectRowStyle = 'w-1/10'
	const descRowStyle = 'w-1/6'


    return (
        <form
            action={dispatch}
            className='w-full h-full'
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
				{timesheetDetails.map((val, index) => (
					<tr
						key={"k-" + index}
						className='w-full h-full'
					>
						<td className={selectRowStyle}>
							{/* Hidden TSD id */}
							<input
								id={"TSD" + index + "[" + id + "]"}
								key={"TSD" + index + "[" + id + "]"}
								name={"TSD" + index + "[" + id + "]"}
								value={val.id}
								readOnly
								hidden
							/>

							{/* Project */}
							<SelectWithFocusControl
								info={"TSD" + index + "[" + project + "]"}
								value={val.projectid}
								className = {selectStyle}
							>
								{projectOptions}
							</SelectWithFocusControl>
						</td>

						<td className={selectRowStyle}>
							{/* Phase */}
							<SelectWithFocusControl
								info={"TSD" + index + "[" + phase + "]"}
								value={val.phase}
								className = {selectStyle}
							>
								{phaseOptions}
							</SelectWithFocusControl>
						</td>
						<td className={selectRowStyle}>
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
								info={"TSD" + index + "[" + description + "]"}
								className={descStyle}
								value={val.description}
								type='text'
							/>
						</td>
						
						{/* Monday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + mon + "]"}
								className={dayRegStyle}
								value={val.mon}
							/>
							<Input
								info={"TSD" + index + "[" + monot + "]"}
								className={dayOTStyle}
								value={val.monot}
							/>
						</td>

						{/* Tuesday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + tues + "]"}
								className={dayRegStyle}
								value={val.tues}
							/>
							<Input
								info={"TSD" + index + "[" + tuesot + "]"}
								className={dayOTStyle}
								value={val.tuesot}
							/>
						</td>

						{/* Wednesday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + wed + "]"}
								className={dayRegStyle}
								value={val.wed}
							/>
							<Input
								info={"TSD" + index + "[" + wedot + "]"}
								className={dayOTStyle}
								value={val.wedot}
							/>
						</td>

						{/* Thursday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + thurs + "]"}
								className={dayRegStyle}
								value={val.thurs}
							/>
							<Input
								info={"TSD" + index + "[" + thursot + "]"}
								className={dayOTStyle}
								value={val.thursot}
							/>
						</td>

						{/* Friday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + fri + "]"}
								className={dayRegStyle}
								value={val.fri}
							/>
							<Input
								info={"TSD" + index + "[" + friot + "]"}
								className={dayOTStyle}
								value={val.friot}
							/>
						</td>

						{/* Saturday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + sat + "]"}
								className={dayRegStyle}
								value={val.sat}
							/>
							<Input
								info={"TSD" + index + "[" + satot + "]"}
								className={dayOTStyle}
								value={val.satot}
							/>
						</td>

						{/* Sunday */}
						<td className={dayRowStyle}>
							<Input
								info={"TSD" + index + "[" + sun + "]"}
								className={dayRegStyle}
								value={val.sun}
							/>
							<Input
								info={"TSD" + index + "[" + sunot + "]"}
								className={dayOTStyle}
								value={val.sunot}
							/>
						</td>

						{/* Delete TSD */}
						<td className='h-auto w-1/32 relative'>
							{!oneTSDExists ? 
								<button
									type='button'
									onClick={() => deleteTimesheetDetails(val.id)}
									className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center p-3"
								>
									<TrashIcon className='h-full' />
								</button>
							:
							null
						}
						</td>
					</tr>
				))}
				</tbody>
			</table>
            <FormSubmitButton
                cancelHref='/dashboard'
                text='Submit Edits'
            />
        </form>
    );
}
