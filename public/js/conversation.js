console.log("conv linked");
import { checkUsername } from "./helpers.js";

const createConvForm = document.getElementById("create-conv-form");
const createConvInput = document.getElementById("create-conv-input");
const errorDiv = document.querySelector(".error-div");

let errorArr = [];

if (createConvForm) {
  createConvForm.addEventListener("submit", async (event) => {
    errorArr = [];

    const otherUsername = createConvInput.value;

    try {
      checkUsername(otherUsername);
    } catch (error) {
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      event.preventDefault();
      errorDiv.innerHTML = "";
      errorDiv.hidden = false;

      const errorItem = document.createElement("p");
      errorItem.classList.add("error-item");
      errorItem.innerHTML = error;
      errorDiv.appendChild(errorItem);
    }
  });
}
