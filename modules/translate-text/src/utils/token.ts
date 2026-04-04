interface TKKState {
  TKK: string;
}

interface TokenOptions {
  tld?: string;
}

interface TokenResult {
  name: 'tk';
  value: string;
}

// Estado privado para el token
const state: TKKState = { TKK: '0' };

/**
 * Función auxiliar para manipulación de bits (algoritmo de Google)
 */
const xr = (a: number, b: string): number => {
  let res = a;
  for (let c = 0; c < b.length - 2; c += 3) {
    let d: string | number = b.charAt(c + 2);
    d = d >= 'a' ? (d.codePointAt(0) ?? 0) - 87 : Number(d);
    d = b.charAt(c + 1) === '+' ? res >>> d : res << d;
    res = b.charAt(c) === '+' ? (res + d) & 4_294_967_295 : res ^ d;
  }
  return res;
};

/**
 * Genera el hash del token (sM)
 */
const sM = (text: string): string => {
  const d = state.TKK.split('.');
  const b = Number(d[0]) || 0;
  const e: number[] = [];

  let f = 0;
  for (let g = 0; g < text.length; g++) {
    let l = text.codePointAt(g) ?? 0;
    if (l < 128) {
      e[f++] = l;
    } else {
      if (l < 2048) {
        e[f++] = (l >> 6) | 192;
      } else {
        if (
          (l & 64_512) === 55_296 &&
          g + 1 < text.length &&
          ((text.codePointAt(g + 1) ?? 0) & 64_512) === 56_320
        ) {
          l =
            65_536 + ((l & 1023) << 10) + ((text.codePointAt(++g) ?? 0) & 1023);
          e[f++] = (l >> 18) | 240;
          e[f++] = ((l >> 12) & 63) | 128;
        } else {
          e[f++] = (l >> 12) | 224;
        }
        e[f++] = ((l >> 6) & 63) | 128;
      }
      e[f++] = (l & 63) | 128;
    }
  }

  let aNum: number = b;
  for (const byte of e) {
    aNum += byte;
    aNum = xr(aNum, '+-a^+6');
  }
  aNum = xr(aNum, '+-3^+b+-f');
  aNum ^= Number(d[1]) || 0;

  if (aNum < 0) {
    aNum = (aNum & 2_147_483_647) + 2_147_483_648;
  }

  aNum %= 1e6;
  return `${aNum.toString()}.${(aNum ^ b).toString()}`;
};

/**
 * Actualiza la semilla TKK desde Google Translate
 */
const updateTKK = async (opts: TokenOptions = {}): Promise<void> => {
  const tld = opts.tld ?? 'com';
  const now = Math.floor(Date.now() / 3_600_000);

  if (Number(state.TKK.split('.')[0]) === now) {
    return;
  }

  try {
    const res = await fetch(`https://translate.google.${tld}/`);
    const html = await res.text();
    const matches = html.match(/tkk:\s?'(.+?)'/i);

    if (matches?.[1]) {
      state.TKK = matches[1];
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const e = new Error(message) as Error & { code?: string };
    e.code = 'BAD_NETWORK';
    throw e;
  }
};

export const generateToken = async (
  text: string,
  opts?: TokenOptions,
): Promise<TokenResult> => {
  await updateTKK(opts);
  const tk = sM(text);
  return { name: 'tk', value: tk };
};
