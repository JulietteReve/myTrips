var express = require("express");
var router = express.Router();
var journeyModel = require("../models/journey");
var userModel = require("../models/user");
var { capitalizing } = require("../helper");

// GET - Sign-In/Sign-Up Page.
router.get("/", function (req, res, next) {
  const errMsg = {
    signUp: "",
    signIn: "",
  };
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("sign", { title: "Ticketac", errMsg });
  }
});

// POST - Sign-Up
router.post("/signup", async function (req, res, next) {
  try {
    var searchUser = await userModel.findOne({
      email: req.body.email,
    });

    if (!searchUser) {
      var newUser = new userModel({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
      });

      var newUserSave = await newUser.save();

      req.session.user = {
        lastname: newUser.lastname,
        firstname: newUser.firstname,
        email: newUser.email,
        password: newUser.password,
        id: newUser._id,
      };
      req.session.temporaryCards = [];
      req.session.totalPrice = 0;
      res.render("home", { user: req.session.user });
    } else {
      const errMsg = {
        signUp: "Email déjà utilisé",
        signIn: "",
      };
      res.render("sign", { title: "Ticketac", errMsg });
    }
  } catch (err) {
    res.send(err.messages);
  }
});

// POST Sign-In
router.post("/signin", async function (req, res, next) {
  try {
    var searchUser = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (searchUser != null) {
      req.session.user = {
        lastname: searchUser.lastname,
        firstname: searchUser.firstname,
        email: searchUser.email,
        password: searchUser.password,
        id: searchUser._id,
      };

      req.session.temporaryCards = [];
      req.session.totalPrice = 0;

      res.render("home", { user: req.session.user });
    } else {
      const errMsg = {
        signUp: "",
        signIn: "Erreur authentification",
      };
      res.render("sign", { title: "Ticketac", errMsg });
    }
  } catch (err) {
    res.send(err.messages);
  }
});

// GET - Log Out
router.get("/logout", (req, res, next) => {
  req.session.user = null;
  res.redirect("/");
});

// GET Home Page - After Sign-In/Sign-Up Phase
router.get("/home", function (req, res, next) {
  if (req.session.user) {
    res.render("home", { title: "Ticketac", user: req.session.user });
  } else {
    res.redirect("/");
  }
});

// POST to Search Journeys in Homepage
router.post("/search-journey", async (req, res, next) => {
  try {
    let { departure, arrival, date } = req.body;
    //Tous les champs remplis
    if (departure && arrival && date) {
      departure = capitalizing(departure.toLowerCase());
      arrival = capitalizing(arrival.toLowerCase());
      const journeys = await journeyModel.find({
        departure,
        arrival,
        date,
      });
      if (journeys.length) {
        res.render("shop", {
          title: "Ticketac",
          journeys,
          user: req.session.user,
        });
      } else {
        res.redirect("/error");
      }
    } else if (departure && arrival && !date) {
      //Uniquement les champs de départ et destination (flexibilité date)
      departure = capitalizing(departure.toLowerCase());
      arrival = capitalizing(arrival.toLowerCase());
      const journeys = await journeyModel
        .find({
          departure,
          arrival,
        })
        .sort({ date: 1 });
      if (journeys.length) {
        res.render("shop", {
          title: "Ticketac",
          journeys,
          user: req.session.user,
        });
      } else {
        res.redirect("/error");
      }
    } else {
      res.redirect("/home");
    }
  } catch (err) {
    res.send(err.messages);
  }
});

// GET - Error page when no train available on a specific date
router.get("/error", (req, res, next) => {
  res.render("errormsg", { title: "Ticketac" });
});

// GET - Cart Page
router.get("/cart", function (req, res, next) {
  if (req.session.user) {
    res.render("cart", {
      user: req.session.user,
      temporaryCards: req.session.temporaryCards,
      totalPrice: req.session.totalPrice,
    });
  } else {
    res.redirect("/");
  }
});

// GET - Add Ticket To Cart
router.get("/add-cart", async function (req, res, next) {
  var cart = await journeyModel.findById(req.query._id);
  alreadyExist = false;

  for (i = 0; i < req.session.temporaryCards.length; i++) {
    if (req.query._id === req.session.temporaryCards[i]._id) {
      alreadyExist = true;
    }
  }

  if (alreadyExist === false) {
    req.session.temporaryCards.push(cart);
    req.session.totalPrice += cart.price;
  }

  res.render("cart", {
    temporaryCards: req.session.temporaryCards,
    totalPrice: req.session.totalPrice,
    user: req.session.user,
  });
});

// GET - Return To The Shop
router.get("/backtoshop", async function (req, res, next) {
  try {
    let { departure, arrival, date } = req.body;
    if (departure && arrival && date) {
      departure = capitalizing(departure.toLowerCase());
      arrival = capitalizing(arrival.toLowerCase());
      const journeys = await journeyModel.find({
        departure,
        arrival,
        date,
      });
      if (journeys.length) {
        res.render("shop", {
          title: "Ticketac",
          journeys,
          user: req.session.user,
        });
      } else {
        res.redirect("/error");
      }
    } else if (departure && arrival && !date) {
      departure = capitalizing(departure.toLowerCase());
      arrival = capitalizing(arrival.toLowerCase());
      const journeys = await journeyModel.find({
        departure,
        arrival,
      });
      if (journeys.length) {
        res.render("shop", {
          title: "Ticketac",
          journeys,
          user: req.session.user,
        });
      } else {
        //pourra être supprimé après ajout de l'auto-complétion
        res.redirect("/error");
      }
    } else {
      res.redirect("/home");
    }
  } catch (err) {
    res.send(err.messages);
  }
});

// GET - Confirm Ticket "Purchase" - Add to user's db
router.get("/confirm-cart", async function (req, res, next) {
  try {
    if (req.session.user) {
      var user = await userModel.findById(req.session.user.id);
      for (let i = 0; i < req.session.temporaryCards.length; i++) {
        user.journeys.push(req.session.temporaryCards[i]._id);
        await user.save();
      }
      req.session.temporaryCards = [];
      req.session.totalPrice = 0;
      res.redirect("/my-trips");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.send(err.messages);
  }
});

router.get("/my-trips", async function (req, res, next) {
  try {
    if (req.session.user) {
      var userJourneys = await userModel
        .findById(req.session.user.id)
        .populate("journeys")
        .exec();

      res.render("reservations", {
        userJourneys,
        user: req.session.user,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/delete-cart", function (req, res, next) {
  if (req.session.user) {
    req.session.temporaryCards.splice(req.query._id, 1);
    req.session.totalPrice = 0;
    for (i = 0; i < req.session.temporaryCards.length; i++) {
      req.session.totalPrice += req.session.temporaryCards[i].price;
    }

    res.redirect("cart");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
