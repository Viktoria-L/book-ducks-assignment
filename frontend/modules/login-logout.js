const registerDiv = document.querySelector(".registerDiv");
const loginDiv = document.querySelector(".loginDiv");
const logoutDiv = document.querySelector(".logout");
const loginPage = document.querySelector(".login");
const loginOrRegister = document.querySelector(".loginOrRegister");
const welcomeMsg = document.querySelector(".welcomeMessage");

// ----------------- REGISTER USER -> TO STRAPI ----------------- //
// export let register = async (info) => {
//   try {
//     let response = await fetch(
//       "http://localhost:1337/api/auth/local/register",
//       {
//         method: "POST",
//         body: JSON.stringify(info),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response.status === 400) {
//       let errorMessage = document.createElement("h3");
//       errorMessage.innerText = "Något gick fel med registreringen!";
//       registerDiv.append(errorMessage);
//       console.log("Något blev fel vid registreringen");
//     } else {
//       let data = await response.json();
//       sessionStorage.setItem("token", data.jwt);
//       sessionStorage.setItem("userName", data.user.username);
//       sessionStorage.setItem("userId", data.user.id);

//       console.log(data.user);
//       loginSuccess(data);
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };


//Gör en modal kanske?
//GÖR BÄTTRE FELMEDDELANDEN BEROENDE PÅ LOGin eller register,
//Lägg till en tredje parameter t.ex. typ login så ska den skriva detta
//ob samt ta bort de tidigare funktionerna
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
      let errorMessage = document.createElement("h3");
      errorMessage.innerText = "Något gick fel!";
      registerDiv.append(errorMessage);
      console.log("Något blev fel vid registreringen");
    });
};

//Funktion för att logga in - KOLLA PÅ FELHANTERINGEN - gör en o samma  register/login?
// export let login = async (info) => {
//   let response = await fetch("http://localhost:1337/api/auth/local", {
//     method: "POST",
//     body: JSON.stringify(info),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.status === 400) {
//     let errorMessage = document.createElement("h3");
//     errorMessage.innerText = "Felaktiga inloggningsuppgifter!";
//     loginPage.append(errorMessage);
//   } else {
//     let data = await response.json();
//     sessionStorage.setItem("token", data.jwt);
//     sessionStorage.setItem("userName", data.user.username);
//     sessionStorage.setItem("userId", data.user.id);

//     console.log(data);
//     loginSuccess(data);
//     getBooks();
//     logOut();
//   }
// };

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
