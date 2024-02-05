import Form from '@/app/ui/projects/add/add-form';
import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
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
        <Link href='/dashboard/projects' className={clsx(lusitana.className,"text-2xl opacity-60")}>
          Projects
        </Link>
        <Link href='/dashboard/projects/add' className={clsx(lusitana.className,"text-2xl")}>
          Add Project
        </Link>
      </Breadcrumbs>
      <Form/>
    </main>
  );
}