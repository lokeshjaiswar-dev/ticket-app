const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  media_url: { type: String, default: null },
  media_type: { type: String, enum: ['image', 'video', null], default: null },
  status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);