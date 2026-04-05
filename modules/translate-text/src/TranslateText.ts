import { generateToken } from './utils/token';
import { isSupported, getCode } from './utils/language';
import { TranslateOptions } from './interfaces/TranslateOptions.js';
import { TranslationResult } from './interfaces/TranslationResult.js';
import { TranslationError } from './interfaces/TranslationError.js';

export const translate = async (
  text: string,
  options: TranslateOptions = {},
): Promise<TranslationResult | never> => {
  // Validación de idiomas
  [options.from, options.to].forEach((lang) => {
    if (lang && !isSupported(lang)) {
      const error: TranslationError = new Error(
        `The language '${lang}' is not supported`,
      );
      error.code = 400;
      throw error;
    }
  });

  // Configuración de valores por defecto
  const from = options.from ? getCode(options.from) : 'auto';
  const to = options.to ? getCode(options.to) : 'en';
  const tld = options.tld ?? 'com';

  const token = await generateToken(text, { tld });

  const params: Record<string, string | number> = {
    client: options.client ?? 'gtx',
    sl: from,
    tl: to,
    hl: to,
    ie: 'UTF-8',
    oe: 'UTF-8',
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: text,
    [token.name]: token.value,
  };

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest',
  };

  const url = new URL(`https://translate.google.${tld}/translate_a/single`);

  // Añadimos los params iniciales
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, String(params[key])),
  );

  // Añadimos los parámetros 'dt' múltiples
  ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(
    (param) => url.searchParams.append('dt', param),
  );

  const response = await fetch(url.toString(), { method: 'POST', headers });
  const body = await response.json();

  if (options.raw) return body;

  const result: TranslationResult = {
    text: '',
    from: {
      language: { iso: '' },
      text: { value: '' },
    },
  };

  // Procesamiento del body (array de respuesta de Google)
  if (body[0]) {
    body[0].forEach((obj: never[]) => {
      if (obj[0]) result.text += obj[0];
    });
  }

  result.from.language.iso = body[2];

  // Verificación de sugerencia de idioma
  if (body[2] !== body[8]?.[0]?.[0]) {
    result.from.language.didYouMean = body[8]?.[0]?.[0];
  }

  // Procesamiento de sugerencias de texto y correcciones
  if (body[7] && body[7][0]) {
    result.from.text.value = body[7][0]
      .replaceAll('<b><i>', '[')
      .replaceAll('</i></b>', ']');

    if (body[7][5] === true) {
      result.from.text.autoCorrected = true;
    } else {
      result.from.text.didYouMean = true;
    }
  }

  return result;
};
