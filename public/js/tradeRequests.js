const rejectForm = document.getElementById("reject-form");
const rejectButton = document.getElementById("reject-trade-button");
const errorDiv = document.querySelector(".error-div");

let errorArr = [];

if (rejectForm) {
  rejectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorArr = [];

    const tradeRequestId = rejectForm.getAttribute("data-id");
    console.log(tradeRequestId);

    const response = await fetch(`/trade-requests/${tradeRequestId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    errorDiv.innerHTML = "";

    const deletedItem = document.body.querySelector(
      `.tradeRequest-item[data-id="${tradeRequestId}"]`
    );

    deletedItem.innerHTML = `<p>Trade Request Rejected</p>`;

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

const acceptForm = document.getElementById("accept-form");

if (acceptForm) {
  acceptForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tradeRequestId = acceptForm.getAttribute("data-id");
    console.log(tradeRequestId);

    const response = await fetch(`/trade-requests/${tradeRequestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    errorDiv.innerHTML = "";

    const item = document.body.querySelector(
      `.tradeRequest-item[data-id="${tradeRequestId}"]`
    );

    item.innerHTML = `<p>Trade Request Accepted! Message that user to conclude trade.</p>`;

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
