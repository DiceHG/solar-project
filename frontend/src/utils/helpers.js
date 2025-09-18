// utils/helpers.js
// Filter out non-digit characters from a string
export const filterDigits = (s) => {
  if (typeof s === "string" && s.trim() !== "") {
    return s.replace(/\D+/g, "");
  }
  return undefined;
};
