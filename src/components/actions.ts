/**
 * Client-side redirect to the given URL.
 * @param url - url
 */
export function navigate(url: string) {
  window.location.href = url;
}
