/**
 * Extracts metadata from a text string.
 * @param text - The text string to extract metadata from.
 * @returns The metadata object or null if no metadata is found.
 */
export function extractMetadata(text: string): object | null {
  const startTag = '<--METADATA START-->';
  const endTag = '<!--METADATA END-->';

  const startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  const jsonStart = startIndex + startTag.length;
  const jsonString = text.substring(jsonStart, endIndex);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON metadata:', error);
    return null;
  }
}
