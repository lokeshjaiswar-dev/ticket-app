const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketDetails, updateTicket } = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:ticket_id', getTicketDetails);
router.put('/:ticket_id', updateTicket);

module.exports = router;