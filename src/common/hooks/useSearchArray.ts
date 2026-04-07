import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

export default function <T = []>(data: T, keys: string[]) {
  const [resultData, setResultData] = useState(data);
  const [search, setSearch] = useState('');

  function goToSearch() {
    if (search.length === 0) {
      setResultData(data);
      return;
    }

    const fuse = new Fuse<T>(data as never[], {
      includeScore: true,
      findAllMatches: true,
      ignoreLocation: true,
      threshold: 1,
      keys: keys,
    });
    const list = fuse.search(search);

    const res = list.map((v) => ({
      ...v.item,
      hide: (v.score ?? 1) > 0.5,
    }));

    setResultData(res as never);
  }

  useEffect(() => {
    goToSearch();
  }, [search]);

  useEffect(() => {
    goToSearch();
  }, [data]);

  return {
    resultData,
    setSearch,
  };
}
