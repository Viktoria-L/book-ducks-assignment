import { toReadMeList } from "./api.js";
import { ratingSection } from "./rating.js";
import { sortByTitle, sortByAuthor, sortByRating } from "./sort.js";
import { messageModal } from "./extra.js";
import { deleteBookMark } from "./api.js";

const bookShelf = document.querySelector(".bookShelf");
const userProfile = document.querySelector(".userInfo");
const mySavedBooks = document.querySelector(".savedBooksDiv");
const myRatedBooks = document.querySelector(".myRatedBooks");
const bookListTBody = document.querySelector("#book-list");
const titleHeader = document.getElementById("titleHeader");
const authorHeader = document.getElementById("authorHeader");
const ratingHeader = document.getElementById("ratingHeader");
let sortOrder = "asc";

// ----------------- RENDER BOOKS ----------------- //
export let renderBooks = (data) => {
  bookShelf.innerHTML = "";

  data.forEach((book) => {
    let { title, author, pages, releaseDate, averageRating, imageUrl, users } =
      book.attributes;
    let bookDiv = document.createElement("div");
    bookDiv.className = `bookDiv${book.id}`;
    bookDiv.innerHTML = `<div class="buttonImg"><button id="save${book.id}">
      <i class="fa-solid fa-bookmark" id="bookmark${book.id}"></i></button>
      <img src="http://localhost:1337${imageUrl?.data.attributes.url}"/></div>
          <div class="bookInfoDiv"><ul id="bookUl${book.id}">
          <div class="bookInfo"><div class="titleAndAuthor">
          <li><h3>${title}</h3></li>
          <li class="italicLi">${author}</li>
          </div><div class="pagesDateGrade">
          <li>Antal sidor: ${pages}</li>
          <li>Utgiven: ${releaseDate}</li>
          <li>Betyg: ${averageRating ? averageRating : "Inget betyg ännu"}</li> 
          </div></div></ul></div>`;
    bookShelf.append(bookDiv);
    const bookUl = document.getElementById(`bookUl${book.id}`);
    const saveBtn = document.getElementById(`save${book.id}`);
    const bookMark = document.getElementById(`bookmark${book.id}`);

    for (let i = 0; i < users.data.length; i++) {
      if (
        sessionStorage.getItem("userName") === users.data[i].attributes.username
      ) {
        bookMark.style.color = "black";
      }
    }

    saveBtn.addEventListener("click", () => {
      if (sessionStorage.getItem("token")) {
        console.log("du sparade boken: ", title);
        bookMark.style.color = "black";
        toReadMeList(book);
      } else {
        messageModal("Du behöver logga in för att spara böcker");
      }
    });

    ratingSection(bookUl, book.id);
  });
};

// ----------------- RENDER PROFILE ----------------- //
export let renderProfile = async () => {
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
  userProfile.innerHTML = `<h4>Användarnamn: ${username}</h4>
    <h4>Email: ${email}</h4>`;
  if (saved_books.length === 0) {
    let p = document.createElement("p");
    p.innerText =
      'Du har inte sparat några böcker ännu, gå in på "hem" och tryck på bokmärket för att spara böcker.';
    mySavedBooks.append(p);
  } else {
    saved_books.forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "savedBookDiv";

      const bookmarkDiv = document.createElement("div");
      bookmarkDiv.className = "bookmarkBtn";
      const deleteBtn = document.createElement("button");
      deleteBtn.id = `delete${book.id}`;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      deleteBtn.addEventListener("click", () => {
        console.log("försöker radera, ", book.id);
        deleteBookMark(book.id);
        bookDiv.remove();
      });

      bookmarkDiv.appendChild(deleteBtn);
      bookDiv.appendChild(bookmarkDiv);

      const img = document.createElement("img");
      img.src = `http://localhost:1337${book.imageUrl?.formats.thumbnail.url}`;
      bookDiv.appendChild(img);

      const title = document.createElement("p");
      title.className = "savedTitle";
      title.innerText = book.title;
      bookDiv.appendChild(title);

      mySavedBooks.appendChild(bookDiv);
    });
  }
  if (reviews.length === 0) {
    let p = document.createElement("p");
    p.innerText = "Du har inte recenserat några böcker ännu.";
    myRatedBooks.append(p);
  } else {
    reviews.forEach((review) => {
      sortByTitle(reviews, sortOrder);
    });
  }

  titleHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByTitle(reviews, sortOrder);
  });
  authorHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByAuthor(reviews, sortOrder);
  });
  ratingHeader.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortByRating(reviews, sortOrder);
  });
};

// ----------------- RENDER BOOKS IN REVIEWTABLE ----------------- //
export function populateList(books) {
  bookListTBody.innerHTML = "";
  books.forEach((book) => {
    addReviewedBooks(book);
  });
}

// ----------------- CREATE TABLE ----------------- //
export function addReviewedBooks(book) {
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
