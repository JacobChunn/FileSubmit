import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { fetchEmployeeByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';
import { deleteTimesheet } from '@/app/lib/actions';
import { DeleteTimesheetButton } from '@/app/ui/dashboard/timesheets/delete/delete-button';

export const metadata: Metadata = {
  title: 'Delete Timesheet',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = Number(params.id);
    if (typeof id !== 'number') {
        notFound();
    }


    return (
        <main className='flex flex-col h-full'>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Timesheets
				</Link>
				<Link href={`/dashboard/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Delete Timesheet
				</Link>
			</Breadcrumbs>
			<div className='flex flex-col flex-1 justify-center items-center'>
                <div className='p-12'>
                    Are you sure you want to delete?
                </div>
                <DeleteTimesheetButton id={id}/>
            </div>
        </main>
    );
}