import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Employee',
};

export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Employees', href: '/dashboard/employees' },
          {
            label: 'Add Employee',
            href: '/dashboard/employees/add',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}