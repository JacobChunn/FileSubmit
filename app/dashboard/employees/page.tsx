
import SortableTable from '@/app/ui/employees/employee-sortable-table';
import EmployeeTable from '@/app/ui/employees/employee-table';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Employees',
};

export default function Page() {
    return <main>
      <p>Employee Page</p>
      <Suspense fallback={<LatestInvoicesSkeleton />}>
          <SortableTable />
      </Suspense>
    </main>
  }