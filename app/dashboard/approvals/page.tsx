import ApprovalContextWrapper from '@/app/ui/dashboard/approvals/approval-context-wrapper';
import ApprovalDataFetcher from '@/app/ui/dashboard/approvals/approval-data-fetcher';
import TimesheetApprovalTable from '@/app/ui/dashboard/approvals/timesheet-approval-table';
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
					<TimesheetApprovalTable/>
					{/* <ExpenseApprovalTable/> */}
				</ApprovalDataFetcher>
			</ApprovalContextWrapper>
		</div>
    </main>
  )
}