import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { createCustomer, CustomerState } from '@/app/lib/actions';
import { Metadata } from 'next';
import { useActionState } from 'react';
import CustomerForm from '@/app/ui/customers/create-form';

export const metadata: Metadata = {
  title: 'Customers Create',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customer', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <CustomerForm />
    </main>
  );
}
