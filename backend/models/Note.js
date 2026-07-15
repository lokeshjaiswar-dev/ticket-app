const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  note_text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);