import { populateList } from "./render.js";


//---------------- SORT FUNCTIONS --------------------------
export function sortByTitle(books, sortOrder) {
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
  
export function sortByAuthor(books, sortOrder) {
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
  
export function sortByRating(books, sortOrder) {
    books.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.book.averageRating - b.book.averageRating;
      } else {
        return b.book.averageRating - a.book.averageRating;
      }
    });
    populateList(books);
  };