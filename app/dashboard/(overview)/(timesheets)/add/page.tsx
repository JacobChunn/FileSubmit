import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { lusitana } from '@/app/ui/fonts';
import clsx from 'clsx';
import { Metadata } from 'next';
import Link from 'next/link';
import TimesheetAddForm from '@/app/ui/dashboard/timesheets/add/add-form';

export const metadata: Metadata = {
  title: 'Add Timesheet',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs className='bg-transparent'>
        <Link href='/dashboard/' className={clsx(lusitana.className,"text-2xl opacity-60")}>
          Dashboard
        </Link>
        <Link href='/dashboard/add' className={clsx(lusitana.className,"text-2xl")}>
          Add Timesheet
        </Link>
      </Breadcrumbs>
      <TimesheetAddForm/>
    </main>
  );
}