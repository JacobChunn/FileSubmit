'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { editEmployee } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import FormTextEntry from '../../forms/edit-form/form-entry';
import { Employee } from '@/app/lib/definitions';
import FormBoolEntry from '../../forms/edit-form/form-bool-entry';
import FormErrorHandling from '../../forms/form-error-handling';
import FormSubmitButton from '../../forms/form-submit-button';

export default function Form({ employee }: { employee: Employee }) {
  const initialState = { message: null, errors: {} };
  const editEmployeeWithID = editEmployee.bind(null, employee.id);
  const [state, dispatch] = useFormState(editEmployeeWithID, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='First name'
          inputName='firstname'
          value={employee.firstname}
        />

        {/* Last Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='Last name'
          inputName='lastname'
          value={employee.lastname}
        />

        {/* Username */}
        <FormTextEntry
          state={state}
          type='text'
          label='Username'
          inputName='username'
          value={employee.username}
        />

        {/* Password */}
        <FormTextEntry
          state={state}
          type='text'
          label='Password'
          inputName='password'
          value={employee.password}
        />

        {/* Cellphone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Cell Phone'
          inputName='cellphone'
          value={employee.cellphone}
        />

        {/* Homephone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Home Phone'
          inputName='homephone'
          value={employee.homephone}
        />

        {/* Email */}
        <FormTextEntry
          state={state}
          type='text'
          label='Email'
          inputName='email'
          value={employee.email}
        />

        {/* Number */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number'
          inputName='number'
          value={employee.number}
        />

        {/* Manager ID */}
        <FormTextEntry
          state={state}
          type='number'
          label='Manager ID'
          inputName='managerid'
          value={employee.managerid}
        />

        {/* Access Level */}
        <FormTextEntry
          state={state}
          type='number'
          label='Access Level'
          inputName='accesslevel'
          value={employee.accesslevel}
        />

        {/* Time Sheet Required */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Time Sheet Required'
          inputName='timesheetrequired'
          value={employee.timesheetrequired}
        />

        {/* Overtime Eligible */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Overtime Eligible'
          inputName='overtimeeligible'
          value={employee.overtimeeligible}
        />

        {/* Time Navigate OT */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Time Navigate OT'
          inputName='tabnavigateot'
          value={employee.tabnavigateot}
        />

        {/* Email Expense Copy */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Email Expense Copy'
          inputName='emailexpensecopy'
          value={employee.emailexpensecopy}
        />

        {/* Active Employee */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Active Employee'
          inputName='activeemployee'
          value={employee.activeemployee}
        />

        {/* I Enter Time Data */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='I Enter Time Data'
          inputName='ientertimedata'
          value={employee.ientertimedata}
        />

        {/* Number of Time Sheet Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Time Sheet Summaries'
          inputName='numtimesheetsummaries'
          value={employee.numtimesheetsummaries}
        />

        {/* Number of Expense Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Expense Summaries'
          inputName='numexpensesummaries'
          value={employee.numexpensesummaries}
        />

        {/* Number of Default Time Rows */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Default Time Rows'
          inputName='numdefaulttimerows'
          value={employee.numdefaulttimerows}
        />

        {/* Contractor Status */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Contractor Status'
          inputName='contractor'
          value={employee.contractor}
        />

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
      </div>
      <FormSubmitButton
				href='/dashboard/employees'
				text='Submit Edits'
			/>
    </form>
  );
}
