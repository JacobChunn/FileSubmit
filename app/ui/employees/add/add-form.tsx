'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { addEmployee } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import FormTextEntry from './form-entry';
import { useRef } from 'react';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addEmployee, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='First name'
          inputId='firstname'
          inputName='firstname'
        />

        {/* Last Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='Last name'
          inputId='lastname'
          inputName='lastname'
        />

        {/* Username */}
        <FormTextEntry
          state={state}
          type='text'
          label='Username'
          inputId='username'
          inputName='username'
        />

        {/* Password */}
        <FormTextEntry
          state={state}
          type='text'
          label='Password'
          inputId='password'
          inputName='password'
        />

        {/* Cellphone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Cell Phone'
          inputId='cellphone'
          inputName='cellphone'
        />

        {/* Homephone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Home Phone'
          inputId='homephone'
          inputName='homephone'
        />

        {/* Email */}
        <FormTextEntry
          state={state}
          type='text'
          label='Email'
          inputId='email'
          inputName='email'
        />

        {/* Number */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number'
          inputId='number'
          inputName='number'
        />

        {/* Manager ID */}
        <FormTextEntry
          state={state}
          type='number'
          label='Manager ID'
          inputId='managerid'
          inputName='managerid'
        />

        {/* Access Level */}
        <FormTextEntry
          state={state}
          type='number'
          label='Access Level'
          inputId='accesslevel'
          inputName='accesslevel'
        />

        {/* Time Sheet Required */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Time Sheet Required'
          inputId='timesheetrequired'
          inputName='timesheetrequired'
        />

        {/* Overtime Eligible */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Overtime Eligible'
          inputId='overtimeeligible'
          inputName='overtimeeligible'
        />

        {/* Time Navigate OT */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Time Navigate OT'
          inputId='tabnavigateot'
          inputName='tabnavigateot'
        />

        {/* Email Expense Copy */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Email Expense Copy'
          inputId='emailexpensecopy'
          inputName='emailexpensecopy'
        />

        {/* Active Employee */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Active Employee'
          inputId='activeemployee'
          inputName='activeemployee'
        />

        {/* I Enter Time Data */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='I Enter Time Data'
          inputId='ientertimedata'
          inputName='ientertimedata'
        />

        {/* Number of Time Sheet Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Time Sheet Summaries'
          inputId='numtimesheetsummaries'
          inputName='numtimesheetsummaries'
        />

        {/* Number of Expense Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Expense Summaries'
          inputId='numexpensesummaries'
          inputName='numexpensesummaries'
        />

        {/* Number of Default Time Rows */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Default Time Rows'
          inputId='numdefaulttimerows'
          inputName='numdefaulttimerows'
        />

        {/* Contractor Status */}
        <FormTextEntry
          state={state}
          type='checkbox'
          label='Contractor Status'
          inputId='contractor'
          inputName='contractor'
        />

        <div id="status-error" aria-live="polite" aria-atomic="true">
          {state.message &&
            <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
          }
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/employees"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Employee</Button>
      </div>
    </form>
  );
}
