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

export function checkParameter(param, varName) {
  if (param == undefined) {
    throw new Error(`${varName} is required`);
  }
}

export function checkUsername(username) {
  username = checkString(username, "Username");

  if (username.length < 5 || username.length > 15) {
    throw new Error("Username must be between 5 and 15 characters");
  }
}

export function checkPassword(password) {
  password = checkString(password, "Password");

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

export function checkCondition(condition) {
  condition = checkString(condition, "Condition");
  condition = condition.toLowerCase();

  if (
    condition !== "new" &&
    condition !== "used" &&
    condition !== "minimal wear" &&
    condition !== "well worn"
  ) {
    console.log(condition);
    throw new Error(
      "Condition must either be New, Minimal Wear, Used, or Well Worn"
    );
  }

  return condition;
}
