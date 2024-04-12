import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { fetchTimesheetsByEmployeeID } from '@/app/lib/data';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TimesheetDetailsEditForm from '@/app/ui/dashboard/timesheets/details/details-edit-form';
import TimesheetDetailsWrapper from '@/app/ui/dashboard/timesheets/details/details-wrapper';
import TimesheetDetailsHeader from '@/app/ui/dashboard/timesheets/details/details-header';
import TimesheetWrapper from '@/app/ui/dashboard/timesheets/table/timesheet-wrapper';
import TimesheetTableWrapper from '@/app/ui/dashboard/timesheets/table/timesheet-table-wrapper';
import TimesheetTableHeader from '@/app/ui/dashboard/timesheets/table/timesheet-table-header';
import TimesheetTableBody from '@/app/ui/dashboard/timesheets/table/timesheet-table-body';

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

	//const timesheetPromise = (await fetchTimesheetsByEmployeeID(employeeID)).json()
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				Dashboard
			</h1>
			<div className='flex'>
				<TimesheetWrapper employeeid={employeeID}>
					<TimesheetTableWrapper>
						<TimesheetTableHeader/>
						<TimesheetTableBody/>
					</TimesheetTableWrapper>
					<TimesheetDetailsWrapper>
						<TimesheetDetailsHeader/>
						<TimesheetDetailsEditForm/>
					</TimesheetDetailsWrapper>
				</TimesheetWrapper>
			</div>
		</main>
	);
}