import SideNav from '@/app/ui/dashboard/sidenav';
import LayoutContextWrapper from '../ui/dashboard/layout-context-wrapper';
import '../ui/global.css'

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      <LayoutContextWrapper>
		<SideNav/>
		<div
		  className={`flex-grow p-6`}
		>
		  {children}
		</div>
	  </LayoutContextWrapper>
    </div>
  );
}
