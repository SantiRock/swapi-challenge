import { modalHandler } from "./modal.js";
import { query } from "./services.js";
const categories = document.getElementById("categories");
const list = document.getElementById("list");
const note = document.getElementById("list__notification");
const totalList = document.getElementById("list__total");
const loadingList = document.getElementById("list__loading");

// Services ----

const baseUrl = "https://swapi.dev/api/";

const fetchList = async (categories) => {
  loadingList.innerHTML = "Loading, hyperspace jump ...";

  try {
    const response = await fetch(`${baseUrl}${categories}/`);
    const list = await response.json();

    // TimeOut ---
    let randomNum = Math.ceil(Math.random() * 10);

    if (randomNum === 1) {
      setTimeout(() => {
        console.log("Lists timeout");
        markupList(list);
        const totalPages = Math.ceil(list.count / 10);
        for (let i = 2; i <= totalPages; i++) {
          fetchAll(categories, i);
        }
      }, 1000);
    } else {
      markupList(list);
      const totalPages = Math.ceil(list.count / 10);
      for (let i = 2; i <= totalPages; i++) {
        fetchAll(categories, i);
      }
    }
    // ------
  } catch (error) {
    console.log(error);
    note.innerHTML = `Fetch rejected. Try again later.`;
  }
};

const fetchAll = async (categorie, i) => {
  loadingList.innerHTML = "wait  ...";
  try {
    const response = await fetch(`${baseUrl}${categorie}/?page=${i}`);
    const all = await response.json();

    markupList(all);
  } catch (error) {
    console.log(error);
    note.innerHTML = `Fetch rejected. Try again later. Give yourself to the dark side.`;
  } finally {
    loadingList.innerHTML = "";
  }
};

//Markup ----

const markupList = (arr) => {
  totalList.innerHTML = `
      Total ${categories.value} : ${arr.count}
    `;

  arr.results.map((item) => {
    const liItem = document.createElement("li");
    liItem.classList.add("liItem");

    liItem.addEventListener("click", (evt) => {
      evt.preventDefault();
      modalHandler(item.url);
    });

    liItem.innerHTML = `
          ${item.name} 
        `;

    list.appendChild(liItem);
  });
};

const markupListFilms = (arr) => {
  totalList.innerHTML = `
      Total ${categories.value} : ${arr.count}
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

    list.appendChild(filmItem);
  });
};

// Listeners ----

categories.addEventListener("change", () => {
  list.innerHTML = "";
  totalList.innerHTML = "";
  note.innerHTML = "";
  categories.value === "films"
    ? query("", categories.value, markupListFilms, loadingList)
    : fetchList(categories.value);
});

// Initial State -----

const initialState = () => {
  query("", "films", markupListFilms, loadingList, note);
};

initialState();
