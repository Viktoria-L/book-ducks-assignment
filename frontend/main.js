const loginOrRegister = document.querySelector(".loginOrRegister");
const mainContent = document.querySelector(".main-content");
const welcomeMsg = document.querySelector(".welcomeMessage");
const bookShelf = document.querySelector(".bookShelf");
const userProfile = document.querySelector(".userInfo");
const mySavedBooks = document.querySelector(".mySavedBooks");
const myRatedBooks = document.querySelector(".myRatedBooks");
const bookListTBody = document.querySelector("#book-list");
const titleHeader = document.getElementById("titleHeader");
const authorHeader = document.getElementById("authorHeader");
const ratingHeader = document.getElementById("ratingHeader");
let sortOrder = "asc";


//Logga in
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");
const loginPage = document.querySelector(".login");

//Registrera
const registerBtn = document.querySelector("#registerBtn");
const registerDiv = document.querySelector("#registerDiv");
const regUsername = document.querySelector("#regUsername");
const regEmail = document.querySelector("#regEmail");
const regPassword = document.querySelector("#regPassword");
let userInfo;

//funktion för att rendera ut böckerna
let renderBooks = (data) => {
  bookShelf.innerHTML = "";
  //En div med img + ul med li-items för titel, författare, sidor & utgivningsdatum,
  //en div med en p + input för att sätta rating 1-10 - radiobuttons? slide?
  data.forEach((book) => {
    let { title, author, pages, releaseDate, averageRating, imageUrl } =
      book.attributes;
    let bookDiv = document.createElement("div");
    bookDiv.className = `bookDiv${book.id}`;
    bookDiv.innerHTML = `<div><img src="http://localhost:1337${
      imageUrl?.data.attributes.url
    }"/></div>
        <div><ul id="bookUl${book.id}">
        <li>${title}</li>
        <li>${author}</li>
        <li>${pages}</li>
        <li>${releaseDate}</li>
        <li>${averageRating ? averageRating : "Inget betyg ännu"}</li> 
        <button id="save${book.id}">Lägg till i "Att läsa"</button> 
        </ul></div>`;
    bookShelf.append(bookDiv);
    const bookUl = document.getElementById(`bookUl${book.id}`);
    const saveBtn = document.getElementById(`save${book.id}`);
    saveBtn.addEventListener("click", () => {
      console.log("du klicka på att läsa: ", title);
      toReadMeList(book);
    });

    ratingSection(bookUl, book.id);
  });
};

//Funktion för att spara en bok till userlistan
let toReadMeList = async (book) => {
  let response = await axios.get(
    `http://localhost:1337/api/users/${sessionStorage.getItem(
      "userId"
    )}?populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(response.data.saved_books);
  let savedBooks = response.data.saved_books || [];
  savedBooks.push(book);

  response = await axios.put(
    `http://localhost:1337/api/users/${sessionStorage.getItem("userId")}`,
    {
      saved_books: savedBooks,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(response);
};

//Funktion för att skriva ut profilsidan
let renderProfile = async () => {
  let response = await axios.get(
    `http://localhost:1337/api/users/me?populate=deep,4`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log("me-response: ", response);
  let { username, email, saved_books, reviews } = response.data;
  userProfile.innerHTML = `<h3>Användarnamn: ${username}</h3>
  <h3>Email: ${email}</h3>`;
  saved_books.forEach((book) => {
    mySavedBooks.innerHTML += `<p>${book.title}</p>`;
  });
  reviews.forEach((review) => {
    // addReviewedBooks(review);
    sortByTitle(reviews, sortOrder);
  });

  titleHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByTitle(reviews, sortOrder);  
    console.log("Du klicka på title");
  });
  authorHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByAuthor(reviews, sortOrder);
     console.log("Du klicka på author");
  });
  ratingHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByRating(reviews, sortOrder);
    console.log("Du klicka på rating");
  });
};

// Funktion som lägger till alla böcker i listan
function populateList(books) {
  bookListTBody.innerHTML = "";
  books.forEach((book) => {
    addReviewedBooks(book);
  });
}

//Funktion som skapar upp alla recenserade böcker i en tabell
function addReviewedBooks(book) {
  const tr = document.createElement("tr");
  const imgTd = document.createElement("td");
  const titleTd = document.createElement("td");
  const authorTd = document.createElement("td");
  const ratingTd = document.createElement("td");

  imgTd.innerHTML = `<img src="http://localhost:1337${book.book.imageUrl?.formats.thumbnail.url}"/>`;
  titleTd.innerText = book.book.title;
  authorTd.innerText = book.book.author;
  ratingTd.innerText = book.book.averageRating;

  tr.appendChild(imgTd);
  tr.appendChild(titleTd);
  tr.appendChild(authorTd);
  tr.appendChild(ratingTd);

  bookListTBody.appendChild(tr);
}
//----------------sortering --------------------------

