// validators/module.validator.js
import {
  extractFields,
  isNonEmpty,
  isPositive,
  parseNumber,
} from "../utils/helpers.js";

const ALLOWED_FIELDS = [
  "title",

];

export const validateProjectData = (req, res, next) => {
  const data = extractFields(req.body || {}, ALLOWED_FIELDS);
  const errors = [];

  // title
  if (!isNonEmpty(data.title)) {
    delete data.title
  } else {
    data.title = parseString(data.title);
  }

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
