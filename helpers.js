import { ObjectId } from "mongodb";

export function checkString(str, varName) {
  if (str == undefined) {
    throw new Error(`${varName} is undefined`);
  }
  if (typeof str !== "string") {
    throw new Error(`${varName} expected string, not a string`);
  }
  if (str.trim().length === 0) {
    throw new Error(`${varName} cannot be an empty string or just spaces`);
  }

  if (!isNaN(str)) {
    throw new Error(`${varName} cannot be a number`);
  }

  return str.trim();
}

export function checkNumber(number, varName) {
  if (!number) throw new Error(`${varName} is undefined`);
  if (typeof number !== "number" || isNaN(number))
    throw `${varName} must be a number`;
  return number;
}

export function checkObject(object, varName) {
  if (!object) throw new Error(`${varName} is undefined`);
  if (Array.isArray(object) || typeof object !== "object")
    throw new Error(`${varName} is not an object`);
  return object;
}

export function checkCondition(condition) {
  condition = checkString(condition, "condition");
  condition =
    condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
  if (
    condition !== "New" &&
    condition !== "Used" &&
    condition !== "Minimal Wear" &&
    condition !== "Well Worn"
  )
    throw new Error(
      "status must either be New, Minimal Wear, Used, or Well Worn"
    );

  return condition;
}

export function checkListingStatus(listingStatus) {
  listingStatus = checkString(listingStatus);
  listingStatus =
    listingStatus.charAt(0).toUpperCase() +
    listingStatus.slice(1).toLowerCase();
  if (
    listingStatus !== "Open" &&
    listingStatus !== "Pending" &&
    listingStatus !== "Closed"
  )
    throw new Error("listingStatus must either be Open, Pending, or Closed");

  return listingStatus;
}

export function checkTransactionStatus(transactionStatus) {
  transactionStatus = checkString(transactionStatus);
  transactionStatus =
    transactionStatus.charAt(0).toUpperCase() +
    transactionStatus.slice(1).toLowerCase();
  if (
    transactionStatus !== "Open" &&
    transactionStatus !== "Pending" &&
    transactionStatus !== "Closed"
  )
    throw new Error(
      "transactionStatus must either be Pending, Accepted, or Declined"
    );

  return transactionStatus;
}

export function checkId(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Id is not a valid object Id");
  }

  if (typeof id !== "string") {
    throw new Error("Id is not a string");
  }

  id = id.trim();

  if (id.length === 0) {
    throw new Error("Id cannot be an empty string or just spaces");
  }

  return id;
}

export function checkDate(date) {
  if (!date) throw `You must provide a ${varName}`;
  date = checkString(date, "date");

  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(date)) throw "Date must be in MM/DD/YYYY format";

  let dateArr = date.split("/");
  let monthCheck = new Date(date);
  monthCheck = monthCheck.getMonth() + 1;

  if (Number(dateArr[0]) != monthCheck) throw "Date must be a real valid date";

  return date;
}

export function parameterExists(param, varName) {
  if (param == undefined) {
    throw new Error(`${varName} is required`);
  }
}

export function checkUsername(username) {
  username = checkString(username, "username");

  if (username.length < 5 || username.length > 15) {
    throw new Error("Username must be between 5 and 15 characters");
  }

  return username;
}

export function checkPassword(password) {
  password = checkString(password, "password");

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hasDigit = password.match(/[0-9]/);
  const hasUpper = password.match(/[A-Z]/);
  const hasSpecialChar = password.match(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  );

  if (!hasDigit || !hasUpper || !hasSpecialChar) {
    throw new Error(
      "Password must contain at least one digit, one uppercase letter, and one special character"
    );
  }

  return password;
}

export function checkDescription(description) {
  description = checkString(description, "Description");

  if (description.length < 20 || description.length > 255) {
    throw new Error("Description must be between 20 and 255 characters");
  }

  return description;
}

export function checkCity(city) {
  city = checkString(city, "City");

  if (city.length < 2 || city.length > 50) {
    throw new Error("City must be between 2 and 50 characters");
  }

  return city;
}

export function checkIfValidState(state) {
  if (state.length !== 2) {
    throw new Error("State must be a valid abbreviation of 2 characters.");
  }

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  let isState = false;
  for (var i = 0; i < states.length; i++) {
    if (states[i] == state) {
      isState = true;
      break;
    }
  }

  if (!isState) {
    throw new Error("State must be a valid state abbreviation.");
  }

  return state;
}
