import Form from '@/app/ui/employees/add/add-form';
import { Breadcrumbs } from '@/app/ui/employees/add/client-components/breadcrumbs-material-tailwind-components';
import { lusitana } from '@/app/ui/fonts';
import clsx from 'clsx';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Employee',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs className='bg-transparent'>
        <a href='/dashboard/employees' className={clsx(lusitana.className,"text-2xl opacity-60")}>
          Employees
        </a>
        <a href='/dashboard/employees/add' className={clsx(lusitana.className,"text-2xl")}>
          Add Employee
        </a>
      </Breadcrumbs>
      <Form/>
    </main>
  );
}