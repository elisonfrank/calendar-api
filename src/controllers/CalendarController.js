const holidays = require("date-holidays");
const mongoose = require("mongoose");
const Note = mongoose.model("Note");

const week = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

module.exports = {
  async show(req, res) {
    let { month, year } = req.query;

    if (!month && !year) {
      const date = new Date(Date.now());
      month = date.getMonth();
      year = date.getFullYear();
    }

    month = Number(month);
    year = Number(year);

    console.log("month: " + month + " year: " + year);
    const calendar = [];

    const hd = new holidays();
    hd.init("BR");

    let date = new Date(year, month, 1);
    let diffDays = 6 - (6 - date.getDay());
    // days before first
    if (diffDays > 0) {
      diffDays--;
      const lastDayLastMonth = new Date(year, month, 0);
      const iniDay = new Date(lastDayLastMonth).getDate() - diffDays;
      for (let day = iniDay; day <= 31; day++) {
        date = new Date(year, month - 1, day);
        if (date > new Date(lastDayLastMonth)) break;

        const dateObj = {
          date,
          info: {
            dayOfWeek: date.getDay(),
            fullDayOfWeek: week[date.getDay()],
            holiday: hd.isHoliday(date),
            note: "",
            enabled: false,
          },
        };

        calendar.push(dateObj);
      }
    }

    // days of the month
    for (let day = 1; day <= 31; day++) {
      const lastDay = new Date(year, month + 1, 0);
      date = new Date(year, month, day);

      if (day > new Date(lastDay).getDate()) {
        break;
      }

      // falta pegar os notes o banco
      const note = await Note.find({ date });

      const dateObj = {
        date,
        info: {
          dayOfWeek: date.getDay(),
          fullDayOfWeek: week[date.getDay()],
          holiday: hd.isHoliday(date),
          note: note.length === 0 ? "" : note[0].description,
          enabled: true,
        },
      };

      calendar.push(dateObj);
    }

    //days after month
    diffDays = 7 + (7 - date.getDay());
    if (diffDays > 0) {
      for (let day = 1; day <= diffDays; day++) {
        date = new Date(year, month + 1, day);

        const dateObj = {
          date,
          info: {
            dayOfWeek: date.getDay(),
            fullDayOfWeek: week[date.getDay()],
            holiday: hd.isHoliday(date),
            note: "",
            enabled: false,
          },
        };

        calendar.push(dateObj);
      }
    }

    res.json(calendar);
  },

  async store(req, res) {
    console.log(req.body);
    const note = await Note.create(req.body);

    return res.json(note);
  },

  async update(req, res) {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(note);
  },
};