// Funktion för att sortera böcker efter titel
function sortByTitle(books, sortOrder) {
  books.sort((a, b) => {
    const titleA = a.book.title.toUpperCase();
    const titleB = b.book.title.toUpperCase();
    if (titleA < titleB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (titleA > titleB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
  populateList(books);
}

// Funktion för att sortera böcker efter författare
function sortByAuthor(books, sortOrder) {
  books.sort((a, b) => {
    const authorA = a.book.author.toUpperCase();
    const authorB = b.book.author.toUpperCase();
    if (authorA < authorB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (authorA > authorB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
  populateList(books);
}

// Funktion för att sortera böcker efter betyg
function sortByRating(books, sortOrder) {
  books.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.book.averageRating - b.book.averageRating;
    } else {
      return b.book.averageRating - a.book.averageRating;
    }
  });
  populateList(books);
};

// Lyssnare på knappar för sortering
// sortTitleBtn.addEventListener('click', sortByTitle);
// sortAuthorBtn.addEventListener('click', sortByAuthor);
// sortRatingBtn.addEventListener('click', sortByRating);

//----------------slut sortering --------------------------

//Funktion för att hämta böcker
let getBooks = async () => {
  let response = await axios.get(
    "http://localhost:1337/api/books?populate=deep"
  );
  console.log(response.data.data);
  renderBooks(response.data.data);
};

//Laddar sidan och kollar om någon är inloggad
let onPageLoad = () => {
  if (location.pathname === "/frontend/index.html") {
    if (sessionStorage.getItem("token")) {
      console.log("Ja, någon är inloggad");
      loginOrRegister.classList.add("hidden");
      welcomeMsg.innerHTML = `Välkommen tillbaka, du är inloggad som ${sessionStorage.getItem(
        "userName"
      )}`;
      //Ladda någon form av profilsida här
      getBooks();
      logOut();
    } else {
      getBooks();
    }
  } else if (location.pathname === "/frontend/profile.html") {
    if (sessionStorage.getItem("token")) {
      console.log("profil");
      loginOrRegister.classList.add("hidden");
      logOut();
      renderProfile();
    } else {
      welcomeMsg.innerHTML = `Du behöver vara inloggad för att komma åt profilsidan`;
      mySavedBooks.classList.add("hidden");
      myRatedBooks.classList.add("hidden");
    }
  }
};

onPageLoad();

//Registrera användare-Knapp
registerBtn.addEventListener("click", () => {
  if (registerDiv.classList.contains("hidden")) {
    registerDiv.classList.remove("hidden");
    loginPage.classList.add("hidden");
  } else {
    userInfo = {
      username: regUsername.value,
      email: regEmail.value,
      password: regPassword.value,
    };
    register(userInfo);
  }
});

//Funktion för att registrera användare
let register = async (info) => {
  try {
    let response = await fetch(
      "http://localhost:1337/api/auth/local/register",
      {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 400) {
      let errorMessage = document.createElement("h3");
      errorMessage.innerText = "Något gick fel med registreringen!";
      loginPage.append(errorMessage);
      console.log("Något blev fel vid registreringen");
    } else {
      let data = await response.json();
      sessionStorage.setItem("token", data.jwt);
      sessionStorage.setItem("userName", data.user.username);
      sessionStorage.setItem("userId", data.user.id);

      console.log(data.user);
      loginSuccess(data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Funktion för välkomsthälsning
let loginSuccess = (data) => {
  loginOrRegister.classList.add("hidden");
  welcomeMsg.innerHTML = `<p>Välkommen! <br>Du är inloggad som ${data.user.username}!</p><br>
         `;
};

//Login-knapp
loginBtn.addEventListener("click", () => {
  if (loginPage.classList.contains("hidden")) {
    loginPage.classList.remove("hidden");
    registerDiv.classList.add("hidden");
  } else {
    userInfo = {
      identifier: usernameInput.value,
      password: passwordInput.value,
    };

    login(userInfo);
  }
});

//Funktion för att logga in - KOLLA PÅ FELHANTERINGEN - gör en o samma  register/login?
let login = async (info) => {
  let response = await fetch("http://localhost:1337/api/auth/local", {
    method: "POST",
    body: JSON.stringify(info),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 400) {
    let errorMessage = document.createElement("h3");
    errorMessage.innerText = "Felaktiga inloggningsuppgifter!";
    loginPage.append(errorMessage);
  } else {
    let data = await response.json();
    sessionStorage.setItem("token", data.jwt);
    sessionStorage.setItem("userName", data.user.username);
    sessionStorage.setItem("userId", data.user.id);

    console.log(data);
    loginSuccess(data);
    getBooks();
    logOut();
  }
};

//Funktion för att logga ut
function logOut() {
  let logOutBtn = document.createElement("button");
  logOutBtn.innerText = "Logga ut";
  document.querySelector("header").append(logOutBtn);

  logOutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userId");
    location.reload();
  });
}

//Funktion för rating-delen
async function ratingSection(element, bookId) {
  let alreadyReviewed = false;
  let myRating = null;
  let ratingDiv = document.createElement("div");
  ratingDiv.className = "ratingDiv";

  if (sessionStorage.getItem("token")) {
    let hasReviewed = await axios.get(
      `http://localhost:1337/api/users/me?populate=deep,3`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    let userReviews = hasReviewed.data.reviews;

    //Kollar ifall inloggad user redan betygsatt boken
    userReviews.forEach((review) => {
      if (review.book.id === bookId) {
        alreadyReviewed = true;
        myRating = review.rating;
      }
    });

    if (!alreadyReviewed) {
      ratingDiv.innerHTML = `<h4>Betygsätt gärna denna bok:</h4>
        <div class="ratings">
        <label for="rating">1<input type="radio" name="rating" value="1" /></label>
        <label for="rating">2<input type="radio" name="rating" value="2" /></label>
        <label for="rating">3<input type="radio" name="rating" value="3" /></label>
        <label for="rating">4<input type="radio" name="rating" value="4" /></label>
        <label for="rating">5<input type="radio" name="rating" value="5" /></label>
        <label for="rating">6<input type="radio" name="rating" value="6" /></label>
        <label for="rating">7<input type="radio" name="rating" value="7" /></label>
        <label for="rating">8<input type="radio" name="rating" value="8" /></label>
        <label for="rating">9<input type="radio" name="rating" value="9" /></label>
        <label for="rating">10<input type="radio" name="rating" value="10" /></label>
        </div>
        <button type="button" id="ratingBtn${bookId}">Betygsätt!</button>`;

      element.append(ratingDiv);
      let ratingBtn = document.getElementById(`ratingBtn${bookId}`);

      ratingBtn.addEventListener("click", () => {
        let rating = document.querySelector(`input[name="rating"]:checked`);
        console.log(rating.value);
        postRating(rating.value, bookId);
      });
    } else {
      ratingDiv.innerHTML = `<h4>Betygsätt gärna denna bok:</h4>
    <div class="ratings">
        <p>Du har redan betygsatt denna bok, du gav den ${myRating} i betyg</p>
        </div>`;
      element.append(ratingDiv);
    }
  } else {
    ratingDiv.innerHTML = `<h4>Logga in för att betygsätta boken!</h4>
  `;
    element.append(ratingDiv);
  }
}

//Funktion för att post:a rating
let postRating = async (rating, bookId) => {
  let response = await axios.post(
    "http://localhost:1337/api/reviews",
    {
      data: {
        rating: rating,
        book: bookId,
        user: sessionStorage.getItem("userId"),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(response);
  calculateAverageRating(bookId);
};

//Funktion för att hämta alla reviews på den bookId och räkna ut medelvärdet samt kasta upp det på snittbetyget
let calculateAverageRating = async (bookId) => {
  let average = 0;
  let ratingCount = 0;
  let response = await axios.get(
    `http://localhost:1337/api/books/${bookId}?populate=deep`
  );
  console.log(response.data.data.attributes.reviews.data);
  let allBookReviews = response.data.data.attributes.reviews.data;
  allBookReviews.forEach((review) => {
    console.log(review.attributes.rating);
    average += review.attributes.rating;
    ratingCount++;
  });
  console.log("efter loop: " + average + " ratingCount: ", ratingCount);
  let averageRating = average / ratingCount;
  console.log("Snittbetyg: ", averageRating);

  let uploadedAverage = await axios.put(
    `http://localhost:1337/api/books/${bookId}`,
    {
      data: {
        averageRating: averageRating.toFixed(1),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(uploadedAverage);
  getBooks();
};

//Funktion för att kolla tema-inställning på sidan
let checkTheme = async () => {
  let response = await axios.get("http:localhost:1337/api/pageConfig");
  let theme = response.data.data.attributes.theme;
  document.body.classList.add(theme);
};
