const express = require("express");
const routes = express.Router();

const CalendarController = require("./controllers/CalendarController");

routes.get("/calendar", CalendarController.show);

module.exports = routes;
