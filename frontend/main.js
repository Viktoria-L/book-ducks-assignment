import { onPageLoad } from "./modules/pageload.js";
import { registerOrLogin } from "./modules/login-logout.js"

const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");
const loginPage = document.querySelector(".login");
const registerBtn = document.querySelector("#registerBtn");
const registerDiv = document.querySelector("#registerDiv");
const regUsername = document.querySelector("#regUsername");
const regEmail = document.querySelector("#regEmail");
const regPassword = document.querySelector("#regPassword");
const loginUrl = "http://localhost:1337/api/auth/local";
const registerUrl = "http://localhost:1337/api/auth/local/register"
let userInfo;


onPageLoad();

// --------------- REGISTER Btn --------------- //
registerBtn.addEventListener("click", () => {
    userInfo = {
      username: regUsername.value,
      email: regEmail.value,
      password: regPassword.value,
    };
    registerOrLogin(userInfo, registerUrl);
  });

// --------------- LOGIN Btn --------------- //
loginBtn.addEventListener("click", () => {
      userInfo = {
      identifier: usernameInput.value,
      password: passwordInput.value,
    };
  registerOrLogin(userInfo, loginUrl);
  });
