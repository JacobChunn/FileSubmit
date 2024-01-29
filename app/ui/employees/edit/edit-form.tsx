'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { addEmployee } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import FormTextEntry from './form-entry';
import { Employee } from '@/app/lib/definitions';
import FormBoolEntry from './form-bool-entry';
import { useRef } from 'react';

export default function Form({employee} : {employee: Employee}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addEmployee, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const isDisabled = new Array<boolean>;

  function propertyOf<Employee,>(name: keyof Employee) {
    return name;
  }

  const processEdits = () => {
    const formElements = formRef.current?.elements

    if (!formElements) {
      console.error('Form elements not available.');
      return;
    }

    Array.from(formElements).forEach((element: Element) => {
      // Access individual elements
      if (element instanceof HTMLInputElement) {
        let property: keyof Employee = element.name as keyof Employee;
        console.log('Element name:', element.name);

        if (element.type == 'checkbox') {
          console.log("CHECKBOX--------------\nInput is different?: " + JSON.stringify(element.checked != employee[property]))
          
          // console.log("Input is same?: " + JSON.stringify(element.value === employee[property]))
          // console.log("original:")
          // console.log(JSON.stringify(employee[property]));
          // console.log(typeof employee[property])
          // console.log("new:")
          // console.log(JSON.stringify(element.value));
          // console.log(typeof element.value)
        } else {
          console.log("OTHER--------------\nInput is different?: " + JSON.stringify(element.value != employee[property]))
        }
      }
    });
  };

  return (
    <form ref={formRef} action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='First name'
          inputId='firstname'
          inputName='firstname'
          value={employee.firstname}
        />

        {/* Last Name */}
        <FormTextEntry
          state={state}
          type='text'
          label='Last name'
          inputId='lastname'
          inputName='lastname'
          value={employee.lastname}
        />

        {/* Username */}
        <FormTextEntry
          state={state}
          type='text'
          label='Username'
          inputId='username'
          inputName='username'
          value={employee.username}
        />

        {/* Password */}
        <FormTextEntry
          state={state}
          type='text'
          label='Password'
          inputId='password'
          inputName='password'
          value={employee.password}
        />

        {/* Cellphone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Cell Phone'
          inputId='cellphone'
          inputName='cellphone'
          value={employee.cellphone}
        />

        {/* Homephone */}
        <FormTextEntry
          state={state}
          type='text'
          label='Home Phone'
          inputId='homephone'
          inputName='homephone'
          value={employee.homephone}
        />

        {/* Email */}
        <FormTextEntry
          state={state}
          type='text'
          label='Email'
          inputId='email'
          inputName='email'
          value={employee.email}
        />

        {/* Number */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number'
          inputId='number'
          inputName='number'
          value={employee.number}
        />

        {/* Manager ID */}
        <FormTextEntry
          state={state}
          type='number'
          label='Manager ID'
          inputId='managerid'
          inputName='managerid'
          value={employee.managerid}
        />

        {/* Access Level */}
        <FormTextEntry
          state={state}
          type='number'
          label='Access Level'
          inputId='accesslevel'
          inputName='accesslevel'
          value={employee.accesslevel}
        />

        {/* Time Sheet Required */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Time Sheet Required'
          inputId='timesheetrequired'
          inputName='timesheetrequired'
          value={employee.timesheetrequired}
        />

        {/* Overtime Eligible */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Overtime Eligible'
          inputId='overtimeeligible'
          inputName='overtimeeligible'
          value={employee.overtimeeligible}
        />

        {/* Time Navigate OT */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Time Navigate OT'
          inputId='tabnavigateot'
          inputName='tabnavigateot'
          value={employee.tabnavigateot}
        />

        {/* Email Expense Copy */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Email Expense Copy'
          inputId='emailexpensecopy'
          inputName='emailexpensecopy'
          value={employee.emailexpensecopy}
        />

        {/* Active Employee */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Active Employee'
          inputId='activeemployee'
          inputName='activeemployee'
          value={employee.activeemployee}
        />

        {/* I Enter Time Data */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='I Enter Time Data'
          inputId='ientertimedata'
          inputName='ientertimedata'
          value={employee.ientertimedata}
        />

        {/* Number of Time Sheet Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Time Sheet Summaries'
          inputId='numtimesheetsummaries'
          inputName='numtimesheetsummaries'
          value={employee.numtimesheetsummaries}
        />

        {/* Number of Expense Summaries */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Expense Summaries'
          inputId='numexpensesummaries'
          inputName='numexpensesummaries'
          value={employee.numexpensesummaries}
        />

        {/* Number of Default Time Rows */}
        <FormTextEntry
          state={state}
          type='number'
          label='Number of Default Time Rows'
          inputId='numdefaulttimerows'
          inputName='numdefaulttimerows'
          value={employee.numdefaulttimerows}
        />

        {/* Contractor Status */}
        <FormBoolEntry
          state={state}
          type='checkbox'
          label='Contractor Status'
          inputId='contractor'
          inputName='contractor'
          value={employee.contractor}
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
        {/* <Button type="submit">Submit Edits</Button> */}
        <Button type="button" onClick={processEdits}>Submit Edits</Button>
      </div>
    </form>
  );
}
