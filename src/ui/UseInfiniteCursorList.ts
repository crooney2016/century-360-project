"use client";

import * as React from "react";

export type CursorPage<T> = { items: T[]; nextCursor: string | null };

export function useInfiniteCursorList<T>(opts: {
  fetchPage: (cursor: string | null) => Promise<CursorPage<T>>;
}) {
  const { fetchPage } = opts;
  const [pages, setPages] = React.useState<CursorPage<T>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const items: T[] = React.useMemo(() => pages.flatMap(p => p.items), [pages]);
  const done = React.useMemo(
    () => pages.length > 0 && pages[pages.length - 1].nextCursor === null,
    [pages]
  );

  const loadMore = React.useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    setError(null);
    try {
      const nextCursor = pages.length ? pages[pages.length - 1].nextCursor : null;
      const page = await fetchPage(nextCursor);
      setPages(p => [...p, page]);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [loading, done, pages, fetchPage]);

  const reset = React.useCallback(() => setPages([]), []);

  return { items, loading, error, done, loadMore, reset };
}
