var express = require("express");
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


var totalPrice = 0;

/* GET inscription page. */
router.get("/", function (req, res, next) {
  res.render("sign", { title: "Ticketac" });
});

router.get("/cart", function (req, res, next) {
  res.render("cart", {user: req.session.user, temporaryCards: req.session.temporaryCards, totalPrice });
});


/* POST signup page. */
router.post("/signup", async function (req, res, next) {
  try {
    var searchUser = await userModel.findOne({
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

  req.session.user = {
    lastname: newUser.lastname,
    firstname: newUser.firstname,
    email: newUser.email,
    password: newUser.password,
    id : newUser._id
  };
  req.session.temporaryCards = [];
  // console.log(req.session.user)

  // console.log ('test', newUserSave)

  res.render("home", {user : req.session.user})

} else {
  res.redirect('/')
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

    req.session.user = {
      lastname: searchUser.lastname,
      firstname: searchUser.firstname,
      email: searchUser.email,
      password: searchUser.password,
      id : searchUser._id
    };

    req.session.temporaryCards = [];
    
  res.render('home', {user : req.session.user})

} else {

  res.redirect("sign")
}}
catch(err){res.send(err.messages)}

});

/*GET Log out */
router.get("/logout", (req, res, next) => {
  req.session.user = null;
  res.redirect("/");
});

/* GET home page. */
router.get("/home", function (req, res, next) {
  if (req.session.user) {
    res.render("home", { title: "Ticketac", user: req.session.user });
  } else {
    res.redirect("/");
  }
});

/*POST to search journeys from Homepage */
router.post("/search-journey", async (req, res, next) => {
  try {
    let { departure, arrival, date } = req.body;
    // Filtre de recherche à affiner
    if (departure && arrival && date) {
      departure = capitalizing(departure.toLowerCase());
      arrival = capitalizing(arrival.toLowerCase());
      const journeys = await journeyModel.find({
        departure,
        arrival,
        date,
      });
      if (journeys.length) {
        //console.log(`Recherche: ${departure}-${arrival} on ${date}`);
        res.render("shop", { title: "Ticketac", journeys });
      } else {
        // console.log(
        //   `no train available for ${departure}-${arrival} on ${date}`
        // );
        res.redirect("/error");
      }
    } else {
      res.redirect("/home");
    }
  } catch (err) {
    res.send(err.messages);
  }
});

router.get("/add-cart", async function (req, res, next) {
  var cart = await journeyModel.findById(req.query._id);
  req.session.temporaryCards.push(cart);
  

  for (i = 0; i < req.session.temporaryCards.length; i++) {
    totalPrice += req.session.temporaryCards[i].price;
  }

  res.render("cart", { temporaryCards: req.session.temporaryCards, totalPrice });
});

router.get("/confirm-cart", async function (req, res, next) {
  
  
  
  

  res.render("reservations", { temporaryCards: req.session.temporaryCards, totalPrice });
});


router.get("/error", (req, res, next) => {
  res.render("errormsg", { title: "Ticketac" });
});

//GET Routes - Affiche les Users et les Voyages de la base de données
router.get("/users", async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (err) {
    res.send(err.messages);
  }
});

router.get("/journeys", async (req, res, next) => {
  try {
    const journeys = await journeyModel.find();
    res.send(journeys);
  } catch (err) {
    res.send(err.messages);
  }
});

module.exports = router;
