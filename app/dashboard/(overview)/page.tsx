import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import TimesheetTable from '@/app/ui/dashboard/user-tables/timesheet-table';
import { fetchTimesheetsByEmployeeID } from '@/app/lib/data';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TimesheetDetailsEditForm from '@/app/ui/dashboard/timesheets/edit/details/details-edit-form';
import TimesheetDetailsWrapper from '@/app/ui/dashboard/timesheets/edit/details/details-wrapper';
import TimesheetDetailsHeader from '@/app/ui/dashboard/timesheets/edit/details/details-header';
import TimesheetWrapper from '@/app/ui/dashboard/timesheets/timesheet-wrapper';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default async function Page() {
	//const timesheetPromise = (await fetchTimesheetsbyID()).json();

	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/api/auth/signin');
		return (
			<div>Denied</div>
		)
	}


	const employeeID = Number(session.user.id);

	const timesheetPromise = (await fetchTimesheetsByEmployeeID(employeeID)).json()
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				Dashboard
			</h1>
			<div className='flex'>
				<TimesheetWrapper>
					<TimesheetTable timesheetPromise={timesheetPromise}/>
					<TimesheetDetailsWrapper>
						<TimesheetDetailsHeader/>
						<TimesheetDetailsEditForm/>
					</TimesheetDetailsWrapper>
				</TimesheetWrapper>
			</div>
		</main>
	);
}