'use client';

import { editTimesheetDetails } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { TimesheetDetailsEditInfo } from '@/app/lib/definitions';
import FormTextEntry from '@/app/ui/forms/edit-form/form-entry';
import FormBoolEntry from '@/app/ui/forms/edit-form/form-bool-entry';
import FormErrorHandling from '@/app/ui/forms/form-error-handling';
import FormSubmitButton from '@/app/ui/forms/form-submit-button';

export default function TimesheetDetailsEditForm({ timesheetDetails, timesheetID }: { timesheetDetails: TimesheetDetailsEditInfo[], timesheetID: number}) {
    const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = editTimesheetDetails.bind(null, timesheetID);
    const [state, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Week Ending */}
                <FormTextEntry
                    state={state}
                    type='text'
                    label='Week Ending'
                    inputName='weekending'
                    value={timesheet.weekending}
                />

                {/* User Committed */}
                <FormBoolEntry
                    state={state}
                    type='checkbox'
                    label='Sign Timesheet'
                    inputName='usercommitted'
                    value={timesheet.usercommitted}
                />

                {/* Total Reg Hours */}
                <FormTextEntry
                    state={state}
                    type='number'
                    label='Total Regular Hours'
                    inputName='totalreghours'
                    value={timesheet.totalreghours}
                />

                {/* Total Overtime */}
                <FormTextEntry
                    state={state}
                    type='number'
                    label='Total Overtime Hours'
                    inputName='totalovertime'
                    value={timesheet.totalovertime}
                />

                {/* Message */}
                <FormTextEntry
                    state={state}
                    type='text'
                    label='Message'
                    inputName='message'
                    value={timesheet.message}
                />

                {/* Error Handling */}
                <FormErrorHandling
                    state={state}
                />
            </div>
            <FormSubmitButton
                cancelHref='/dashboard'
                text='Submit Edits'
            />
        </form>
    );
}
