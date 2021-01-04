const mongoose = require('mongoose');
const ApplicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    status : {
        type: String,
        default : 'applied',
    }
})

module.exports = mongoose.model("application", ApplicationSchema);
