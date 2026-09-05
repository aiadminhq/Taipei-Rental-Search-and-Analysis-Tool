import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

export function useLive<T>(querier: () => Promise<T>, deps: unknown[], initial: T): T {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const sub = liveQuery(querier).subscribe({ next: (v) => setValue(v as T), error: (e) => console.error(e) });
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
