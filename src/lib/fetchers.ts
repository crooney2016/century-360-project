import { z } from "zod";
import type { Page } from "../types/catalog";

export async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchPageWithSchema<T>(
  url: string,
  schema: z.ZodSchema<Page<T>>
): Promise<Page<T>> {
  const data = await fetchJSON(url);
  return schema.parse(data);
}
