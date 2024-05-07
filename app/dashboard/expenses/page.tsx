import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: 'Timesheets',
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


	//const employeeID = Number(session.user.id);

	//const timesheetPromise = (await fetchTimesheetsByEmployeeID(employeeID)).json()
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				Expenses
			</h1>
			<div className='flex space-x-6'>
				<ExpenseContextWrapper>
					<TimesheetWrapper>
						<div className='flex items-center justify-end gap-3'>
							<AddTimesheetButton className = "pb-2"/>
							<DuplicateTimesheetButton className = "pb-2"/>
						</div>
						<TimesheetTableWrapper>
							<TimesheetTableHeader/>
							<TimesheetTableBody/>
						</TimesheetTableWrapper>
					</TimesheetWrapper>
					<TimesheetDetailsWrapper>
						<TimesheetDetailsHeader/>
						<TimesheetDetailsEditForm/>
					</TimesheetDetailsWrapper>
				</TimesheetContextWrapper>
			</div>
		</main>
	);
}