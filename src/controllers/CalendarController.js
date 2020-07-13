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

    console.log("month: " + month + " year: " + year);

    month = Number(month);
    year = Number(year);

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
            noteid: "",
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

      // finding db notes
      let noteDescription = "";
      let noteId = "";

      mongoose.connection.on("connected", async () => {
        await Note.findOne({ date }, (err, note) => {
          if (err) {
            console.log(
              `Problem when trying to find note with date '${date.toLocaleDateString()}. ${err}`
            );
          } else if (note) {
            noteDescription = note.description;
            noteId = note._id;
          }
        });
      });

      const dateObj = {
        date,
        info: {
          dayOfWeek: date.getDay(),
          fullDayOfWeek: week[date.getDay()],
          holiday: hd.isHoliday(date),
          noteid: noteId,
          note: noteDescription,
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
            noteid: "",
            note: "",
            enabled: false,
          },
        };

        calendar.push(dateObj);
      }
    }

    await res.json(calendar);
  },

  async store(req, res) {
    console.log("Requisition body", req.body);
    await Note.create(req.body)
      .catch((error) => {
        console.log("Store:", error);
        res.json({ error: error.errors.description.properties.message });
      })
      .then((note) => res.json(note));
  },

  async update(req, res) {
    console.log("Requisition params", req.params);
    console.log("Requisition body", req.body);

    await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .catch((error) => {
        console.log("Update:", error);
        res.json({ error: error.errors.description.properties.message });
      })
      .then((note) => res.json(note));
  },
};
