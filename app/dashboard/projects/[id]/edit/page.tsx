import { Breadcrumbs } from '@/app/ui/material-tailwind-wrapper';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import Form from '@/app/ui/projects/edit/edit-form';
import { fetchProjectByID } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit Project',
};

export default async function Page({ params }: { params: { id: any } }) {
    const id = params.id;
    if (typeof id !== 'number') {
        notFound();
    }
    const project = await fetchProjectByID(id);

    if (!project) {
        notFound();
    }

    return (
        <main>
			<Breadcrumbs className='bg-transparent'>
				<Link href='/dashboard/projects' className={clsx(lusitana.className,"text-2xl opacity-60")}>
				    Projects
				</Link>
				<Link href={`/dashboard/project/${id}/edit`} className={clsx(lusitana.className,"text-2xl")}>
				    Edit Project
				</Link>
			</Breadcrumbs>
			<Form project={project}/>
        </main>
    );
}