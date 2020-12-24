const mongoose = require('mongoose');
const AdminSchema = mongoose.Schema({
    name : String,
    email: String,
    company: String,
    password: String
});

module.exports = mongoose.model("admin", AdminSchema);
