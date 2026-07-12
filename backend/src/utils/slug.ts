/**
 * Generates a URL-safe slug from a string.
 * Handles Unicode characters, special chars, and consecutive hyphens.
 *
 * Examples:
 *   "Meadow Floral Hoop Kit"  → "meadow-floral-hoop-kit"
 *   "Macramé Wall Hanging"    → "macrame-wall-hanging"
 *   "50% Off — Winter Sale!"  → "50-off-winter-sale"
 */
export function generateSlug(input: string): string {
  return input
    .normalize('NFKD')                        // decompose Unicode (é → e + combining accent)
    .replace(/[\u0300-\u036f]/g, '')          // strip combining diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')            // remove non-alphanumeric (keep spaces and hyphens)
    .replace(/\s+/g, '-')                     // spaces → hyphens
    .replace(/-+/g, '-')                      // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');                 // strip leading/trailing hyphens
}

/**
 * Makes a slug unique by appending a numeric suffix.
 * Used when a generated slug already exists in the database.
 */
export function makeSlugUnique(slug: string, suffix: number): string {
  return `${slug}-${suffix}`;
}
