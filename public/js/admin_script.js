
// document.addEventListener("DOMContentLoaded", (ev) => {    
    
// });

let errorArr = [];
const errorDiv = document.querySelector(".error-div");

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
  

let addCollectionPage = document.getElementById("admin-add-collection-form");


if(addCollectionPage){
    addCollectionPage.addEventListener("submit", (event) =>{
        errorArr = [];
        let collectionName = document.getElementById("collectionName").value;
        let collectionImageUrl = document.getElementById("collectionImageUrl").value;

        try {
            collectionName = checkString(collectionName, "collectionName");
            if(collectionName.length > 20){
                throw new Error("Collection Name name exceeds character limit, 20 characters max")
            }
        } catch (error) {
            errorArr.push(error.message);
        }

        try {
            collectionImageUrl = checkString(collectionImageUrl, "collectionImageUrl");
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
    })
}



let addFigurePage = document.getElementById("admin-add-figure-form");

if(addFigurePage){
    addFigurePage.addEventListener("submit", (event) =>{
        errorArr = [];
        let figureName = document.getElementById("figureName").value;
        let figureImageUrl = document.getElementById("figureImageUrl").value;

        try {
            figureName = checkString(figureName, "figureName");
            if(figureName.length > 20){
                throw new Error("figureName name exceeds character limit, 20 characters max")
            }
        } catch (error) {
            errorArr.push(error.message);
        }

        try {
            figureImageUrl = checkString(figureImageUrl, "figureImageUrl");
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
    })
}



let editCollectionPage = document.getElementById("admin-edit-collection-form");


if(editCollectionPage){
    editCollectionPage.addEventListener("submit", (event) =>{
        errorArr = [];
        let collectionName = document.getElementById("collectionName").value;
        let collectionImageUrl = document.getElementById("collectionImageUrl").value;

        try {
            if(collectionName){
                collectionName = checkString(collectionName, "collectionName");
                if(collectionName.length > 20){
                    throw new Error("figureName name exceeds character limit, 20 characters max")
                }
            }
            
        } catch (error) {
            errorArr.push(error.message);
        }

        try {
            if(collectionImageUrl){
                collectionImageUrl = checkString(collectionImageUrl, "collectionImageUrl");
            }
            
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
    })
}



let editFigurePage = document.getElementById("admin-edit-figure-form");


if(editFigurePage){
    editFigurePage.addEventListener("submit", (event) =>{
        errorArr = [];
        let figureName = document.getElementById("figureName").value;
        let figureImageUrl = document.getElementById("figureImageUrl").value;

        try {
            if(figureName){
                figureName = checkString(figureName, "figureName");
                if(figureName.length > 20){
                    throw new Error("figureName name exceeds character limit, 20 characters max")
                }
            }
            
        } catch (error) {
            errorArr.push(error.message);
        }

        try {
            if(figureImageUrl){
                figureImageUrl = checkString(figureImageUrl, "figureImageUrl");
            }
            
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
    })
}