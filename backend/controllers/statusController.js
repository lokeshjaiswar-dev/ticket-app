const Status = require('../models/Status');

// Seed status master if empty
exports.seedStatuses = async (req, res) => {
  try {
    const defaults = [
      { code: 'OPEN', label: 'Open', color: '#22c55e' },
      { code: 'IN_PROGRESS', label: 'In Progress', color: '#f97316' },
      { code: 'CLOSED', label: 'Closed', color: '#64748b' }
    ];

    for (const item of defaults) {
      await Status.findOneAndUpdate({ code: item.code }, item, { upsert: true, new: true });
    }

    res.json({ message: 'Statuses Seeded Successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};