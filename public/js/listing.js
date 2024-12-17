console.log("linked listing");

import { checkDescription, checkString, checkCondition } from "./helpers.js";

const listingForm = document.getElementById("listingForm");

const lookingSelect = document.getElementById("looking-select");

if (lookingSelect) {
  lookingSelect.addEventListener("change", async (e) => {
    const collectionId = e.target.value;

    console.log(collectionId);

    try {
      const response = await fetch(`/figures/${collectionId}`, {
        method: "GET",
      });

      const data = await response.json();

      const figureSelect = document.getElementById("looking-figure-select");
      figureSelect.innerHTML = "";

      data.forEach((figure) => {
        const option = document.createElement("option");
        option.value = figure._id;
        option.textContent = figure.figureName;
        figureSelect.appendChild(option);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

const offerSelect = document.getElementById("offering-select");

if (offerSelect) {
  offerSelect.addEventListener("change", async (e) => {
    const collectionId = e.target.value;

    console.log(collectionId);

    try {
      const response = await fetch(`/figures/${collectionId}`, {
        method: "GET",
      });

      const data = await response.json();

      const figureSelect = document.getElementById("offering-figure-select");
      figureSelect.innerHTML = "";

      data.forEach((figure) => {
        const option = document.createElement("option");
        option.value = figure._id;
        option.textContent = figure.figureName;
        figureSelect.appendChild(option);
      });
    } catch (error) {
      console.log(error);
    }
  });
}

const createListingForm = document.getElementById("create-listing-form");
const lookingSelectId = document.getElementById("looking-select");
const lookingFigureSelect = document.getElementById("looking-figure-select");
const offeringSelectId = document.getElementById("offering-select");
const offeringFigureSelect = document.getElementById("offering-figure-select");
const description = document.getElementById("create-description");
const condition = document.getElementById("condition-select");
const errorDiv = document.querySelector(".error-div");

let errorArr = [];

if (createListingForm) {
  createListingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("submit");

    errorArr = [];

    try {
      checkString(listingName.value, "Listing name");
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkString(lookingSelectId.value, "Looking collection");
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkString(lookingFigureSelect.value, "Looking figure");
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkString(offeringSelectId.value, "Offering collection");
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkString(offeringFigureSelect.value, "Offering figure");
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkDescription(description.value);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      checkCondition(condition.value);
    } catch (error) {
      errorArr.push(error.message);
    }

    try {
      const response = await fetch("/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingName: listingName.value,
          collectionId: lookingSelectId.value,
          listingFigureId: lookingFigureSelect.value,
          offeringFigureId: offeringFigureSelect.value,
          description: description.value,
          condition: condition.value,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.error);
      }

      errorDiv.innerHTML = "";

      const listingWrapper = document.getElementById("listing-wrapper");
      listingWrapper.innerHTML += `<li class="listing-item">
              <div class="listing-img-wrapper">
                <img src="${data.listingFigureImageUrl}" alt="listing image" class="main-listing-img">
              </div>
              <a href="/listings/getListing/${data._id}" class="listing-link">${data.listingName}</a>
            <li>`;
    } catch (error) {
      console.log(error.message);
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
