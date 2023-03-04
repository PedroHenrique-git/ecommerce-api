export function extractFilenameFromUrl(url: string) {
  return url.split('/').at(-1);
}
