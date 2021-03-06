const express = require("express");

require("dotenv").config();

const connectDB = require("./db");

const app = express();
connectDB();

app.use(express.json());

app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));
app.use('/job', require('./routes/job'));
app.use('/application', require('./routes/application'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runnning on ${PORT}`);
});
