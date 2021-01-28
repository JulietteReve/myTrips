var express = require("express");
var session = require("express-session");
var router = express.Router();
var journeyModel = require("../models/journey");
var userModel = require("../models/user");
var { capitalizing } = require("../helper");

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


/* GET signin signup page. */
router.get("/signup", function (req, res, next) {
  res.render("sign");
});

/* POST signup page. */
router.post("/signup", async function (req, res, next) {
  
  try {var searchUser = await userModel.findOne({
    email: req.body.email
  })
  
  if(!searchUser){
  var newUser = new userModel({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  })

  var newUserSave = await newUser.save();

  console.log ('test', newUserSave)

  res.redirect('/')

} else {
  res.redirect('/sign')
}}
catch(err){res.send(err.messages)}

});

/* POST signin page. */
router.post("/signin", async function (req, res, next) {
  
  try {var searchUser = await userModel.findOne({
    email: req.body.email, 
    password: req.body.password
  })
  
  if(searchUser!=null){
    
  res.redirect('/')

} else {
  res.render("sign")
}}
catch(err){res.send(err.messages)}

});

/*POST to search journeys from Homepage */
router.post("/search-journey", async (req, res, next) => {
  try {
    let { departure, arrival, date } = req.body;
    departure = capitalizing(departure.toLowerCase());
    arrival = capitalizing(arrival.toLowerCase());
    // Filtre de recherche à paramétrer : si aucun champ rempli alors msg erreur ..

    const journeys = await journeyModel.find({
      departure,
      arrival,
      date,
    });
    if (journeys.length) {
      console.log(`Recherche: ${departure}-${arrival} on ${date}`);
      res.render("shop", { title: "Ticketac", journeys });
    } else {
      console.log(`no train available for ${departure}-${arrival} on ${date}`);
      res.redirect("/error");
    }
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
router.get("/error", (req, res, next) => {
  res.render("errormsg", { title: "Ticketac" });
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
