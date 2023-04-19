import { getBooks } from "./api.js";
import { messageModal } from "./extra.js";

// ----------------- GET USERREVIEWS OR PRINT RATINGINPUTS ----------------- //
export async function ratingSection(element, bookId) {
  let alreadyReviewed = false;
  let myRating = null;
  let ratingDiv = document.createElement("div");
  ratingDiv.className = "ratingDiv";

  //Get users reviewed books
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

    //check if user already reviewed the book
    userReviews.forEach((review) => {
      if (review.book.id === bookId) {
        alreadyReviewed = true;
        myRating = review.rating;
      }
    });
    //If users has not reviewed it, print out ratingscale
    if (!alreadyReviewed) {
      ratingDiv.innerHTML = `<h4>Betygsätt boken här:</h4>
      <div class="ratings">           
      <input type="radio" name="rating" value="10"id="rating10${bookId}"><label for="rating10${bookId}">10</label>
      <input type="radio" name="rating" value="9" id="rating9${bookId}"/><label for="rating9${bookId}">9</label>
      <input type="radio" name="rating" value="8" id="rating8${bookId}"/><label for="rating8${bookId}">8</label>
      <input type="radio" name="rating" value="7" id="rating7${bookId}"/><label for="rating7${bookId}">7</label>
      <input type="radio" name="rating" value="6" id="rating6${bookId}"/><label for="rating6${bookId}">6</label>
      <input type="radio" name="rating" value="5" id="rating5${bookId}"/><label for="rating5${bookId}">5</label>
      <input type="radio" name="rating" value="4" id="rating4${bookId}"/><label for="rating4${bookId}">4</label>
      <input type="radio" name="rating" value="3" id="rating3${bookId}"/><label for="rating3${bookId}">3</label>
      <input type="radio" name="rating" value="2" id="rating2${bookId}"/><label for="rating2${bookId}">2</label>
      <input type="radio" name="rating" value="1" id="rating1${bookId}"/><label for="rating1${bookId}">1</label>
       </div>
          <button type="button" id="ratingBtn${bookId}">Betygsätt!</button>`;

      element.append(ratingDiv);
      let ratingBtn = document.getElementById(`ratingBtn${bookId}`);
      //Eventlistener that gets value from ratingscale
      ratingBtn.addEventListener("click", () => {
        let rating = document.querySelector(`input[name="rating"]:checked`);
        console.log(rating.value);
        postRating(rating.value, bookId);
      });
    } else {
      ratingDiv.innerHTML = `
          <p>Du har redan betygsatt denna bok, du gav den ${myRating} i betyg</p>
          `;
      element.append(ratingDiv);
    }
  }
}

// ----------------- POST USER RATING TO STRAPI ----------------- //
//Send the rating for corresponding book to user reviewed_books via userId
export let postRating = async (rating, bookId) => {
  await axios.post(
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
  calculateAverageRating(bookId);
};

// ----------------- CALCULATE AVERAGE RATING AND POST IT TO STRAPI ----------------- //
//Calculate averageRating for specific book via the bookId
export let calculateAverageRating = async (bookId) => {
  let average = 0;
  let ratingCount = 0;
  let averageRating = 0;
  await axios
    .get(`http://localhost:1337/api/books/${bookId}?populate=deep`)
    .then((response) => {
      //Get all ratings and add them together and add one to ratingCount
      let allBookReviews = response.data.data.attributes.reviews.data;
      allBookReviews.forEach((review) => {
        console.log(review.attributes.rating);
        average += review.attributes.rating;
        ratingCount++;
      });
      //divide sum of ratingpoints with number of ratings
      averageRating = average / ratingCount;
    })
    .catch((error) => {
      messageModal(error.message);
    });

  await axios.put(
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
  getBooks();
};
