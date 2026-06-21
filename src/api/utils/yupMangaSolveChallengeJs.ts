import { parse } from 'node-html-parser';

function getK2Value(documentString: string) {
  // 1. Obtenemos el valor que el script original inserta en el input (ej: k2)
  const match = documentString.match(
    /\.elements\[['"]([^'"]+)['"]\]\.value\s*=\s*String\.fromCharCode\(([^)]*)\)/,
  );

  //let k2Value = '';
  if (match) {
    return match[2]
      .split(',')
      .map((x) => String.fromCharCode(Number(x.trim())))
      .join('');
  } else {
    // Fallback por si acaso ya se encuentra seteado en el DOM
    const doc = parse(documentString);
    const input = doc.querySelector('input[name="k2"]');
    return input?.getAttribute('value') ?? '';
  }
}

export function yupMangaSolveChallengeJs(
  challengeJs: string,
  documentString: string,
): string {
  const k2Value = getK2Value(documentString);

  // 2. Preparamos el challengeJs limpiando comillas extra y eliminando el return temprano
  let src = challengeJs
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(
      /if\s*\(\s*typeof\s+document\s*===\s*["']undefined["']\s*\|\|\s*typeof\s+window\s*===\s*["']undefined["']\s*\)\s*\{\s*return\s*["']0["']\s*;\s*\}/,
      '',
    );

  // 3. Buscamos la sintaxis exacta del acceso al DOM
  const docAccessRegex =
    /document\s*\[\s*([^\]]+)\s*\]\s*\(\s*([^)]+)\s*\)\s*(?:\[\s*[^\]]+\s*\]\s*)+/;
  const accessMatch = src.match(docAccessRegex);

  if (accessMatch) {
    // Reemplazamos todo ese acceso por el valor en string directamente
    src = src.replace(accessMatch[0], `"${k2Value}"`);
  }

  // 4. Ejecutamos el string que ahora ya no tiene dependencias de DOM/document
  try {
    const fn = new Function(src);
    const result = fn();
    return String(result);
  } catch (e) {
    console.error('Error evaluando el challenge modificado:', e);
    return '0';
  }
}
