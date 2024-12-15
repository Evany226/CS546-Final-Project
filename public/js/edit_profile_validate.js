import {
  checkParameter,
  checkUsername,
  checkCity,
  checkDescription,
  checkIfValidState,
  checkPassword,
} from "./helpers.js";

console.log("profile linked");

const editProfileForm = document.getElementById("edit-profile-form");
const username = document.getElementById("username");
const city = document.getElementById("city");
const state = document.getElementById("state");
const description = document.getElementById("description");
const errorDiv = document.querySelector(".error-div");

let errorArr = [];

if (editProfileForm) {
  editProfileForm.addEventListener("submit", async (event) => {
    const usernameVal = username.value;
    const cityVal = city.value;
    const stateVal = state.value;
    const descriptionVal = description.value;

    errorArr = [];

    try {
      checkUsername(usernameVal);
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

    try {
      checkDescription(descriptionVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      event.preventDefault();

      errorDiv.innerHTML = "";
      errorDiv.hidden = false;
      errorArr.forEach((error) => {
        const errorItem = document.createElement("p");
        errorItem.classList.add("error-item");
        errorItem.innerHTML = error;
        errorDiv.appendChild(errorItem);
      });
    }
  });
}
