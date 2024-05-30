import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { DeleteExpenseButton } from '@/app/ui/dashboard/expenses/delete/delete-button';

export const metadata: Metadata = {
  title: 'Delete Expense',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = Number(params.id);
    if (typeof id !== 'number') {
        notFound();
    }


    return (
        <main className='flex flex-col h-full'>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard/expenses' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Expenses
				</Link>
				<Link href={`/dashboard/expenses/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Delete Expense
				</Link>
			</Breadcrumbs>
			<div className='flex flex-col flex-1 justify-center items-center'>
                <div className='p-12'>
                    Are you sure you want to delete?
                </div>
                <DeleteExpenseButton id={id}/>
            </div>
        </main>
    );
}