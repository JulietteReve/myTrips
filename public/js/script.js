const departure = $("#departure");
const matchD = $("#match-departure");
const arrival = $("#arrival");
const matchA = $("#match-arrival");

//Remove autocompletion on input
departure.attr("autocomplete", "off");
arrival.attr("autocomplete", "off");

//Function to search and filter your research and match with db
const searchCities = async (searchText, matchContainer, searchInput) => {
  const res = await fetch("https://secure-river-94662.herokuapp.com/tickets/get-departures");
  const cities = await res.json();
  let matches = cities.filter((city) => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return city.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    matchContainer.html("");
  }
  passMatchToHtml(matches, matchContainer, searchInput);
};

//Function to pass content from search input to HTML (match list)
const passMatchToHtml = (matches, matchContainer, searchInput) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) =>
          `<div class="list-group-item"><p class="p-0 m-0">${match}</p></div>`
      )
      .join("");
    matchContainer.html(html);
    matchContainer.children().each(function () {
      $(this).on("click", function () {
        const city = $(this).children().text();
        passCityToHtml(city, searchInput, $(this));
      });
    });
  }
};

//Function to pass content from selected City to HTML (search input)
const passCityToHtml = (city, searchInput, element) => {
  if (city.length > 0) {
    searchInput.val(`${city}`);
    element.parent().html("");
  }
};

//EventListeners to implement autocompletion
departure.on("input", (e) => searchCities(e.target.value, matchD, departure));
arrival.on("input", (e) => searchCities(e.target.value, matchA, arrival));
