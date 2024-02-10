'use client';


import { useFormState } from 'react-dom';
import FormEntry from '../../forms/add-form/form-entry';
import FormErrorHandling from '../../forms/form-error-handling';
import FormSubmitButton from '../../forms/form-submit-button';
import { addProject } from '@/app/lib/actions';

export default function Form() {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useFormState(addProject, initialState);

	return (
		<form action={dispatch}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* Number */}
				<FormEntry
					state={state}
					type='text' // In database, it is stored as a varchar
					label='Number'
					inputName='number'
				/>

				{/* Description */}
				<FormEntry
					state={state}
					type='text'
					label='Description'
					inputName='description'
				/>

				{/* StartDate */}
				<FormEntry
					state={state}
					type='text'
					label='Start Date'
					inputName='startdate'
				/>

				{/* EndDate */}
				<FormEntry
					state={state}
					type='text'
					label='End Date'
					inputName='enddate'
				/>
				
				{/* ShortName */}
				<FormEntry
					state={state}
					type='text'
					label='Short Name'
					inputName='shortname'
				/>

				{/* CustomerPO */}
				<FormEntry
					state={state}
					type='text'
					label='CustomerPO'
					inputName='customerpo'
				/>

				{/* CustomerContact */}
				<FormEntry
					state={state}
					type='text'
					label='CustomerContact'
					inputName='customercontact'
				/>

				{/* Comments */}
				<FormEntry
					state={state}
					type='text'
					label='Comments'
					inputName='comments'
				/>

				{/* Overtime */}
				<FormEntry
					state={state}
					type='checkbox'
					label='Overtime'
					inputName='overtime'
				/>

				{/* SGAFlag */}
				<FormEntry
					state={state}
					type='checkbox'
					label='SGA Flag'
					inputName='sgaflag'
				/>

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
			</div>
			<FormSubmitButton
				cancelHref='/dashboard/projects'
				text='Add Project'
			/>
		</form>
	);
}
