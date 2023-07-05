const baseUrl = "https://swapi.dev/api/";

// General, Multiporpouse, prototype -------

export const query = async (
  keyword,
  categories,
  markup,
  loadingType,
  errorNote
) => {
  loadingType.innerHTML = "Loading ...";

  try {
    const response = await fetch(`${baseUrl}${categories}/?search=${keyword}`);
    const data = await response.json();

    markup(data);
  } catch (error) {
    console.log(error);
    errorNote.innerHTML = `Fetch rejected. Try again later.`;
  } finally {
    loadingType.innerHTML = "";
  }
};
