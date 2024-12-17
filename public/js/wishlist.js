console.log("wishlist linked")
import { checkId } from "./../../helpers.js";


const wishlistButton = document.getElementById("figure");

if(wishlistButton) {
    wishlistButton.addEventListener("image", async (event) => {
        const figureId = wishlistButton;

        errorArr = [];
        try {
              checkId(figureId);
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