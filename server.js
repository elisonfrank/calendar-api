const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// initializing db
mongoose.connect(
  "mongodb://localhost:27017/calendarapi",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err)
      console.log("Unable to connect to the database. Please start the server");
  }
);

requireDir("./src/models");

app.use("/api", require("./src/routes"));

require("events").EventEmitter.prototype._maxListeners = 100;

app.listen(3001);
