/**
 * Formatting Utilities
 * Common formatting functions for the application
 */

/**
 * Format price to USD currency
 * @param price - Price in USD
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  // TODO: Implement price formatting
  // return new Intl.NumberFormat('es-ES', {
  //   style: 'currency',
  //   currency: 'USD',
  // }).format(price);
  return `$${price.toFixed(2)}`;
};

/**
 * Format date to Spanish locale
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  // TODO: Implement date formatting
  // const dateObj = typeof date === 'string' ? new Date(date) : date;
  // return new Intl.DateTimeFormat('es-ES', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // }).format(dateObj);
  return new Date(date).toLocaleDateString('es-ES');
};

/**
 * Format date and time to Spanish locale
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  // TODO: Implement date-time formatting
  return new Date(date).toLocaleString('es-ES');
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
