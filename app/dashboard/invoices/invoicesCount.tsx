'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function InvoicesCount({ invoiceCount }: { invoiceCount: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleOnChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('invoiceCount', term);
    replace(`${pathname}?${params.toString()}`);
  });

  return (
    <select onChange={(e) => handleOnChange(e.target.value)} className="dark:bg-gray-600" defaultValue={searchParams.get('invoiceCount')?.toString()}>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
      <option value="40">40</option>
    </select>
  );
}
