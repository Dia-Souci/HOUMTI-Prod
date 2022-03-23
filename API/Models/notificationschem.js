const Mongoose = require("mongoose");

const notificationSchema = new Mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    elements: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("notification", notificationSchema);
