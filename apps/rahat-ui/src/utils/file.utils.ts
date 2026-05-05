export const normalizeFileNameForComparison = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with single hyphen
    .replace(/[^a-z0-9.-]/g, ''); // Remove special characters except dots and hyphens
};

/**
 * Checks if two file names are considered duplicates by comparing
 * both exact matches and normalized versions
 */
export const areFileNamesDuplicate = (
  fileName1: string,
  fileName2: string,
): boolean => {
  // Check exact match first (fastest)
  if (fileName1 === fileName2) {
    return true;
  }

  // Check normalized match (handles server transformations)
  return (
    normalizeFileNameForComparison(fileName1) ===
    normalizeFileNameForComparison(fileName2)
  );
};

/**
 * Checks if a file name exists in a list of existing file names,
 * using both exact and normalized comparison
 */
export const isFileNameDuplicate = (
  newFileName: string,
  existingFileNames: string[],
): boolean => {
  return existingFileNames.some((existingName) =>
    areFileNamesDuplicate(newFileName, existingName),
  );
};
