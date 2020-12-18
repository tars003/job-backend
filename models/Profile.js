const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  occupations: [
    {
      occupation: {
        // type: Schema.Types.ObjectId,
        type: String,
      },
    },
  ]

});

module.exports = mongoose.model("Profile", ProfileSchema);
