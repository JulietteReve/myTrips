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
  res.render("index", { title: "Express" });
});

/* shop page */
router.get("/shop", function (req, res, next) {
  res.render("shop", { });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("sign", { title: "Express" });
});

/*POST to search journeys from Homepage */
router.post("/search-journey", async (req, res, next) => {
  try {
    const { from, to, date } = req.body;
    res.render("shop");
  } catch (err) {
    res.send(err.messages);
  }
});

router.get('/cart', async function (req, res, next){
  var cart = await journeyModel.findById(req.query._id);
  // console.log(cart);

  var temporaryCards = [];
  temporaryCards.push(cart)
  console.log(temporaryCards)

  res.render('cart', { temporaryCards })
})

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
  res.render("index", { title: "Express" });
});

module.exports = router;
