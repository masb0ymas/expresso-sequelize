/**
 * Capitalizes the first letter of each word in a string and removes special characters.
 * @param str The input string to be capitalized.
 * @returns The capitalized string with special characters removed.
 */
export function capitalizeFirstLetter(str: string): string {
  const specialCharsRegex = /[-`~!@#$%^&*_|=?;:'",<>]/gi

  return str
    .replace(specialCharsRegex, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
