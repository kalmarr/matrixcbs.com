// MATRIX CBS - String Utility Függvények
// Unicode-safe string műveletek magyar ékezetes karakterekhez

/**
 * Unicode-safe első karakter lekérés
 * Biztonságos magyar ékezetes karakterekkel (á, é, í, ó, ö, ő, ú, ü, ű)
 *
 * @example
 * getFirstChar('Árvíztűrő') // 'Á'
 * getFirstChar('') // ''
 */
export function getFirstChar(str: string): string {
  return [...str][0] || ''
}

/**
 * Unicode-safe substring
 * Nem vág ketté multi-byte karaktereket
 *
 * @example
 * safeSubstring('Árvíztűrő tükörfúrógép', 10) // 'Árvíztűrő '
 */
export function safeSubstring(str: string, maxChars: number): string {
  const chars = [...str]
  if (chars.length <= maxChars) return str
  return chars.slice(0, maxChars).join('')
}

/**
 * Unicode-safe substring ellipszissel
 * Ha a szöveg hosszabb mint maxChars, hozzáfűz '...'
 *
 * @example
 * truncateText('Árvíztűrő tükörfúrógép', 10) // 'Árvíztűrő...'
 */
export function truncateText(str: string, maxChars: number, suffix: string = '...'): string {
  const chars = [...str]
  if (chars.length <= maxChars) return str
  return chars.slice(0, maxChars).join('') + suffix
}

/**
 * Unicode-safe string hossz
 * Visszaadja a karakterek számát, nem a byte-ok számát
 *
 * @example
 * safeLength('Árvíztűrő') // 9 (nem 12)
 */
export function safeLength(str: string): number {
  return [...str].length
}
