import {
  checkParameter,
  checkUsername,
  checkCity,
  checkDescription,
  checkIfValidState,
  checkPassword,
} from "./helpers.js";

console.log("linked");

const signUpForm = document.getElementById("signup-form");
const errorDiv = document.querySelector(".error-div");

let username = document.getElementById("username");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");
let description = document.getElementById("description");
let city = document.getElementById("city");
let state = document.getElementById("state");

let errorArr = [];

if (signUpForm) {
  signUpForm.addEventListener("submit", async (event) => {
    errorArr = [];

    let usernameVal = username.value;
    let passwordVal = password.value;
    let confirmPasswordVal = confirmPassword.value;
    let descriptionVal = description.value;
    let cityVal = city.value;
    let stateVal = state.value;

    try {
      usernameVal = checkUsername(usernameVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      password = checkPassword(passwordVal);
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
      cityVal = checkCity(cityVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      stateVal = checkIfValidState(stateVal);
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
