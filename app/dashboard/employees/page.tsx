
import SortableTable from '@/app/ui/employees/employee-sortable-table';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Employees',
};

export default function Page() {
  console.log("Hello from employee page");
  return (
    <main>
      <Suspense >
          <SortableTable />
      </Suspense>
    </main>
  )
}