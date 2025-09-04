// validators/client.validator.js
import { pick, isNonEmpty, isPos, isNonNeg, toNum } from "../utils/helpers.js";

const ALLOWED_FIELDS = [
  "address",
  "utilityCompany",
  "uc",
  "accountHolder",
  "connectionType",
  "serviceVoltage",
  "circuitBreaker",
  "coords",
  "consumption",
  "sitePhotos",
];

export const validateInverterData = (req, res, next) => {
  const data = pick(req.body || {}, ALLOWED_FIELDS);
  const errors = [];

  // address

  // required
  for (const field of REQUIRED_FIELDS) {
    if (!isNonEmpty(data[field])) {
      errors.push({ field, message: `${field} is required` });
    }
  }

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
