import { fetchProjects } from '@/app/lib/data';
import ProjectSortableTable from '@/app/ui/projects/main/project-sortable-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employees',
};


export default async function Page() {
  console.log("Hello from employee page");
  const projectPromise = (await fetchProjects()).json();
  return (
    <main>
		<ProjectSortableTable projectPromise={projectPromise}/>
    </main>
  )
}