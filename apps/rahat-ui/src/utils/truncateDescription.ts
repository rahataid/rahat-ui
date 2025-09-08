export const truncateDescription = (description?: string, maxLength = 40) => {
  if (!description) return '';
  return description.length > maxLength
    ? `${description.slice(0, maxLength)}...`
    : description;
};
