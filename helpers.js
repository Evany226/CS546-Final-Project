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

  if (!isNaN(strVal)) {
    throw new Error(`${varName} cannot be a number`);
  }

  return str.trim();
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

export function checkUsername(username) {
  checkString(username, "username");

  if (username.length < 5 || username.length > 15) {
    throw new Error("Username must be between 5 and 15 characters");
  }
}

export function checkPassword(password) {
  checkString(password, "password");

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hasDigit = password.match(/[0-9]/);
  const hasUpper = password.match(/[A-Z]/);
  const hasSpecialChar = password.match(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  );

  if (!hasDigit || !hasUpper || !hasSpecialChar) {
    throw `Error: password must contain at least one digit, one uppercase letter, and one special character`;
  }
}

export function checkDescription(description) {
  checkString(description, "Description");

  if (descr.length < 20 || description.length > 255) {
    throw `Error: Description must be between 20 and 255 characters long`;
  }
}

export function checkCity(city) {
  checkString(city, "City");

  if (city.length < 2 || city.length > 50) {
    throw `Error: City must be between 2 and 25 characters long`;
  }
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
}
