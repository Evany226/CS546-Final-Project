import {
  checkParameter,
  checkUsername,
  checkCity,
  checkDescription,
  checkIfValidState,
  checkPassword,
} from "./helpers";

console.log("profile linked");

const editProfileForm = document.getElementById("edit-profile-form");
const username = document.getElementById("username");
const city = document.getElementById("city");
const state = document.getElementById("state");
const description = document.getElementById("description");

if (editProfileForm) {
  editProfileForm.addEventListener("submit", async (event) => {
    const usernameVal = username.value;
    const cityVal = city.value;
    const stateVal = state.value;
    const descriptionVal = description.value;

    let errorArr = [];

    checkParameter(usernameVal, "Username");
    checkParameter(cityVal, "City");
    checkParameter(stateVal, "State");
    checkParameter(descriptionVal, "Description");

    try {
      usernameVal = checkUsername(usernameVal);
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

    try {
      descriptionVal = checkDescription(descriptionVal);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      event.preventDefault();
      errorArr.forEach((error) => {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.innerText = error;
        editProfileForm.appendChild(errorDiv);
      });
    } else {
      editProfileForm.submit();
    }

    return;
  });
}
