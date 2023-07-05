const modal = document.getElementById("modal");
const modalLoad = document.getElementById("modal__load");
const modalNote = document.getElementById("modal__note");
const modalList = document.getElementById("modal__list");
const modalClose = document.getElementById("modal__close");

// Services -----

const fetchItem = async (url) => {
  modalLoad.innerHTML = "wait, hyperspace jump ...";
  modalNote.innerHTML = "";
  try {
    const response = await fetch(url);
    const item = await response.json();
    console.log(item);
    markupModal(item);
  } catch (error) {
    console.log(error);
    modalNote.innerHTML = `Fetch Rejected. Try again later. May the force be with you`;
  } finally {
    modalLoad.innerHTML = "";
  }
};

const fetchSubItem = async (url) => {
  try {
    const response = await fetch(url);
    const item = await response.json();
    return item;
  } catch (error) {
    console.log(error);
  }
};

// Markup ------

const markupModal = (item) => {
  const entries = Object.entries(item);

  for (let entrie of entries) {
    // Verificar que sea String Number o boolean
    if (
      typeof entrie[1] === "string" ||
      typeof entrie[1] === "number" ||
      entrie[3] === "boolean"
    ) {
      var regex = /^http/;

      if (regex.test(entrie[1])) {
        // Verificar si es una url
        fetchSubItem(entrie[1]).then((item) => {
          const subLi = document.createElement("li");

          if (item.name) {
            subLi.innerHTML = `
            ${entrie[0]}: <span class="s">${item.name}</span>
          `;
          } else {
            subLi.innerHTML = `
            ${entrie[0]}: <span class="s">${item.title}</span>
          `;
          }

          modalList.appendChild(subLi);

          subLi.addEventListener("click", (evt) => {
            evt.preventDefault();
            modalHandler(item.url);
          });
        });
      } else if (entrie[0] === "created" || entrie[0] === "edited") {
        const modalLi = document.createElement("li");
        const date = new Date(entrie[1]);

        modalLi.innerHTML = `
        ${entrie[0]}: ${date.toLocaleString()}
        `;

        modalList.appendChild(modalLi);
      } else {
        // Otros Strings, Numbers o booleanos

        const modalLi = document.createElement("li");

        modalLi.innerHTML = `
        ${entrie[0]}: ${entrie[1]}
        `;

        modalList.appendChild(modalLi);
      }
    } else if (entrie[1] === null) {
      continue;
    } else if (typeof entrie[1] === "object") {
      // Object

      const modalLi = document.createElement("li");
      const modalul = document.createElement("ul");
      modalLi.innerHTML = `
      ${entrie[0]}:
      `;

      modalList.appendChild(modalLi);
      modalLi.appendChild(modalul);

      for (let item of entrie[1]) {
        fetchSubItem(item).then((item) => {
          const subLi = document.createElement("li");
          subLi.style.marginTop = "5px";
          subLi.style.color = "#bfcdf5";
          subLi.style.cursor = "pointer";

          if (item.name) {
            subLi.innerHTML = `
            ${item.name}
          `;
          } else {
            subLi.innerHTML = `
            ${item.title}
          `;
          }

          modalul.appendChild(subLi);

          subLi.addEventListener("click", (evt) => {
            evt.preventDefault();
            modalHandler(item.url);
          });
        });
      }
    } else {
      //function, undifined
      console.log("Modal entrie - wrong type");
    }
  }
};

// Handlers ----

export const modalHandler = (url) => {
  modal.style.display = "inline";
  modalList.innerHTML = "";
  window.scroll(0, 0);
  fetchItem(url);
};

modal.addEventListener("click", (evt) => {
  if (evt.currentTarget === evt.target) {
    modal.style.display = "none";
  }
});

window.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    modal.style.display = "none";
  }
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});
