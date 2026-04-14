// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getIfExistObject<T extends Record<string, any>>(obj: T) {
  const rObj: T = {} as T;

  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      continue;
    }

    Object.assign(rObj, {
      [key]: val,
    });
  }

  return rObj;
}
