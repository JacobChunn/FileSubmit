import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { fetchEmployeeByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import Form from '@/app/ui/employees/edit/edit-form';

export const metadata: Metadata = {
  title: 'Edit Employee',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = params.id;
    if (typeof id !== 'number') {
        notFound();
    }

    const employee = await fetchEmployeeByID(id);

    if (!employee) {
        notFound();
    }

    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard/employees' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Employees
				</Link>
				<Link href={`/dashboard/employees/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Employee
				</Link>
			</Breadcrumbs>
			<Form employee={employee}/>
        </main>
    );
}