const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
const BASE = 1024;
const LOG_BASE = Math.log(BASE);

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes < BASE) {
    return `${bytes} B`;
  }

  const unitIndex = Math.min(
    (Math.log(bytes) / LOG_BASE) | 0,
    UNITS.length - 1,
  );

  const value = bytes / BASE ** unitIndex;

  return `${Number(value.toFixed(decimals))} ${UNITS[unitIndex]}`;
}
