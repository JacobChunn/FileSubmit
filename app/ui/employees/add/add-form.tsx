'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { addEmployee } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import FormEntry from '../../forms/add-form/form-entry';
import FormErrorHandling from '../../forms/form-error-handling';
import FormSubmitButton from '../../forms/form-submit-button';

export default function Form() {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useFormState(addEmployee, initialState);

	return (
		<form action={dispatch}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* First Name */}
				<FormEntry
					state={state}
					type='text'
					label='First name'
					inputName='firstname'
				/>

				{/* Last Name */}
				<FormEntry
					state={state}
					type='text'
					label='Last name'
					inputName='lastname'
				/>

				{/* Username */}
				<FormEntry
					state={state}
					type='text'
					label='Username'
					inputName='username'
				/>

				{/* Password */}
				<FormEntry
					state={state}
					type='text'
					label='Password'
					inputName='password'
				/>

				{/* Cellphone */}
				<FormEntry
					state={state}
					type='text'
					label='Cell Phone'
					inputName='cellphone'
				/>

				{/* Homephone */}
				<FormEntry
					state={state}
					type='text'
					label='Home Phone'
					inputName='homephone'
				/>

				{/* Email */}
				<FormEntry
					state={state}
					type='text'
					label='Email'
					inputName='email'
				/>

				{/* Number */}
				<FormEntry
					state={state}
					type='number'
					label='Number'
					inputName='number'
				/>

				{/* Manager ID */}
				<FormEntry
					state={state}
					type='number'
					label='Manager ID'
					inputName='managerid'
				/>

				{/* Access Level */}
				<FormEntry
					state={state}
					type='number'
					label='Access Level'
					inputName='accesslevel'
				/>

				{/* Time Sheet Required */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Time Sheet Required'
					inputName='timesheetrequired'
				/>

				{/* Overtime Eligible */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Overtime Eligible'
					inputName='overtimeeligible'
				/>

				{/* Time Navigate OT */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Time Navigate OT'
					inputName='tabnavigateot'
				/>

				{/* Email Expense Copy */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Email Expense Copy'
					inputName='emailexpensecopy'
				/>

				{/* Active Employee */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Active Employee'
					inputName='activeemployee'
				/>

				{/* I Enter Time Data */}
				<FormEntry
					state={state}
					type='checkbox'
					label='I Enter Time Data'
					inputName='ientertimedata'
				/>

				{/* Number of Time Sheet Summaries */}
				<FormEntry
					state={state}
					type='number'
					label='Number of Time Sheet Summaries'
					inputName='numtimesheetsummaries'
				/>

				{/* Number of Expense Summaries */}
				<FormEntry
					state={state}
					type='number'
					label='Number of Expense Summaries'
					inputName='numexpensesummaries'
				/>

				{/* Number of Default Time Rows */}
				<FormEntry
					state={state}
					type='number'
					label='Number of Default Time Rows'
					inputName='numdefaulttimerows'
				/>

				{/* Contractor Status */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Contractor Status'
					inputName='contractor'
				/>

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
			</div>
			<FormSubmitButton
				href='/dashboard/employees'
				text='Add Employee'
			/>
		</form>
	);
}
