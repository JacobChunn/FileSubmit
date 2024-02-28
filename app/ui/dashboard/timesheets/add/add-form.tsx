'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { addEmployee, addTimesheet } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import FormEntry from '../../../forms/add-form/form-entry';
import FormErrorHandling from '../../../forms/form-error-handling';
import FormSubmitButton from '../../../forms/form-submit-button';

export default function TimesheetAddForm() {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useFormState(addTimesheet, initialState);

	return (
		<form action={dispatch}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* Week Ending */}
				<FormEntry
					state={state}
					type='text'
					label='Week Ending'
					inputName='weekending'
				/>

				{/* User Committed */}
				<FormEntry
					state={state}
					type='checkbox'
					label='User Committed'
					inputName='usercommitted'
				/>

				{/* Total Regular Hours */}
				<FormEntry
					state={state}
					type='text'
					label='Total Regular Hours'
					inputName='totalreghours'
				/>

				{/* Total Overtime */}
				<FormEntry
					state={state}
					type='text'
					label='Total Overtime'
					inputName='totalovertime'
				/>

				{/* Message */}
				<FormEntry
					state={state}
					type='text'
					label='Message'
					inputName='message'
				/>

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
			</div>
			<FormSubmitButton
				cancelHref='/dashboard/'
				text='Add Timesheet'
			/>
		</form>
	);
}
