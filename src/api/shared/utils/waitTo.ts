export function waitTo(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
