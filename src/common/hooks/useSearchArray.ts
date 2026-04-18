import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

const PRECISION = 0.6;

export default function <T = []>(data: T, keys: string[]) {
  const [resultData, setResultData] = useState(data);
  const [search, setSearch] = useState('');

  function goToSearch() {
    if (search.length === 0) {
      setResultData(data);
      return;
    }

    const fuse = new Fuse<T>(data as never[], {
      useTokenSearch: true,
      includeScore: true,
      findAllMatches: true,
      ignoreLocation: true,
      threshold: 1,
      keys: keys,
    });
    const list = fuse.search(search);

    const res = list
      .filter((v) => (v.score ?? 0) <= PRECISION)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
      .map((v) => v.item);

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
