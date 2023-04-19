import { messageModal } from "./extra.js";

const loginDiv = document.querySelector(".loginDiv");
const logoutDiv = document.querySelector(".logout");
const welcomeMsg = document.querySelector(".welcomeMessage");

// ----------------- REGISTER USER / LOGIN ----------------- //

export let registerOrLogin = async (info, url) => {
  await axios
    .post(`${url}`, info)
    .then((response) => {
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("userName", response.data.user.username);
      sessionStorage.setItem("userId", response.data.user.id);

      console.log(response.data.user);
      loginSuccess(response.data);
      getBooks();
      logOut();
    })
    .catch((error) => {
            console.log(error.name + " " + error.message);
    });
};

// ----------------- LOGIN SUCCESS MESSAGE ----------------- //
export let loginSuccess = (data) => {
  loginDiv.classList.add("hidden");
  welcomeMsg.innerHTML = `<h3>Välkommen!</h3> <br><p>Du är inloggad som ${data.user.username}!</p><br>
           `;
  window.location.href = "profile.html";
};

// ----------------- LOGOUT ----------------- //
export function logOut() {
  let logOutBtn = document.createElement("button");
  logOutBtn.innerHTML = `Logga ut <i class="fa-solid fa-arrow-right-from-bracket"></i>`;
  logOutBtn.classList.add("logoutBtn");
  logoutDiv.classList.remove("hidden");
  logoutDiv.prepend(logOutBtn);

  logOutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    location.reload();
  });
}
