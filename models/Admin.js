const mongoose = require('mongoose');
const AdminSchema = mongoose.Schema({
    name : String,
    email: String,
    company: String,
    password: String,
    phone: String,
});

module.exports = mongoose.model("admin", AdminSchema);
