const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
const Status = require('../models/Status');
const { sendEmail } = require('../utils/emailService');

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description, media_url, media_type } = req.body;

    // Fetch dynamic 'OPEN' status from Status Master
    const defaultStatus = await Status.findOne({ code: 'OPEN' });
    if (!defaultStatus) return res.status(500).json({ message: 'Default status not found' });

    // Auto-generate ticket ID (TKT-XXXX)
    const count = await Ticket.countDocuments();
    const ticket_id = `TKT-${1000 + count + 1}`;

    const newTicket = new Ticket({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
      media_url,
      media_type,
      status: defaultStatus._id
    });

    await newTicket.save();

// Is block ko search karke replace kar do:
await sendEmail(
  customer_email,
  customer_name,
  `Ticket Created: ${ticket_id}`,
  `<h3>Hi ${customer_name},</h3>
   <p>Your ticket has been logged successfully!</p>
   <p><b>Ticket ID:</b> ${ticket_id}</p>
   <p><b>Subject:</b> ${subject}</p>
   <p>We are reviewing your request and will get back to you soon.</p>`,
  ticket_id // <-- Ticket ID yahan pass kar diya
);

    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tickets (with search & status filters)
exports.getTickets = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      const statusObj = await Status.findOne({ code: status.toUpperCase() });
      if (statusObj) query.status = statusObj._id;
    }

    if (search) {
      query.$or = [
        { ticket_id: { $regex: search, $options: 'i' } },
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query).populate('status').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Ticket with linked Notes
exports.getTicketDetails = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id }).populate('status');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const notes = await Note.find({ ticket_id: ticket._id }).sort({ createdAt: -1 });
    res.json({ ticket, notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Ticket (Status or adding notes)
exports.updateTicket = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id }).populate('status');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    let statusUpdated = false;
    let noteAdded = false;

    // Handle Status Update
    if (status) {
      const nextStatus = await Status.findOne({ code: status.toUpperCase() });
      if (nextStatus) {
        ticket.status = nextStatus._id;
        await ticket.save();
        statusUpdated = true;
      }
    }

    // Handle Note Creation
    if (notes) {
      const newNote = new Note({ ticket_id: ticket._id, note_text: notes });
      await newNote.save();
      noteAdded = true;
    }

    // Get updated status details to send in email
    const currentTicket = await Ticket.findOne({ ticket_id: req.params.ticket_id }).populate('status');

// Is block ko search karke replace kar do:
if (statusUpdated || noteAdded) {
  await sendEmail(
    ticket.customer_email,
    ticket.customer_name,
    `Update on your Ticket: ${ticket.ticket_id}`,
    `<h3>Hi ${ticket.customer_name},</h3>
     <p>Your ticket <b>${ticket.ticket_id}</b> has been updated by our team.</p>
     <p><b>Current Status:</b> ${currentTicket.status.label}</p>
     ${notes ? `<p><b>New Remark:</b> ${notes}</p>` : ''}`,
    ticket.ticket_id // <-- Ticket ID yahan bhi pass kar diya
  );
}

    res.json({ success: true, updated_at: new Date() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};