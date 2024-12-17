console.log("conv linked");
import { checkUsername } from "./helpers.js";

const createConvForm = document.getElementById("create-conv-form");
const createConvInput = document.getElementById("create-conv-input");
const errorDiv = document.querySelector(".error-div");

let errorArr = [];

if (createConvForm) {
  createConvForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorArr = [];

    const otherUsername = createConvInput.value;

    console.log(otherUsername);

    try {
      checkUsername(otherUsername);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      const response = await fetch("/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: otherUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      errorDiv.innerHTML = "";

      const convList = document.getElementById("conv-panel-list");
      convList.innerHTML += `<li class="conv-panel-list-item">
            <a class="conv-panel-link" href="/conversations/{{">
              <div class="conv-pfp">
              <img
                class="conv-pfp-img"
                src="https://via.placeholder.com/150"
                alt="User Profile Picture"
              />
            </div>
            <div class="conv-user-info">
              <h3 class="conv-name">${data.otherUsername}</h3>
            </div>
            </a>
          </li>`;
    } catch (error) {
      console.log(error.message);
      errorArr.push(error.message);
    }

    if (errorArr.length > 0) {
      console.log(errorArr);
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
