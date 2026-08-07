/**
 * Sanitize free-form text input to prevent XSS attacks.
 */
export function sanitizeText(text) {
  if (typeof text !== "string") return "";
  
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Validate rating integer to ensure it stays strictly within 1 and 10.
 */
export function validateRating(value) {
  const num = parseInt(value, 10);
  if (isNaN(num)) return null;
  if (num < 1) return 1;
  if (num > 10) return 10;
  return num;
}
