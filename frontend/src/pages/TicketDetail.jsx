import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setStatus(res.data.ticket.status.code);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await API.put(`/tickets/${id}`, {
        status: status,
        notes: note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNote('');
      fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (!data) return <div className="text-center py-12">Loading ticket details...</div>;

  const { ticket, notes } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-slate-500 text-sm hover:text-slate-800 font-semibold mb-6 flex items-center gap-1">
          ← Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{ticket.ticket_id}</span>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{ticket.subject}</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${ticket.status.color}15`, color: ticket.status.color }}>
                  {ticket.status.label}
                </span>
              </div>
              
              <div className="text-sm text-slate-600 space-y-4">
                <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{ticket.description}"</p>

                {ticket.media_url && (
                  <div className="mt-4 border border-slate-100 rounded-xl overflow-hidden bg-black">
                    {ticket.media_type === 'video' ? (
                      <video src={ticket.media_url} controls className="w-full max-h-96" />
                    ) : (
                      <img src={ticket.media_url} alt="Attachment" className="w-full max-h-96 object-contain" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Replies & Notes Activity</h3>
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((n) => (
                    <div key={n._id} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-700">{n.note_text}</p>
                      <span className="text-xs text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No notes or remarks have been updated on this ticket yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-fit space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Customer Info</h4>
              <p className="text-sm font-semibold text-slate-800">{ticket.customer_name}</p>
              <p className="text-xs text-slate-400">{ticket.customer_email}</p>
            </div>

            <hr className="border-slate-100" />

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Update Status</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Add Note / Reply</label>
                <textarea rows="3" placeholder="Add remarks here..." className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={note} onChange={(e) => setNote(e.target.value)} required></textarea>
              </div>

              <button type="submit" disabled={updating} className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50">
                {updating ? 'Updating...' : 'Post Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;