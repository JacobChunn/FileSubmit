import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AddExpenseButton from "@/app/ui/dashboard/expenses/add-expense-button";
import ExpenseDetailsEditForm from "@/app/ui/dashboard/expenses/details/details-edit-form";
import ExpenseDetailsHeader from "@/app/ui/dashboard/expenses/details/details-header";
import ExpenseDetailsWrapper from "@/app/ui/dashboard/expenses/details/details-wrapper";
import ExpenseContextWrapper from "@/app/ui/dashboard/expenses/expense-context-wrapper";
import ExpenseWrapper from "@/app/ui/dashboard/expenses/expense-wrapper";
import ExpenseTableBody from "@/app/ui/dashboard/expenses/table/expense-table-body";
import ExpenseTableHeader from "@/app/ui/dashboard/expenses/table/expense-table-header";
import ExpenseTableWrapper from "@/app/ui/dashboard/expenses/table/expense-table-wrapper";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: 'Expenses',
};

export default async function Page() {

	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/api/auth/signin');
	}

	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				Expenses
			</h1>
			<div className='flex space-x-6'>
				<ExpenseContextWrapper>
					<ExpenseWrapper>
						<div className='flex items-center justify-end gap-3'>
							<AddExpenseButton className = "pb-2"/>
							{/* <DuplicateExpenseButton className = "pb-2"/> */}
						</div>
						<ExpenseTableWrapper>
							<ExpenseTableHeader/>
							<ExpenseTableBody/>
						</ExpenseTableWrapper>
					</ExpenseWrapper>
					<ExpenseDetailsWrapper>
						<ExpenseDetailsHeader/>
						<ExpenseDetailsEditForm/>
					</ExpenseDetailsWrapper>
				</ExpenseContextWrapper>
			</div>
		</main>
	);
}