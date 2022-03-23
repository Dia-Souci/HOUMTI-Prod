const Mongoose = require("mongoose");

const userSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      min: 8,
      max: 20,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 75,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },

    ville: {
      type: String,
      required: true,
    },
    quartier: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
