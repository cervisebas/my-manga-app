export function truncateByChars(
  text: string,
  maxChars: number,
  ellipsis: string = '...',
): string {
  if (text.length <= maxChars) return text;

  const truncated = text.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) return truncated + ellipsis;

  return truncated.slice(0, lastSpace) + ellipsis;
}
