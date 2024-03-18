'use client';

import { editTimesheetDetails } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { Options, TimesheetDetailsEditInfo, timesheetDetailsLabels } from '@/app/lib/definitions';
import FormTextEntry from '@/app/ui/forms/edit-form/form-entry';
import FormBoolEntry from '@/app/ui/forms/edit-form/form-bool-entry';
import FormErrorHandling from '@/app/ui/forms/form-error-handling';
import FormSubmitButton from '@/app/ui/forms/form-submit-button';
import { getServerSession } from 'next-auth';
import { useEffect } from 'react';
import SelectWithFocusControl from '@/app/ui/forms/general-helper-components/select-w-description';

export default function TimesheetDetailsEditForm({
    timesheetDetails,
    timesheetID,
    options,
}: {
    timesheetDetails: TimesheetDetailsEditInfo[],
    timesheetID: number,
    options: Options
}) {
    const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = editTimesheetDetails.bind(null, timesheetID);
    const [state, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

    const { 
        project, phase, costcode, description, mon, monot, 
        tues, tuesot, wed, wedot, thurs, thursot, 
        fri, friot, sat, satot, sun, sunot 
    } = timesheetDetailsLabels;

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

    const selectStyle = 'w-1/6';

    
    const gridStyles = 'grid grid-cols-7 grid-rows-2';

    const dayStyle = 'h-6';
    const dayRegStyle = dayStyle;
    const dayOTStyle = dayStyle + ' bg-zinc-200';

    return (
        <form
            action={dispatch}
            className='rounded-xl shadow-md p-6 w-full h-full'
        >

            {timesheetDetails.map((val, index) => (
                <div
                    key={"k-" + index}
                    className='flex rounded p-2 w-full h-full'
                >
                    {/* Project */}
                    <SelectWithFocusControl
                        info={project + index}
                        className = {selectStyle}
                    >
                        {projectOptions}
                    </SelectWithFocusControl>

                    {/* Phase */}
                    <SelectWithFocusControl
                        info={phase + index}
                        className = {selectStyle}
                    >
                        {phaseOptions}
                    </SelectWithFocusControl>

                    {/* Cost Code */}
                    <SelectWithFocusControl
                        info={costcode + index}
                        className = {selectStyle}
                    >
                        {costCodeOptions}
                    </SelectWithFocusControl>

                    {/* Description */}
                    <input
                        id={description + index}
                        key={description + index}
                        name={description + index}
                    />
                    
                    <div className={gridStyles}>
                        {/* Monday */}
                        <input
                            id={mon + index}
                            key={mon + index}
                            name={mon + index}
                            className={dayRegStyle}
                        />

                        {/* Tuesday */}
                        <input
                            id={tues + index}
                            key={tues + index}
                            name={tues + index}
                            className={dayRegStyle}
                        />

                        {/* Wednesday */}
                        <input
                            id={wed + index}
                            key={wed + index}
                            name={wed + index}
                            className={dayRegStyle}
                        />

                        {/* Thursday */}
                        <input
                            id={thurs + index}
                            key={thurs + index}
                            name={thurs + index}
                            className={dayRegStyle}
                        />

                        {/* Friday */}
                        <input
                            id={fri + index}
                            key={fri + index}
                            name={fri + index}
                            className={dayRegStyle}
                        />

                        {/* Saturday */}
                        <input
                            id={sat + index}
                            key={sat + index}
                            name={sat + index}
                            className={dayRegStyle}
                        />

                        {/* Sunday */}
                        <input
                            id={sun + index}
                            key={sun + index}
                            name={sun + index}
                            className={dayRegStyle}
                        />

                        {/* Monday OT */}
                        <input
                            id={monot + index}
                            key={monot + index}
                            name={monot + index}
                            className={dayOTStyle}
                        />

                        {/* Tuesday OT */}
                        <input
                            id={tuesot + index}
                            key={tuesot + index}
                            name={tuesot + index}
                            className={dayOTStyle}
                        />

                        {/* Wednesday OT */}
                        <input
                            id={wedot + index}
                            key={wedot + index}
                            name={wedot + index}
                            className={dayOTStyle}
                        />

                        {/* Thursday OT */}
                        <input
                            id={thursot + index}
                            key={thursot + index}
                            name={thursot + index}
                            className={dayOTStyle}
                        />

                        {/* Friday OT */}
                        <input
                            id={friot + index}
                            key={friot + index}
                            name={friot + index}
                            className={dayOTStyle}
                        />

                        {/* Saturday OT */}
                        <input
                            id={satot + index}
                            key={satot + index}
                            name={satot + index}
                            className={dayOTStyle}
                        />

                        {/* Sunday OT */}
                        <input
                            id={sunot + index}
                            key={sunot + index}
                            name={sunot + index}
                            className={dayOTStyle}
                        />
                    </div>
                </div>
            ))}
            <FormSubmitButton
                cancelHref='/dashboard'
                text='Submit Edits'
            />
        </form>
    );
}
