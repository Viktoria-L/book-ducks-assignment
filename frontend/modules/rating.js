import { getBooks } from "./api.js";

// ----------------- GET USERREVIEWS OR PRINT RATINGINPUTS ----------------- //
export async function ratingSection(element, bookId) {
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

    //check if user already reviewed the book
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
    // ratingDiv.innerHTML = `<h4>Logga in för att betygsätta boken!</h4>
    // `;
    // element.append(ratingDiv);
  }
}

// ----------------- POST USER RATING TO STRAPI ----------------- //
export let postRating = async (rating, bookId) => {
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

// ----------------- CALCULATE AVERAGE RATING AND POST IT TO STRAPI ----------------- //
export let calculateAverageRating = async (bookId) => {
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
