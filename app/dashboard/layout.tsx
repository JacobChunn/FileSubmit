import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      <SideNav />
      <div className="flex-grow p-6 transition-width duration-500 ease-in-out">
		{/* <div>Example</div> */}
		{children}
		</div>
    </div>
  );
}