import ApprovalContextWrapper from '@/app/ui/dashboard/approvals/approval-context-wrapper';
import ApprovalDataFetcher from '@/app/ui/dashboard/approvals/approval-data-fetcher';
import ApprovalSelectionContainer from '@/app/ui/dashboard/approvals/approval-selection-container';
import DatestartSelector from '@/app/ui/dashboard/approvals/datestart-selector';
import EqualHeightLayout from '@/app/ui/dashboard/approvals/equal-height-layout';
import ExpenseApprovalTable from '@/app/ui/dashboard/approvals/expense-approval-table';
import ExpenseApprovalWrapper from '@/app/ui/dashboard/approvals/expense-approval-wrapper';
import SelectedSubordinateDetails from '@/app/ui/dashboard/approvals/selected-subordinate-details';
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
    <main className='flex flex-col w-full h-full'>
		<h1 className={`flex-none ${lusitana.className} mb-4 text-xl md:text-2xl`}>
			Approvals
		</h1>
		<div className='flex-1 space-x-6 w-full h-full'>
			<ApprovalContextWrapper>
				<ApprovalDataFetcher>
					<EqualHeightLayout>
						<ApprovalSelectionContainer>
							<TimesheetApprovalWrapper>
								<WeekendingSelector/>
								<TimesheetApprovalTable/>
							</TimesheetApprovalWrapper>
							<ExpenseApprovalWrapper>
								<DatestartSelector/>
								<ExpenseApprovalTable/>
							</ExpenseApprovalWrapper>
						</ApprovalSelectionContainer>
						<SelectedSubordinateDetails/>
					</EqualHeightLayout>
				</ApprovalDataFetcher>
			</ApprovalContextWrapper>
		</div>
    </main>
  )
}