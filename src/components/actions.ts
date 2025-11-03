"use server";

import { redirect } from "next/navigation";

/**
 * Redirect to the given URL
 * @param url - url
 */
export async function navigate(url: string) {
  redirect(url);
}