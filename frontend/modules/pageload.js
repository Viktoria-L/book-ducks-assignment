import { getBooks } from "./api.js";
import { renderProfile } from "./render.js";
import { logOut } from "./login-logout.js";
import { displayHighestRatedBooks } from "./extra.js";

const loginOrRegister = document.querySelector(".loginOrRegister");
const loginDiv = document.querySelector(".loginDiv");
const welcomeMsg = document.querySelector(".welcomeMessage");
const mySavedBooks = document.querySelector(".mySavedBooks");
const myRatedBooks = document.querySelector(".myRatedBooks");

// --------------- LOAD PAGES --------------- //
export let onPageLoad = () => {
    if (location.pathname === "/frontend/index.html") {
      if (sessionStorage.getItem("token")) {
        console.log("Ja, någon är inloggad");
        loginDiv.classList.add("hidden");
        welcomeMsg.innerHTML = `<h3>Välkommen tillbaka!</h3><p>Du är inloggad som ${sessionStorage.getItem(
          "userName"
        )}</p>`;
        displayHighestRatedBooks();
        getBooks();
        logOut();
      } else {
        getBooks();
      }
    } else if (location.pathname === "/frontend/profile.html") {
      if (sessionStorage.getItem("token")) {
        loginOrRegister.classList.add("hidden");
        welcomeMsg.innerHTML = `<h3>Välkommen tillbaka!</h3><p>Du är inloggad som ${sessionStorage.getItem(
          "userName"
        )}</p>`;
        logOut();
        renderProfile();
      } else {
        welcomeMsg.innerHTML = `Du behöver vara inloggad för att komma åt profilsidan`;
        mySavedBooks.classList.add("hidden");
        myRatedBooks.classList.add("hidden");
      }
    }
  };