import Form from '@/app/ui/employees/add/add-form';
import { Breadcrumbs } from '@/app/ui/client-components/breadcrumbs-material-tailwind-components';
import { lusitana } from '@/app/ui/fonts';
import clsx from 'clsx';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Add Employee',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs className='bg-transparent'>
        <Link href='/dashboard/employees' className={clsx(lusitana.className,"text-2xl opacity-60")}>
          Employees
        </Link>
        <Link href='/dashboard/employees/add' className={clsx(lusitana.className,"text-2xl")}>
          Add Employee
        </Link>
      </Breadcrumbs>
      <Form/>
    </main>
  );
}