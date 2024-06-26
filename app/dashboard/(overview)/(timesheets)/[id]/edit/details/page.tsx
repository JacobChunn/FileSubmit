import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { checkTimesheetOwnership, fetchTimesheetDetailsByTimesheetID } from '@/app/lib/data';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TimesheetDetailsEditForm from '@/app/ui/dashboard/timesheets/details/details-edit-form';
import TimesheetDetailsWrapper from '@/app/ui/dashboard/timesheets/details/details-wrapper';
import TimesheetDetailsHeader from '@/app/ui/dashboard/timesheets/details/details-header';

export const metadata: Metadata = {
  title: 'Edit Timesheet',
};

export default async function Page({ params }: { params: { id: any } }) {
    const timesheetID = Number(params.id);
    if (typeof timesheetID !== 'number') {
		console.log('here1')
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

	const ownershipRes = await checkTimesheetOwnership(employeeID, timesheetID);
	if (!ownershipRes.ok) { notFound(); }

	const ownership = await ownershipRes.json();
	if (!ownership) { notFound(); }
    const timesheetDetailsRes = await fetchTimesheetDetailsByTimesheetID(timesheetID);
	if (!timesheetDetailsRes.ok) { notFound(); }

	const timesheetDetails = await timesheetDetailsRes.json();
	if (timesheetDetails.length === 0) { notFound(); }

    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Timesheets
				</Link>
				<Link href={`/dashboard/${timesheetID}/edit`} className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Edit Timesheet
				</Link>
				<Link href={`/dashboard/${timesheetID}/edit/details`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Timesheet Details
				</Link>
			</Breadcrumbs>
			<TimesheetDetailsWrapper>
				<TimesheetDetailsHeader/>
				<TimesheetDetailsEditForm/>
			</TimesheetDetailsWrapper>
        </main>
    );
}