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
  "inputPower",
  "mpptConfig",
  "outputPower",
  "outputVoltage",
  "outputCurrent",
  "phaseType",
  "frequency",
  "efficiency",
];

const MPPT_ALLOWED_FIELDS = [
  "startUpVoltage",
  "maxVoltage",
  "maxCurrent",
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

  // inputPower
  if (!isNonEmpty(data.inputPower)) {
    errors.push({
      field: "inputPower",
      message: "inputPower is required",
    });
  } else {
    data.inputPower = parseNumber(data.inputPower);
    if (!isPositive(data.inputPower)) {
      errors.push({
        field: "inputPower",
        message: "Invalid inputPower value",
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

      // maxVoltage
      if (!isNonEmpty(mppt.maxVoltage)) {
        errors.push({
          field: `mpptConfig[${index}].maxVoltage`,
          message: "maxVoltage is required",
        });
      } else {
        mppt.maxVoltage = parseNumber(mppt.maxVoltage);
        if (!isPositive(mppt.maxVoltage)) {
          errors.push({
            field: `mpptConfig[${index}].maxVoltage`,
            message: "Invalid maxVoltage value",
          });
        }
      }

      // maxCurrent
      if (!isNonEmpty(mppt.maxCurrent)) {
        errors.push({
          field: `mpptConfig[${index}].maxCurrent`,
          message: "maxCurrent is required",
        });
      } else {
        mppt.maxCurrent = parseNumber(mppt.maxCurrent);
        if (!isPositive(mppt.maxCurrent)) {
          errors.push({
            field: `mpptConfig[${index}].maxCurrent`,
            message: "Invalid maxCurrent value",
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

  // outputPower
  if (!isNonEmpty(data.outputPower)) {
    errors.push({ field: "outputPower", message: "outputPower is required" });
  } else {
    data.outputPower = parseNumber(data.outputPower);
    if (!isPositive(data.outputPower)) {
      errors.push({
        field: "outputPower",
        message: "Invalid outputPower value",
      });
    }
  }

  // outputVoltage
  if (!isNonEmpty(data.outputVoltage)) {
    errors.push({
      field: "outputVoltage",
      message: "outputVoltage is required",
    });
  } else {
    data.outputVoltage = parseNumber(data.outputVoltage);
    if (!isPositive(data.outputVoltage)) {
      errors.push({
        field: "outputVoltage",
        message: "Invalid outputVoltage value",
      });
    }
  }

  // outputCurrent
  if (!isNonEmpty(data.outputCurrent)) {
    errors.push({
      field: "outputCurrent",
      message: "outputCurrent is required",
    });
  } else {
    data.outputCurrent = parseNumber(data.outputCurrent);
    if (!isPositive(data.outputCurrent)) {
      errors.push({
        field: "outputCurrent",
        message: "Invalid outputCurrent value",
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
