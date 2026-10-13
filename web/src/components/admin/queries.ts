import "server-only";

type PageResult<T> = { data: T[] | null; error: { message: string } | null };

/**
 * Pages through a PostgREST query 1000 rows at a time (the API's max page size).
 * `build(from, to)` must return a fresh query with `.range(from, to)` applied.
 */
export async function fetchAll<T>(
  build: (from: number, to: number) => PromiseLike<PageResult<T>>,
  maxRows = 20_000,
): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < maxRows; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}
