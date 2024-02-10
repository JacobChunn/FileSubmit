'use client';


import { useFormState } from 'react-dom';
import FormErrorHandling from '../../forms/form-error-handling';
import FormSubmitButton from '../../forms/form-submit-button';
import { editProject } from '@/app/lib/actions';
import { Project } from '@/app/lib/definitions';
import FormBoolEntry from '../../forms/edit-form/form-bool-entry';
import FormTextEntry from '../../forms/edit-form/form-entry';

export default function Form({ project }: { project: Project }) {
	const initialState = { message: null, errors: {} };
    const editProjectWithID = editProject.bind(null, project.id);
	const [state, dispatch] = useFormState(editProjectWithID, initialState);

	return (
		<form action={dispatch}>
			<div className="rounded-md bg-gray-50 p-4 md:p-6">
				{/* Number */}
				<FormTextEntry
					state={state}
					type='text' // In database, it is stored as a varchar
					label='Number'
					inputName='number'
                    value={project.number}
				/>

				{/* Description */}
				<FormTextEntry
					state={state}
					type='text'
					label='Description'
					inputName='description'
                    value={project.description}
				/>

				{/* StartDate */}
				<FormTextEntry
					state={state}
					type='text'
					label='Start Date'
					inputName='startdate'
                    value={project.startdate}
				/>

				{/* EndDate */}
				<FormTextEntry
					state={state}
					type='text'
					label='End Date'
					inputName='enddate'
                    value={project.enddate}
				/>
				
				{/* ShortName */}
				<FormTextEntry
					state={state}
					type='text'
					label='Short Name'
					inputName='shortname'
                    value={project.shortname}
				/>

				{/* CustomerPO */}
				<FormTextEntry
					state={state}
					type='text'
					label='CustomerPO'
					inputName='customerpo'
                    value={project.customerpo}
				/>

				{/* CustomerContact */}
				<FormTextEntry
					state={state}
					type='text'
					label='CustomerContact'
					inputName='customercontact'
                    value={project.customercontact}
				/>

				{/* Comments */}
				<FormTextEntry
					state={state}
					type='text'
					label='Comments'
					inputName='comments'
                    value={project.comments}
				/>

				{/* Overtime */}
				<FormBoolEntry
					state={state}
					type='checkbox'
					label='Overtime'
					inputName='overtime'
                    value={project.overtime}
				/>

				{/* SGAFlag */}
				<FormBoolEntry
					state={state}
					type='checkbox'
					label='SGA Flag'
					inputName='sgaflag'
                    value={project.sgaflag}
				/>

				{/* Error Handling */}
				<FormErrorHandling
					state={state}
				/>
			</div>
			<FormSubmitButton
				cancelHref='/dashboard/projects'
				text='Submit Edits'
			/>
		</form>
	);
}
