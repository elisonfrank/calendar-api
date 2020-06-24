const express = require("express");
const routes = express.Router();

const CalendarController = require("./controllers/CalendarController");

routes.get("/calendar", CalendarController.show);
routes.post("/calendar", CalendarController.store);
routes.put("/calendar/:id", CalendarController.update);

module.exports = routes;
