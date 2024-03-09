import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { fetchTimesheetEditByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import TimesheetEditForm from '@/app/ui/dashboard/timesheets/edit/edit-form';
import { TimesheetEditInfo } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Edit Timesheet',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = Number(params.id);
    if (typeof id !== 'number') {
        notFound();
    }

    // const timesheetRes = await fetchTimesheetEditByID(id);

    // if (!timesheetRes.ok) {
    //     notFound();
    // }

    // const timesheet: TimesheetEditInfo  = await timesheetRes.json();


    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Timesheets
				</Link>
				<Link href={`/dashboard/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Timesheet
				</Link>
				<Link href={`/dashboard/${id}/edit/details`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Timesheet Details
				</Link>
			</Breadcrumbs>
			{/* <TimesheetEditForm timesheet={timesheet} id={id}/> */}
        </main>
    );
}