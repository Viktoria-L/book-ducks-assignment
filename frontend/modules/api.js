import { renderBooks } from "./render.js";

// ----------------- GET THEME FROM STRAPI ----------------- //
export let checkTheme = async () => {
    let response = await axios.get("http:localhost:1337/api/pageConfig");
    let theme = response.data.data.attributes.theme;
    document.body.classList.add(theme);
  };
  

// ----------------- GET BOOKS AND RENDER ----------------- //
export let getBooks = async () => {
    let response = await axios.get(
      "http://localhost:1337/api/books?populate=deep"
    );
    renderBooks(response.data.data);
  };

  // ----------------- BOOKMARK -> TO USER ----------------- //
export let toReadMeList = async (book) => {
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
  
