import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names
 * @param inputs - Class values
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random number between the minimum and maximum values.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random number between the minimum and maximum values.
 */
export function generateRandomNumber(
  min: number,
  max: number,
  decimalPlaces = 0,
): number {
  if (decimalPlaces > 0) {
    return +(min + Math.random() * (max - min)).toFixed(decimalPlaces);
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Constrains a value to a range.
 * @param value - The value to constrain.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The constrained value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Safely parses a JSON string to an object.
 * @param schema - The JSON string to parse.
 * @returns The parsed object.
 */
export function safelyParseToJson<T>(schema?: string): T {
  if (!schema) {
    return {} as T;
  }

  try {
    return JSON.parse(schema);
  } catch (error) {
    console.error('Error parsing schema:', error);
    return {} as T;
  }
}
