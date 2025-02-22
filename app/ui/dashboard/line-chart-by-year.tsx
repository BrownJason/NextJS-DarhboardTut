'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function LineChartByYear({ years }: { years: number[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleOnChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('year', term);
    replace(`${pathname}?${params.toString()}`);
  });

  return (
    <select onChange={(e) => handleOnChange(e.target.value)} className="dark:bg-gray-600 font-size-50" defaultValue={searchParams.get('year')?.toString()}>
      {years.map((year) => {
        return (
          <option value={year} key={year}>
            {year}
          </option>
        );
      })}
      ;
    </select>
  );
}
