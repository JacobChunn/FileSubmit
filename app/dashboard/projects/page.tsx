import { fetchProjects } from '@/app/lib/data';
import ProjectTable from '@/app/ui/projects/main/project-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
};


export default async function Page() {
  console.log("Hello from project page");
  const projectPromise = (await fetchProjects()).json();
  return (
    <main>
		  <ProjectTable projectPromise={projectPromise}/>
    </main>
  )
}