import ApprovalContextWrapper from '@/app/ui/dashboard/approvals/approval-context-wrapper';
import ApprovalDataFetcher from '@/app/ui/dashboard/approvals/approval-data-fetcher';
import TimesheetApprovalTable from '@/app/ui/dashboard/approvals/timesheet-approval-table';
import TimesheetApprovalWrapper from '@/app/ui/dashboard/approvals/timesheet-approval-wrapper';
import WeekendingSelector from '@/app/ui/dashboard/approvals/weekending-selector';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approvals',
};


export default async function Page() {
  console.log("Hello from approvals page");
  //const projectPromise = (await fetchProjects()).json();
  return (
    <main>
		<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
			Approvals
		</h1>
		<div className='flex space-x-6'>
			<ApprovalContextWrapper>
				<ApprovalDataFetcher>
					<TimesheetApprovalWrapper>
						<WeekendingSelector/>
						<TimesheetApprovalTable/>
					</TimesheetApprovalWrapper>
					{/* <ExpenseApprovalTable/> */}
				</ApprovalDataFetcher>
			</ApprovalContextWrapper>
		</div>
    </main>
  )
}