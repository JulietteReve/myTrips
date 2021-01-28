var express = require("express");
var session = require("express-session");
var router = express.Router();
var journeyModel = require("../models/journey");
var userModel = require("../models/user");

var city = [
  "Paris",
  "Marseille",
  "Nantes",
  "Lyon",
  "Rennes",
  "Melun",
  "Bordeaux",
  "Lille",
];
var date = [
  "2018-11-20",
  "2018-11-21",
  "2018-11-22",
  "2018-11-23",
  "2018-11-24",
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Ticketac" });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("sign", { title: "Express" });
});

/*POST to search journeys from Homepage */
router.post("/search-journey", async (req, res, next) => {
  try {
    const { departure, arrival, date } = req.body;

    // Filtre de recherche à paramétrer : si aucun champ rempli alors msg erreur ..

    const journeys = await journeyModel.find({
      departure,
      arrival,
      date,
    });
    if (journeys.length) {
      res.render("shop", { journeys });
    } else {
      console.log("no train available");
      res.redirect("/error");
    }
  } catch (err) {
    res.send(err.messages);
  }
});

router.get("/error", (req, res, next) => {
  res.render("error", { title: "Ticketac" });
});

// Remplissage de la base de donnée, une fois suffit
router.get("/save", async function (req, res, next) {
  // How many journeys we want
  var count = 300;

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {
    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

    if (departureCity != arrivalCity) {
      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();
    }
  }
  res.render("index", { title: "Ticketac" });
});

module.exports = router;
