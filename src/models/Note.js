const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

mongoose.model("Note", NoteSchema);
