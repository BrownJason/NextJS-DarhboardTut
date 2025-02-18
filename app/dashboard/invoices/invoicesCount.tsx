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

  const options = [...Array.from({ length: 20 }, (_, i: number) => (i + 1) * 5)];

  return (
    <select onChange={(e) => handleOnChange(e.target.value)} className="dark:bg-gray-600" defaultValue={searchParams.get('invoiceCount')?.toString()}>
      {options?.map((option) => {
        console.log(option);
        return (
          <option value={option} key={option}>
            {option}
          </option>
        );
      })}
      ;
    </select>
  );
}
