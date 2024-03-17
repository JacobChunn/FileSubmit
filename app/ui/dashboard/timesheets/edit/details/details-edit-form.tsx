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

    return (
        <form action={dispatch}>

            {timesheetDetails.map((val, index) => (
                <div key={"k-" + index}>
                    <SelectWithFocusControl
                        info={project + index}
                    >
                        {projectOptions}
                    </SelectWithFocusControl>
                    <SelectWithFocusControl
                        info={phase + index}
                    >
                        {phaseOptions}
                    </SelectWithFocusControl>
                    <SelectWithFocusControl
                        info={costcode + index}
                    >
                        {costCodeOptions}
                    </SelectWithFocusControl>
                    <input
                        id={description + index}
                        key={description + index}
                        name={description + index}
                    />
                    <input
                        id={mon + index}
                        key={mon + index}
                        name={mon + index}
                    />
                    <input
                        id={monot + index}
                        key={monot + index}
                        name={monot + index}
                    />
                    <input
                        id={tues + index}
                        key={tues + index}
                        name={tues + index}
                    />
                    <input
                        id={tuesot + index}
                        key={tuesot + index}
                        name={tuesot + index}
                    />
                    <input
                        id={wed + index}
                        key={wed + index}
                        name={wed + index}
                    />
                    <input
                        id={wedot + index}
                        key={wedot + index}
                        name={wedot + index}
                    />
                    <input
                        id={thurs + index}
                        key={thurs + index}
                        name={thurs + index}
                    />
                    <input
                        id={thursot + index}
                        key={thursot + index}
                        name={thursot + index}
                    />
                    <input
                        id={fri + index}
                        key={fri + index}
                        name={fri + index}
                    />
                    <input
                        id={friot + index}
                        key={friot + index}
                        name={friot + index}
                    />
                    <input
                        id={sat + index}
                        key={sat + index}
                        name={sat + index}
                    />
                    <input
                        id={satot + index}
                        key={satot + index}
                        name={satot + index}
                    />
                    <input
                        id={sun + index}
                        key={sun + index}
                        name={sun + index}
                    />
                    <input
                        id={sunot + index}
                        key={sunot + index}
                        name={sunot + index}
                    />
                </div>
            ))}
            <FormSubmitButton
                cancelHref='/dashboard'
                text='Submit Edits'
            />
        </form>
    );
}
