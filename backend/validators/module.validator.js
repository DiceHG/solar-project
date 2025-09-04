// validators/module.validator.js
import {
  extractFields,
  isNonEmpty,
  isPositive,
  parseNumber,
} from "../utils/helpers.js";

const ALLOWED_FIELDS = [
  "maker",
  "model",
  "inmetro",
  "datasheetUrl",
  "width",
  "length",
  "maxPower",
  "maxVoltage",
  "maxCurrent",
  "maxSystemVoltage",
  "maxSeriesFuse",
];

export const validateModuleData = (req, res, next) => {
  const data = extractFields(req.body || {}, ALLOWED_FIELDS);
  const errors = [];

  // maker
  if (!isNonEmpty(data.maker)) {
    errors.push({ field: "maker", message: "maker is required" });
  } else {
    data.maker = parseString(data.maker);
  }

  // model
  if (!isNonEmpty(data.model)) {
    errors.push({ field: "model", message: "model is required" });
  } else {
    data.model = parseString(data.model);
  }

  // inmetro
  if (!isNonEmpty(data.inmetro)) {
    errors.push({ field: "inmetro", message: "inmetro is required" });
  } else {
    data.inmetro = parseString(data.inmetro);
  }

  // datasheetUrl
  if (!isNonEmpty(data.datasheetUrl)) {
    delete data.datasheetUrl;
  } else {
    data.datasheetUrl = parseString(data.datasheetUrl);
  }

  // width
  if (!isNonEmpty(data.width)) {
    errors.push({
      field: "width",
      message: "width is required",
    });
  } else {
    data.width = parseNumber(data.width);
    if (!isPositive(data.width)) {
      errors.push({
        field: "width",
        message: "Invalid width value",
      });
    }
  }

  // length
  if (!isNonEmpty(data.length)) {
    errors.push({
      field: "length",
      message: "length is required",
    });
  } else {
    data.length = parseNumber(data.length);
    if (!isPositive(data.length)) {
      errors.push({
        field: "length",
        message: "Invalid length value",
      });
    }
  }

  // maxPower
  if (!isNonEmpty(data.maxPower)) {
    errors.push({ field: "maxPower", message: "maxPower is required" });
  } else {
    data.maxPower = parseNumber(data.maxPower);
    if (!isPositive(data.maxPower)) {
      errors.push({
        field: "maxPower",
        message: "Invalid maxPower value",
      });
    }
  }

  // maxVoltage
  if (!isNonEmpty(data.maxVoltage)) {
    errors.push({
      field: "maxVoltage",
      message: "maxVoltage is required",
    });
  } else {
    data.maxVoltage = parseNumber(data.maxVoltage);
    if (!isPositive(data.maxVoltage)) {
      errors.push({
        field: "maxVoltage",
        message: "Invalid maxVoltage value",
      });
    }
  }

  // maxCurrent
  if (!isNonEmpty(data.maxCurrent)) {
    errors.push({
      field: "maxCurrent",
      message: "maxCurrent is required",
    });
  } else {
    data.maxCurrent = parseNumber(data.maxCurrent);
    if (!isPositive(data.maxCurrent)) {
      errors.push({
        field: "maxCurrent",
        message: "Invalid maxCurrent value",
      });
    }
  }

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
