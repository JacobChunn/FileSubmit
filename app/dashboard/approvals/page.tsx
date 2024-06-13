import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approvals',
};


export default async function Page() {
  console.log("Hello from approvals page");
  //const projectPromise = (await fetchProjects()).json();
  return (
    <main>
		<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
			Approvals
		</h1>
    </main>
  )
}