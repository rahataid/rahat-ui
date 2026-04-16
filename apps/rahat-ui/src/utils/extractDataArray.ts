/**
 * Extracts data array from API response that may be in different formats.
 * 
 * The dashboard API returns data in a nested structure like:
 * { benefStats: [...], commsStats: {...} }
 * 
 * This utility handles both:
 * 1. Direct array responses (for backward compatibility)
 * 2. Nested object responses with a benefStats property (current API format)
 * 
 * @param actualData - The API response data, can be an array or object
 * @returns Array of data items, or empty array if no data found
 */
export const extractDataArray = (actualData: any): any[] => {
  if (!actualData) return [];
  
  // If already an array, return it directly
  if (Array.isArray(actualData)) {
    return actualData;
  }
  
  // If it's an object with benefStats array, extract that array
  if (actualData?.benefStats && Array.isArray(actualData.benefStats)) {
    return actualData.benefStats;
  }
  
  // Default to empty array if structure is unexpected
  return [];
};
