// validators/location.validator.js
import { extractFields, isNonEmpty, filterDigits, isPositive, parseNumber, parseString } from "../utils/helpers.js";
import { STATE_LIST } from "../utils/br-docs.js"

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

const ADDRESS_ALLOWED_FIELDS = [
  "cep",
  "state",
  "city",
  "district",
  "street",
  "number",
  "complement"
]

export const validateLocationData = (req, res, next) => {
  const data = extractFields(req.body || {}, ALLOWED_FIELDS);
  const errors = [];

  // ----- Address -----
  const rawAddress = data.address || {}
  const address = extractFields(rawAddress, ADDRESS_ALLOWED_FIELDS)

  // cep
  if (!isNonEmpty(address.cep)) {
    errors.push({
      field: "address.cep",
      message: "address.cep is required"
    })
  } else {
    address.cep = filterDigits(address.cep)
    if (address.cep.length !== 8) {
      errors.push({
        field: "address.cep",
        message: "Invalid address.cep value"
      })
    }
  }

  // state
  if (!isNonEmpty(address.state)) {
    errors.push({
      field: "address.state",
      message: "address.state is required"
    })
  } else {
    address.state = parseString(address.state)
    if (!STATE_LIST.some(state => state.uf === address.state)) {
      errors.push({
        field: "address.state",
        message: "Invalid address.state value"
      })
    }
  }

  // city
  if (!isNonEmpty(address.city)) {
    errors.push({
      field: "address.city",
      message: "address.city is required"
    })
  } else {
    address.city = parseString(address.city)
  }

  // district
  if (!isNonEmpty(address.district)) {
    errors.push({
      field: "address.district",
      message: "address.district is required"
    })
  } else {
    address.district = parseString(address.district)
  }

  // street
  if (!isNonEmpty(address.street)) {
    errors.push({
      field: "address.street",
      message: "address.street is required"
    })
  } else {
    address.street = parseString(address.street)
  }

  // number
  if (!isNonEmpty(address.number)) {
    address.number = "S/N"
  } else {
    address.number = parseString(address.number)
  }

  // complement
  if (!isNonEmpty(address.complement)) {
    delete address.complement
  } else {
    address.complement = parseString(address.complement)
  }

  data.address = address

  // ----- Electrical info -----
  // utilityCompany
  if (!isNonEmpty(data.utilityCompany)) {
    errors.push({
      field: "utilityCompany",
      message: "utilityCompany is required"
    })
  } else {
    data.utilityCompany = parseString(data.utilityCompany)
  }

  // uc
  if (!isNonEmpty(data.uc)) {
    errors.push({
      field: "uc",
      message: "uc is required"
    })
  } else {
    data.uc = parseString(data.uc)
  }

  // accountHolder
  if (!isNonEmpty(data.accountHolder)) {
    errors.push({
      field: "accountHolder",
      message: "accountHolder is required"
    })
  } else {
    data.accountHolder = parseString(data.accountHolder)
  }

  // connectionType
  if (!isNonEmpty(data.connectionType)) {
    errors.push({
      field: "connectionType",
      message: "connectionType is required"
    })
  } else {
    data.connectionType = parseString(data.connectionType).toLowerCase()
    if (!["monophasic", "biphasic", "triphasic"].includes(data.connectionType)) {
      errors.push({
        field: "connectionType",
        message: "Invalid connectionType value"
      })
    }
  }

  // serviceVoltage
  if (!isNonEmpty(data.serviceVoltage)) {
    errors.push({
      field: "serviceVoltage",
      message: "serviceVoltage is required"
    })
  } else {
    data.serviceVoltage = parseNumber(data.serviceVoltage)
    if (!isPositive(data.serviceVoltage)) {
      errors.push({
        field: "serviceVoltage",
        message: "Invalid serviceVoltage value"
      })
    }
  }

  // circuitBreaker
  if (!isNonEmpty(data.circuitBreaker)) {
    errors.push({
      field: "circuitBreaker",
      message: "circuitBreaker is required"
    })
  } else {
    data.circuitBreaker = parseNumber(data.circuitBreaker)
    if (!isPositive(data.circuitBreaker)) {
      errors.push({
        field: "circuitBreaker",
        message: "Invalid circuitBreaker value"
      })
    }
  }

  // lat
  if (!isNonEmpty(data.coords.lat)) {
    errors.push({
      field: "lat",
      message: "lat is required"
    })
  } else {
    data.coords.lat = parseNumber(data.coords.lat)
    if (data.coords.lat < -90 || data.coords.lat > 90) {
      errors.push({
        field: "lat",
        message: "Invalid lat value"
      })
    }
  }

  // lng
  if (!isNonEmpty(data.coords.lng)) {
    errors.push({
      field: "lng",
      message: "lng is required"
    })
  } else {
    data.coords.lng = parseNumber(data.coords.lng)
    if (data.coords.lng < -180 || data.coords.lng > 180) {
      errors.push({
        field: "lng",
        message: "Invalid lng value"
      })
    }
  }

  // TODO AT LATER DATE CONSUMPTION VALIDATOR (STILL SOME THINGS TO TWEAK BEFORE MAKING VALIDATOR)

  if (!Array.isArray(data.sitePhotos) || data.sitePhotos.length === 0) {
    delete data.sitePhotos
  } else {
    data.sitePhotos = data.sitePhotos
      .map((p) => parseString(p))
      .filter((p) => isNonEmpty(p));
    if (data.sitePhotos.length === 0) delete data.sitePhotos;
  }

  if (errors.length) {
    return res.status(422).json({ success: false, errors });
  }

  // Pass the validated data to the next express point
  req.validatedData = data;
  next();
};
