const Mongoose = require("mongoose");

const postSchema = new Mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      required: true,
      max: 280,
    },
    options: {
      type: Array,
      default: [],
    },
    adresse: {
      type: String,
      default: "",
    },
    voters: {
      type: Array,
      default: [],
    },
    date: {
      type: Date,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    interested: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    postville: {
      type: String,
      required: true,
    },
    postquartier: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
    participant: {
      type: Array,
      default: [],
    },
    contact: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      required: [
        true,
        "we do need the type to create your post ! So what is it ? | hint : event",
      ],
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Post", postSchema);
