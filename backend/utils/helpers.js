// utils/helpers.js
// Extract allowed fields from an object
export const extractAllowedFields = (obj, allowedFields) => {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  for (const field of allowedFields) {
    if (obj[field] !== undefined) {
      out[field] = obj[field];
    }
  }
  return out;
};

// String parsing utility
export const parseString = (s) => {
  if (typeof s === "string") return s.trim();
  if (
    typeof s === "number" ||
    typeof s === "boolean" ||
    typeof s === "bigint"
  ) {
    return String(s).trim();
  }
  return "";
};

// Number parsing utility
export const parseNumber = (n) => {
  if (typeof n === "number" && Number.isFinite(n)) {
    return n;
  } else if (typeof n === "string") {
    const trimmed = n.trim();
    if (trimmed === "") return NaN;
    return Number(trimmed);
  }
  return NaN;
};

// Check if a string is non-empty
export const isNonEmpty = (s) => {
  return parseString(s).length > 0;
};

// Check if a number is positive
export const isPositive = (n) => {
  return Number.isFinite(n) && n > 0;
};

// Check if a number is non-negative
export const isNonNegative = (n) => {
  return Number.isFinite(n) && n >= 0;
};

// Filter out non-digit characters from a string
export const filterDigits = (s) => {
  return parseString(s).replace(/\D+/g, "");
};
