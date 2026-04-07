import { useEffect, useRef, useState } from 'react';

export default function (event?: (v: string) => void) {
  const [valueSearch, setValueSearch] = useState('');
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (!valueSearch.length) {
      event?.(valueSearch);
    } else {
      timeout.current = setTimeout(() => {
        event?.(valueSearch);
      }, 800);
    }
  }, [valueSearch]);

  return { valueSearch, setValueSearch };
}
