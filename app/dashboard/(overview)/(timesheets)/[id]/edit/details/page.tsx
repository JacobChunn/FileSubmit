import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { checkTimesheetOwnership, fetchTimesheetDetailsByTimesheetID } from '@/app/lib/data';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Edit Timesheet',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = Number(params.id);
    if (typeof id !== 'number') {
        notFound();
    }
	
	const session = await getServerSession(authOptions);
	
	if (!session) {
		redirect('/api/auth/signin');
		return (
		  <div>Denied</div>
		)
	}

	const employeeID = Number(session.user.id);
	const timesheetID = Number(id);

	const ownershipRes = await checkTimesheetOwnership(employeeID, timesheetID);
	if (!ownershipRes.ok) { notFound(); }

	const ownership = await ownershipRes.json();
	if (!ownership) { notFound(); }

    const timesheetDetailsRes = await fetchTimesheetDetailsByTimesheetID(id);
	if (!timesheetDetailsRes.ok) { notFound(); }




    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Timesheets
				</Link>
				<Link href={`/dashboard/${id}/edit`} className={clsx(lusitana.className,"text-2xl opacity-60")}>
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