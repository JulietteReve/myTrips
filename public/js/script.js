const departure = $("#departure");
const matchD = $("#match-departure");
const arrival = $("#arrival");
const matchA = $("#match-arrival");

const searchCities = async (searchText) => {
  const res = await fetch("http://localhost:3000/tickets/get-departures");
  const cities = await res.json();
  let matches = cities.filter((city) => {
    const regex = new RegExp(`^${searchText}`, "gi");
    return city.match(regex);
  });
  console.log(searchText);
  console.log(matches);
};

departure.on("input", (e) => searchCities(e.target.value));
