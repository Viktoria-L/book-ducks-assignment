// -------------- THREE TOP RATED BOOKS -------------- //
export async function displayHighestRatedBooks() {
  let books = null;
  let topThreeBooks = [];

  await axios
    .get("http://localhost:1337/api/books?populate=deep")
    .then((response) => {
      books = response.data.data;
    })
    .catch((error) => console.log(error.message));

  books.forEach((book) => {
    let { averageRating } = book.attributes;

    if (
      topThreeBooks.length < 3 ||
      averageRating >= topThreeBooks[2].attributes.averageRating
    ) {
      let indexToAdd = -1;
      for (let i = 0; i < topThreeBooks.length; i++) {
        if (averageRating > topThreeBooks[i].attributes.averageRating) {
          indexToAdd = i;
          break;
        }
      }
      if (indexToAdd >= 0) {
        topThreeBooks.splice(indexToAdd, 0, book);
      } else {
        topThreeBooks.push(book);
      }

      if (topThreeBooks.length > 3) {
        topThreeBooks.pop();
      }
    }
  });

  let bookOne = document.querySelector("#popularOne");
  let bookTwo = document.querySelector("#popularTwo");
  let bookThree = document.querySelector("#popularThree");
  bookOne.innerHTML = `<img src="http://localhost:1337${topThreeBooks[0].attributes.imageUrl.data.attributes.formats.thumbnail.url}" width="90px" height="125px">`;
  bookTwo.innerHTML = `<img src="http://localhost:1337${topThreeBooks[1].attributes.imageUrl.data.attributes.formats.thumbnail.url}" width="90px" height="125px">`;
  bookThree.innerHTML = `<img src="http://localhost:1337${topThreeBooks[2].attributes.imageUrl.data.attributes.formats.thumbnail.url}" width="90px" height="125px">`;

  // .append(topThreeBooks[0].

  //     attributes.imageUrl.data.attributes.url)

  // Print out the top three highest rated books
  console.log("De tre böckerna med högst rating:");
  topThreeBooks.forEach((book, index) => {
    console.log(
      `${index + 1}. ${book.attributes.title} (${
        book.attributes.averageRating
      } stars)`
    );
  });
}

// -------------- POPUP MESSAGE MODAL -------------- //
export function messageModal(text) {
  let modal = document.createElement("div");
  let main = document.querySelector("main");
  modal.innerText = text;
  modal.className = "message-modal";
  main.prepend(modal);
  setTimeout(() => {
    main.removeChild(modal);
  }, 3000);
}
