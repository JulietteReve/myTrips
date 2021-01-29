const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  journeys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "journeys",
    },
  ],
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
