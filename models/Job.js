const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
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
    salary: {
        type: String,
        required: true,
    },
    payBasis: {
        type: String,
        required: true,
    },
    professionType: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    applications: [
      {
          application: {
              type: mongoose.Schema.Types.ObjectId,
          }
      }
    ],
    openings: {
        type: String,
        required: true,
    },
    minQualification: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: false,
    },
    jobDescription: {
        type: String,
        required: false,
    },
    minExperience: {
        type: String,
        required: false,
    },
    timing: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    active: {
        type: String,
        required: false,
    },
})

module.exports = mongoose.model("Job", JobSchema);
