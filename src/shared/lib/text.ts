export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatCategoryLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
