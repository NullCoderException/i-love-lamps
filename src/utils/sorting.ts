/**
 * Sorting utilities for flashlight collection
 */

/**
 * Get numeric value for date sorting, handling null/undefined values
 * @param dateValue - The date value to convert
 * @param direction - Sort direction (asc/desc)
 * @returns Numeric value for comparison
 */
export function getDateValue(dateValue: string | null | undefined, direction: 'asc' | 'desc'): number {
  if (!dateValue) {
    // For ascending: null values go to end (use large number)
    // For descending: null values go to end (use small number)
    return direction === 'asc' ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER
  }
  
  return new Date(dateValue).getTime()
}

/**
 * Get numeric value for price sorting, handling null/undefined values
 * @param priceValue - The price value to convert
 * @param direction - Sort direction (asc/desc)
 * @returns Numeric value for comparison
 */
export function getPriceValue(priceValue: number | null | undefined, direction: 'asc' | 'desc'): number {
  if (priceValue == null) {
    // For ascending: null values go to end (use large number)
    // For descending: null values go to end (use small number)
    return direction === 'asc' ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER
  }
  
  return priceValue
}

/**
 * Get string value for text sorting, handling null/undefined values
 * @param textValue - The text value to convert
 * @returns String value for comparison
 */
export function getTextValue(textValue: string | null | undefined): string {
  return textValue || ''
}