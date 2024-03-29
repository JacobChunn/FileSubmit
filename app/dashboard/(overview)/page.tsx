import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { Metadata } from 'next';
import TimesheetTable from '@/app/ui/dashboard/user-tables/timesheet-table';
import { fetchTimesheetsByEmployeeID } from '@/app/lib/data';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  //const timesheetPromise = (await fetchTimesheetsbyID()).json();

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
    return (
      <div>Denied</div>
    )
  }


  const employeeID = Number(session.user.id);

  const timesheetPromise = (await fetchTimesheetsByEmployeeID(employeeID)).json()
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className='flex'>
        <TimesheetTable timesheetPromise={timesheetPromise}/>
      </div>
    </main>
  );
}