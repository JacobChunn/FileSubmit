import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { fetchEmployeeByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import Form from '@/app/ui/employees/edit/edit-form';
import TimesheetEditForm from '@/app/ui/dashboard/timesheets/edit/edit-form';

export const metadata: Metadata = {
  title: 'Edit Timesheet',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = params.id;
    if (typeof id !== 'number') {
        notFound();
    }

    const timesheet = await fetchTimesheetByID(id);

    if (!timesheet) {
        notFound();
    }

    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard/employees' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Timesheets
				</Link>
				<Link href={`/dashboard/employees/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Timesheets
				</Link>
			</Breadcrumbs>
			<TimesheetEditForm timesheet={timesheet}/>
        </main>
    );
}