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

module.exports = router;
