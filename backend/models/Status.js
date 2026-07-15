const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  label: { type: String, required: true },
  color: { type: String, required: true } // Stores Hex or Tailwind color representation
});

module.exports = mongoose.model('Status', StatusSchema);