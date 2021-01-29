const departure = $("#departure");
const matchD = $("#match-departure");
const arrival = $("#arrival");
const matchA = $("#match-arrival");

//Remove autocompletion on input
departure.attr("autocomplete", "off");
arrival.attr("autocomplete", "off");

//Function to search and filter your research and match with db
const searchCities = async (searchText, matchInp) => {
  const res = await fetch("http://localhost:3000/tickets/get-departures");
  const cities = await res.json();
  let matches = cities.filter((city) => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return city.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
    matchInp.html("");
  }
  passMatchToHtml(matches, matchInp);
};

//Function to pass content to HTML
const passMatchToHtml = (matches, matchInp) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) =>
          `<div class="list-group-item"><p class="p-0 m-0">${match}</p></div>`
      )
      .join("");
    matchInp.html(html);
  }
};

const passCityToHtml = (city, searchInp, element) => {
  if (city.length > 0) {
    searchInp.val(`${city}`);
    element.html("");
  }
};

//EventListeners to implement autocompletion
departure.on("input", (e) => searchCities(e.target.value, matchD));
arrival.on("input", (e) => searchCities(e.target.value, matchA));
matchD.each(function () {
  $(this).on("click", function () {
    const city = $(this).children().children().text();
    passCityToHtml(city, departure, $(this));
  });
});
matchA.each(function () {
  $(this).on("click", function () {
    const city = $(this).children().children().text();
    passCityToHtml(city, arrival, $(this));
  });
});
