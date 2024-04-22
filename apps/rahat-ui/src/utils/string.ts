export function formatUnderScoredString(str: string): string {
  // Replace underscores with spaces
  let newStr = str?.replace(/_/g, ' ');

  // Capitalize the first letter of each word and make the rest lowercase
  newStr = newStr?.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter?.toUpperCase();
  });

  return newStr;
}
