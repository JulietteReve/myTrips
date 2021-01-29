var express = require("express");
var router = express.Router();
const journeyModel = require("../models/journey");

/* GET tickets listing. */
router.get("/", async (req, res, next) => {
  try {
    const journeys = await journeyModel.find();
    res.send(journeys);
  } catch (err) {
    res.send(err.messages);
  }
});

router.get("/get-departures", async (req, res, next) => {
  try {
    const departures = journeyModel.aggregate();
    departures.group({ _id: "$departure" });
    departures.sort({ _id: 1 });
    const result = await departures.exec();
    cities = [];
    result.forEach((city) => cities.push(city._id));
    res.json(cities);
  } catch (err) {
    res.json(err);
  }
});
router.get("/get-arrivals", async (req, res, next) => {
  try {
    const arrivals = journeyModel.aggregate();
    arrivals.group({ _id: "$arrival" });
    arrivals.sort({ _id: 1 });
    const result = await arrivals.exec();
    cities = [];
    result.forEach((city) => cities.push(city._id));
    res.json(cities);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
