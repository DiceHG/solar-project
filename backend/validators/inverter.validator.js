// validators/inverter.validator.js
import {
  extractAllowedFields,
  isNonEmpty,
  isNonNegative,
  isPositive,
  parseNumber,
  parseString,
} from "../utils/helpers.js";

const ALLOWED_FIELDS = [
  "maker",
  "model",
  "inmetro",
  "datasheetUrl",
  "maxInputPower",
  "mpptConfig",
  "maxOutputPower",
  "maxOutputVoltage",
  "maxOutputCurrent",
  "phaseType",
  "frequency",
  "efficiency",
];

const MPPT_ALLOWED_FIELDS = [
  "startUpVoltage",
  "inputVoltage",
  "maxInputCurrent",
  "numOfStrings",
];

export const validateInverterData = (req, res, next) => {
  const data = extractAllowedFields(req.body || {}, ALLOWED_FIELDS);
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

  // maxInputPower
  if (!isNonEmpty(data.maxInputPower)) {
    errors.push({
      field: "maxInputPower",
      message: "maxInputPower is required",
    });
  } else {
    data.maxInputPower = parseNumber(data.maxInputPower);
    if (!isPositive(data.maxInputPower)) {
      errors.push({
        field: "maxInputPower",
        message: "Invalid maxInputPower value",
      });
    }
  }

  // mpptConfig
  if (!Array.isArray(data.mpptConfig) || data.mpptConfig.length === 0) {
    errors.push({
      field: "mpptConfig",
      message: "mpptConfig must be a non-empty array",
    });
  } else {
    data.mpptConfig = data.mpptConfig.map((mpptRaw, index) => {
      const mppt = extractAllowedFields(mpptRaw, MPPT_ALLOWED_FIELDS);

      // startUpVoltage
      if (!isNonEmpty(mppt.startUpVoltage)) {
        errors.push({
          field: `mpptConfig[${index}].startUpVoltage`,
          message: "startUpVoltage is required",
        });
      } else {
        mppt.startUpVoltage = parseNumber(mppt.startUpVoltage);
        if (!isPositive(mppt.startUpVoltage)) {
          errors.push({
            field: `mpptConfig[${index}].startUpVoltage`,
            message: "Invalid startUpVoltage value",
          });
        }
      }

      // inputVoltage.min
      if (!isNonEmpty(mppt.inputVoltage.min)) {
        errors.push({
          field: `mpptConfig[${index}].inputVoltage.min`,
          message: "inputVoltage.min is required",
        });
      } else {
        mppt.inputVoltage.min = parseNumber(mppt.inputVoltage.min);
        if (!isPositive(mppt.inputVoltage.min)) {
          errors.push({
            field: `mpptConfig[${index}].inputVoltage.min`,
            message: "Invalid inputVoltage.min value",
          });
        }
      }

      // inputVoltage.max
      if (!isNonEmpty(mppt.inputVoltage.max)) {
        errors.push({
          field: `mpptConfig[${index}].inputVoltage.max`,
          message: "inputVoltage.max is required",
        });
      } else {
        mppt.inputVoltage.max = parseNumber(mppt.inputVoltage.max);
        if (!isPositive(mppt.inputVoltage.max)) {
          errors.push({
            field: `mpptConfig[${index}].inputVoltage.max`,
            message: "Invalid inputVoltage.max value",
          });
        }
      }

      // maxInputCurrent
      if (!isNonEmpty(mppt.maxInputCurrent)) {
        errors.push({
          field: `mpptConfig[${index}].maxInputCurrent`,
          message: "maxInputCurrent is required",
        });
      } else {
        mppt.maxInputCurrent = parseNumber(mppt.maxInputCurrent);
        if (!isPositive(mppt.maxInputCurrent)) {
          errors.push({
            field: `mpptConfig[${index}].maxInputCurrent`,
            message: "Invalid maxInputCurrent value",
          });
        }
      }

      // numOfStrings
      if (!isNonEmpty(mppt.numOfStrings)) {
        errors.push({
          field: `mpptConfig[${index}].numOfStrings`,
          message: "numOfStrings is required",
        });
      } else {
        mppt.numOfStrings = parseInt(mppt.numOfStrings, 10);
        if (!isPositive(mppt.numOfStrings)) {
          errors.push({
            field: `mpptConfig[${index}].numOfStrings`,
            message: "Invalid numOfStrings value",
          });
        }
      }

      return mppt;
    });
  }

  // maxOutputPower
  if (!isNonEmpty(data.maxOutputPower)) {
    errors.push({
      field: "maxOutputPower",
      message: "maxOutputPower is required",
    });
  } else {
    data.maxOutputPower = parseNumber(data.maxOutputPower);
    if (!isPositive(data.maxOutputPower)) {
      errors.push({
        field: "maxOutputPower",
        message: "Invalid maxOutputPower value",
      });
    }
  }

  // maxOutputVoltage
  if (!isNonEmpty(data.maxOutputVoltage)) {
    errors.push({
      field: "maxOutputVoltage",
      message: "maxOutputVoltage is required",
    });
  } else {
    data.maxOutputVoltage = parseNumber(data.maxOutputVoltage);
    if (!isPositive(data.maxOutputVoltage)) {
      errors.push({
        field: "maxOutputVoltage",
        message: "Invalid maxOutputVoltage value",
      });
    }
  }

  // maxOutputCurrent
  if (!isNonEmpty(data.maxOutputCurrent)) {
    errors.push({
      field: "maxOutputCurrent",
      message: "maxOutputCurrent is required",
    });
  } else {
    data.maxOutputCurrent = parseNumber(data.maxOutputCurrent);
    if (!isPositive(data.maxOutputCurrent)) {
      errors.push({
        field: "maxOutputCurrent",
        message: "Invalid maxOutputCurrent value",
      });
    }
  }

  // phaseType
  if (!isNonEmpty(data.phaseType)) {
    errors.push({ field: "phaseType", message: "phaseType is required" });
  } else {
    data.phaseType = parseString(data.phaseType).toLowerCase();
    if (!["single-phase", "three-phase"].includes(data.phaseType)) {
      errors.push({ field: "phaseType", message: "Invalid phaseType value" });
    }
  }

  // frequency
  if (!isNonEmpty(data.frequency)) {
    delete data.frequency;
  } else {
    data.frequency = parseNumber(data.frequency);
    if (!isPositive(data.frequency)) {
      errors.push({ field: "frequency", message: "Invalid frequency value" });
    }
  }

  // efficiency
  if (!isNonEmpty(data.efficiency)) {
    delete data.efficiency;
  } else {
    data.efficiency = parseNumber(data.efficiency);
    if (!isNonNegative(data.efficiency) || data.efficiency > 100) {
      errors.push({ field: "efficiency", message: "Invalid efficiency value" });
    }
  }

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
