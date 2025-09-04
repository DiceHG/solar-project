// validators/client.validator.js
import mongoose from "mongoose";
import {
  extractAllowedFields,
  filterDigits,
  isNonEmpty,
  parseString,
} from "../utils/helpers.js";
import { isValidCPF, isValidCNPJ } from "../utils/br-docs.js";

const ALLOWED_FIELDS = [
  "clientType",
  "name",
  "docNumber",
  "email",
  "phoneNumber",
  "projects",
  "dateOfBirth",
];

// ============ Validation Functions ============

const isValidEmail = (email) => {
  const validity = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return validity;
};

const isValidPhone = (phone) => {
  const validity = phone.length >= 10 && phone.length <= 15;
  return validity;
};

const isValidISODate = (date) => {
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return false;
  return new Date(timestamp) <= new Date();
};

const isValidId = (id) => {
  const validity = mongoose.Types.ObjectId.isValid(id);
  return validity;
};

// ============ Client Data Validation ============

export const validateClientData = (req, res, next) => {
  const data = extractAllowedFields(req.body || {}, ALLOWED_FIELDS);
  const errors = [];

  // clientType
  if (!isNonEmpty(data.clientType)) {
    errors.push({ field: "clientType", message: "clientType is required" });
  } else {
    data.clientType = parseString(data.clientType);
    if (!["individual", "company"].includes(data.clientType)) {
      errors.push({
        field: "clientType",
        message: "Invalid clientType",
      });
    }
  }

  // name
  if (!isNonEmpty(data.name)) {
    errors.push({ field: "name", message: "name is required" });
  } else {
    data.name = parseString(data.name);
  }

  // docNumber
  if (!isNonEmpty(data.docNumber)) {
    errors.push({ field: "docNumber", message: "docNumber is required" });
  } else {
    data.docNumber = filterDigits(data.docNumber);
    if (data.clientType === "company") {
      if (!isValidCNPJ(data.docNumber))
        errors.push({ field: "docNumber", message: "Invalid CNPJ" });
    } else if (data.clientType === "individual") {
      if (!isValidCPF(data.docNumber))
        errors.push({ field: "docNumber", message: "Invalid CPF" });
    }
  }

  // email
  if (!isNonEmpty(data.email)) {
    errors.push({ field: "email", message: "email is required" });
  } else {
    data.email = parseString(data.email).toLowerCase();
    if (!isValidEmail(data.email)) {
      errors.push({ field: "email", message: "Invalid email" });
    }
  }

  // phoneNumber
  if (!isNonEmpty(data.phoneNumber)) {
    errors.push({ field: "phoneNumber", message: "phoneNumber is required" });
  } else {
    data.phoneNumber = filterDigits(data.phoneNumber);
    if (!isValidPhone(data.phoneNumber)) {
      errors.push({
        field: "phoneNumber",
        message: "Invalid phone number",
      });
    }
  }

  // projects
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    data.projects = [];
  } else {
    data.projects = data.projects
      .map((project) => parseString(project))
      .filter((project, index) => {
        if (!project) {
          errors.push({
            field: `projects[${index}]`,
            message: "Empty project ID",
          });
          return false;
        }
        if (!isValidId(project)) {
          errors.push({
            field: `projects[${index}]`,
            message: "Invalid project ID",
          });
          return false;
        }
        return true;
      });

    // Remove duplicates
    if (data.projects.length === 0) {
      data.projects = [];
    } else {
      data.projects = [...new Set(data.projects)];
    }
  }

  // dateOfBirth
  if (!isNonEmpty(data.dateOfBirth)) {
    delete data.dateOfBirth;
  } else {
    data.dateOfBirth = parseString(data.dateOfBirth);
    if (!isValidISODate(data.dateOfBirth)) {
      errors.push({ field: "dateOfBirth", message: "Invalid dateOfBirth" });
    } else {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
  }

  // Returns all validation errors, if any
  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
