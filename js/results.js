import { modalHandler } from "./modal.js";
import { query } from "./services.js";

const categories = document.getElementById("categories");
const input = document.getElementById("search-input");
const inputBtn = document.getElementById("search-button");
const loadingQuery = document.getElementById("results__loading");
const notification = document.getElementById("results__note");
const results = document.getElementById("results__list");
const totalResults = document.getElementById("results__total");
const next = document.getElementById("next");
const preview = document.getElementById("preview");

// Query -----

const baseUrl = "https://swapi.dev/api/";
let currentPage = 1;

const fetchResults = async () => {
  // Fetch Error ---
  let fetchError = "?s";
  let randomNum = Math.ceil(Math.random() * 20);
  if (randomNum === 3) {
    console.log("fetch error");
    fetchError = "ur43r4h894";
  }

  loadingQuery.innerHTML = "Loading, the force is strong with you ...";
  console.log(randomNum, fetchError);

  try {
    const response = await fetch(
      `${baseUrl}${categories.value}/${fetchError}earch=${input.value}&&page=${currentPage}`
    );
    const data = await response.json();

    markupResults(data);
  } catch (error) {
    console.log(error);
    notification.innerHTML = `Something went worng. Try again later. Fetch rejected.`;
    totalResults.innerHTML = "";
    next.style.visibility = "hidden";
    preview.style.display = "none";
  } finally {
    loadingQuery.innerHTML = "";
  }
};

// Markup ---

const markupResults = (arr) => {
  //console.log(arr);
  results.innerHTML = "";
  next.style.visibility = "hidden";
  preview.style.display = "none";
  totalResults.innerHTML = "";
  notification.innerHTML = "";
  const totalpages = Math.ceil(arr.count / 10);
  if (arr.count === 0) {
    notification.innerHTML = `Couldn't find ${categories.value} with that name`;
  } else if (arr.next !== null && arr.previous === null) {
    next.style.visibility = "visible";
    preview.style.display = "none";
    markupPagination(arr, totalpages);
  } else if (arr.next !== null && arr.previous !== null) {
    next.style.visibility = "visible";
    preview.style.display = "inline";
    markupPagination(arr, totalpages);
  } else if (arr.next === null && arr.previous !== null) {
    next.style.visibility = "hidden";
    preview.style.display = "inline";
    markupPagination(arr, totalpages);
  } else {
    markupPagination(arr, totalpages);
  }
};

const markupPagination = (arr, totalpages) => {
  totalResults.innerHTML = `
    Total results : ${arr.count} | Page : ${currentPage} / ${totalpages}
    `;
  arr.results.map((item) => {
    const liItem = document.createElement("li");
    liItem.addEventListener("click", (evt) => {
      evt.preventDefault();
      modalHandler(item.url);
    });
    liItem.innerHTML = `
      ${item.name}
    `;
    results.appendChild(liItem);
  });
};

const markupResultsFilms = (arr) => {
  if (arr.count === 0) {
    notification.innerHTML = `Couldn't find ${categories.value} whith that title`;
  } else {
    totalResults.innerHTML = `
      Total results : ${arr.count}
      `;

    arr.results.map((film) => {
      const filmItem = document.createElement("li");
      filmItem.addEventListener("click", (evt) => {
        evt.preventDefault();
        modalHandler(film.url);
      });
      filmItem.innerHTML = `
          ${film.title} 
        `;
      results.appendChild(filmItem);
    });
  }
};

// Listeners --------

inputBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  results.innerHTML = "";
  totalResults.innerHTML = "";
  next.style.visibility = "hidden";
  preview.style.display = "none";
  notification.innerHTML = "";
  currentPage = 1;
  categories.value === "films"
    ? query(
        input.value,
        categories.value,
        markupResultsFilms,
        loadingQuery,
        notification
      )
    : fetchResults();
});

next.addEventListener("click", (evt) => {
  evt.preventDefault();
  currentPage++;
  fetchResults();
});

preview.addEventListener("click", (evt) => {
  evt.preventDefault();
  currentPage--;
  fetchResults();
});
