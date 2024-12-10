function checkString(str, varName) {
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

function checkParameter(param, varName) {
  if (param == undefined) {
    throw new Error(`${varName} is required`);
  }
}

function checkEmail(email) {
  checkString(email, "Email");

  if (!email.includes("@")) {
    throw new Error("Email must be a valid email address");
  }

  if (email.length < 5 || email.length > 50) {
    throw new Error("Email must be between 3 and 64 characters");
  }
}

function checkUsername(username) {
  checkString(username, "Username");

  if (username.length < 5 || username.length > 15) {
    throw new Error("Username must be between 5 and 15 characters");
  }
}

function checkPassword(password) {
  checkString(password, "Password");

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
}

function checkDescription(description) {
  checkString(description, "Description");

  if (description.length < 20 || description.length > 255) {
    throw new Error("Description must be between 20 and 255 characters");
  }
}

function checkCity(city) {
  checkString(city, "City");

  if (city.length < 2 || city.length > 50) {
    throw new Error("City must be between 2 and 50 characters");
  }
}

function checkIfValidState(state) {
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

console.log("linked");

const signUpForm = document.getElementById("signup-form");
const errorDiv = document.querySelector(".error-div");

const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const description = document.getElementById("description");
const city = document.getElementById("city");
const state = document.getElementById("state");

let errorArr = [];

if (signUpForm) {
  signUpForm.addEventListener("submit", (event) => {
    errorArr = [];

    const emailVal = email.value;
    const usernameVal = username.value;
    const passwordVal = password.value;
    const confirmPasswordVal = confirmPassword.value;
    const descriptionVal = description.value;
    const cityVal = city.value;
    const stateVal = state.value;

    checkParameter(usernameVal, "Username");
    checkParameter(passwordVal, "Password");
    checkParameter(confirmPasswordVal, "Confirm Password");
    checkParameter(descriptionVal, "Description");
    checkParameter(cityVal, "City");
    checkParameter(stateVal, "State");

    try {
      checkEmail(emailVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkUsername(usernameVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkPassword(passwordVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkPassword(confirmPasswordVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (passwordVal !== confirmPasswordVal) {
      errorArr.push("Passwords do not match");
    }

    try {
      checkDescription(descriptionVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkCity(cityVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkIfValidState(stateVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      console.log(errorArr);
      event.preventDefault();

      errorDiv.hidden = false;
      errorDiv.innerHTML = "";

      errorArr.forEach((error) => {
        const errorItem = document.createElement("p");
        errorItem.classList.add("error-item");
        errorItem.innerHTML = error;
        errorDiv.appendChild(errorItem);
      });
    }
  });
}

const signInForm = document.getElementById("signin-form");
const signInUsername = document.getElementById("signin-username");
const signInPassword = document.getElementById("signin-password");

if (signInForm) {
  signInForm.addEventListener("submit", (event) => {
    errorArr = [];

    const usernameVal = signInUsername.value;
    const passwordVal = signInPassword.value;

    checkParameter(usernameVal, "Username");
    checkParameter(passwordVal, "Password");

    try {
      checkUsername(usernameVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkPassword(passwordVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      event.preventDefault();

      errorDiv.hidden = false;
      errorDiv.innerHTML = "";

      errorArr.forEach((error) => {
        console.log(errorArr);
        console.log(error);
        const errorItem = document.createElement("p");
        errorItem.classList.add("error-item");
        errorItem.innerHTML = error;
        errorDiv.appendChild(errorItem);
      });
    }
  });
}
