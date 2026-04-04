import { Langs } from '../constants/Langs';

export const getCode = (language: keyof typeof Langs) => {
  if (!language) return;
  if (Langs[language]) return Langs[language];

  const key = Object.keys(Langs).find(
    (item) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Langs as any)[item] === language.toLowerCase() ||
      item.toLowerCase() === language.toLowerCase(),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return key ? (Langs as any)[key] : undefined;
};

export const isSupported = (language: keyof typeof Langs) =>
  Boolean(getCode(language));
