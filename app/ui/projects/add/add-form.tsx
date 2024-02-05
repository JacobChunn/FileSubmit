'use client';


import { useFormState } from 'react-dom';
import FormTextEntry from '../../add-form/form-entry';
import FormErrorHandling from '../../add-form/form-error-handling';
import FormSubmitButton from '../../add-form/form-submit-button';
import { addProject } from '@/app/lib/actions';

export default function Form() {
	const initialState = { message: null, errors: {} };
	const [state, dispatch] = useFormState(addProject, initialState);

	return (
		<form action={dispatch}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* Number */}
				<FormTextEntry
					state={state}
					type='text' // In database, it is stored as a varchar
					label='Number'
					inputId='number'
					inputName='number'
				/>

				{/* Description */}
				<FormTextEntry
					state={state}
					type='text'
					label='Description'
					inputId='description'
					inputName='description'
				/>

				{/* StartDate */}
				<FormTextEntry
					state={state}
					type='text'
					label='Start Date'
					inputId='startdate'
					inputName='startdate'
				/>

				{/* EndDate */}
				<FormTextEntry
					state={state}
					type='text'
					label='End Date'
					inputId='enddate'
					inputName='enddate'
				/>
				
				{/* ShortName */}
				<FormTextEntry
					state={state}
					type='text'
					label='Short Name'
					inputId='shortname'
					inputName='shortname'
				/>

				{/* CustomerPO */}
				<FormTextEntry
					state={state}
					type='text'
					label='CustomerPO'
					inputId='customerpo'
					inputName='customerpo'
				/>

				{/* CustomerContact */}
				<FormTextEntry
					state={state}
					type='text'
					label='CustomerContact'
					inputId='customercontact'
					inputName='customercontact'
				/>

				{/* Comments */}
				<FormTextEntry
					state={state}
					type='text'
					label='Comments'
					inputId='comments'
					inputName='comments'
				/>

				{/* Overtime */}
				<FormTextEntry
					state={state}
					type='checkbox'
					label='Overtime'
					inputId='overtime'
					inputName='overtime'
				/>

				{/* SGAFlag */}
				<FormTextEntry
					state={state}
					type='checkbox'
					label='SGA Flag'
					inputId='sgaflag'
					inputName='sgaflag'
				/>

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
			</div>
			<FormSubmitButton
				href='/dashboard/projects'
				text='Add Project'
			/>
		</form>
	);
}
