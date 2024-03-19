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
import Input from '@/app/ui/forms/general-helper-components/input';

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
                        info={"TSD" + index + "[" + project + "]"}
                        className = 'w-1/6'
                    >
                        {projectOptions}
                    </SelectWithFocusControl>

                    {/* Phase */}
                    <SelectWithFocusControl
                        info={"TSD" + index + "[" + phase + "]"}
                        className = 'w-1/12'
                    >
                        {phaseOptions}
                    </SelectWithFocusControl>

                    {/* Cost Code */}
                    <SelectWithFocusControl
                        info={"TSD" + index + "[" + costcode + "]"}
                        className = 'w-1/12'
                    >
                        {costCodeOptions}
                    </SelectWithFocusControl>

                    {/* Description */}
                    <Input
                        info={"TSD" + index + "[" + description + "]"}
                    />
                    
                    <div className={gridStyles}>
                        {/* Monday */}
                        <Input
                            info={"TSD" + index + "[" + mon + "]"}
                            className={dayRegStyle}
                        />

                        {/* Tuesday */}
                        <Input
                            info={"TSD" + index + "[" + tues + "]"}
                            className={dayRegStyle}
                        />

                        {/* Wednesday */}
                        <Input
                            info={"TSD" + index + "[" + wed + "]"}
                            className={dayRegStyle}
                        />

                        {/* Thursday */}
                        <Input
                            info={"TSD" + index + "[" + thurs + "]"}
                            className={dayRegStyle}
                        />

                        {/* Friday */}
                        <Input
                            info={"TSD" + index + "[" + fri + "]"}
                            className={dayRegStyle}
                        />

                        {/* Saturday */}
                        <Input
                            info={"TSD" + index + "[" + sat + "]"}
                            className={dayRegStyle}
                        />

                        {/* Sunday */}
                        <Input
                            info={"TSD" + index + "[" + sun + "]"}
                            className={dayRegStyle}
                        />

                        {/* Monday OT */}
                        <Input
                            info={"TSD" + index + "[" + monot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Tuesday OT */}
                        <Input
                            info={"TSD" + index + "[" + tuesot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Wednesday OT */}
                        <Input
                            info={"TSD" + index + "[" + wedot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Thursday OT */}
                        <Input
                            info={"TSD" + index + "[" + thursot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Friday OT */}
                        <Input
                            info={"TSD" + index + "[" + friot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Saturday OT */}
                        <Input
                            info={"TSD" + index + "[" + satot + "]"}
                            className={dayOTStyle}
                        />

                        {/* Sunday OT */}
                        <Input
                            info={"TSD" + index + "[" + sunot + "]"}
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
