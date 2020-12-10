const express = require("express");

require("dotenv").config();

const connectDB = require("./db");

const app = express();
connectDB();

app.use(express.json());

app.use('/profile', require('./routes/profile'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runnning on ${PORT}`);
});
