import { checkTheme, getBooks } from "./api.js";
import { renderProfile } from "./render.js";
import { logOut } from "./login-logout.js";
import { displayHighestRatedBooks, messageModal } from "./extra.js";

const loginOrRegister = document.querySelector(".loginOrRegister");
const loginDiv = document.querySelector(".loginDiv");
const welcomeMsg = document.querySelector(".welcomeMessage");
const mySavedBooks = document.querySelector(".mySavedBooks");
const myRatedBooks = document.querySelector(".myRatedBooks");

// --------------- LOAD PAGES --------------- //
export let onPageLoad = () => {
  checkTheme();
  
  if (location.pathname === "/frontend/index.html") {
    if (sessionStorage.getItem("token")) {
      loginDiv.classList.add("hidden");
      welcomeMsg.innerHTML = `<h3>Välkommen tillbaka!</h3><p>Du är inloggad som ${sessionStorage.getItem(
        "userName"
      )}</p>`;
      displayHighestRatedBooks();
      getBooks();
      logOut();
    } else {
      window.location.href = "index.html#loginLink";
      displayHighestRatedBooks();
      getBooks();
    }
  } else if (location.pathname === "/frontend/profile.html") {
    if (sessionStorage.getItem("token")) {
      welcomeMsg.innerHTML = `<h3>Välkommen tillbaka!</h3><p>Du är inloggad som ${sessionStorage.getItem(
        "userName"
      )}</p>`;
      logOut();
      renderProfile();
    } else {
      window.location.href = "profile.html#loginLink";
      loginOrRegister.classList.remove("hidden");
      setTimeout(() => {
        messageModal("Du behöver vara inloggad för att komma åt profilsidan");        
      }, 1000);
      mySavedBooks.classList.add("hidden");
      myRatedBooks.classList.add("hidden");
    }
  }
};
