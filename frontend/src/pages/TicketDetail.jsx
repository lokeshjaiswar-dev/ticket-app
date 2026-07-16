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

  if (!data) return <div className="text-center py-16 text-slate-400 text-xs font-semibold tracking-wider uppercase">Loading ticket details...</div>;

  const { ticket, notes } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6 selection:bg-slate-200">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 text-xs hover:text-slate-800 font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5 transition">
          &larr; Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-wider">{ticket.ticket_id}</span>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight mt-2.5">{ticket.subject}</h2>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-white tracking-wide" style={{ backgroundColor: ticket.status.color }}>
                  {ticket.status.label}
                </span>
              </div>
              
              <div className="text-slate-600">
                <p className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-sm whitespace-pre-wrap leading-relaxed text-slate-700">"{ticket.description}"</p>

                {ticket.media_url && (
                  <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center max-h-[400px]">
                    {ticket.media_type === 'video' ? (
                      <video src={ticket.media_url} controls className="w-full max-h-[400px] object-contain" />
                    ) : (
                      <img src={ticket.media_url} alt="Attachment" className="w-full max-h-[400px] object-contain" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Replies & Notes Activity</h3>
              <div className="space-y-3">
                {notes.length > 0 ? (
                  notes.map((n) => (
                    <div key={n._id} className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl">
                      <p className="text-sm text-slate-700 leading-relaxed">{n.note_text}</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50/40 p-4 rounded-xl border border-dashed border-slate-200 text-center">No notes or remarks have been updated on this ticket yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-fit space-y-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Customer Info</h4>
              <p className="text-sm font-semibold text-slate-800">{ticket.customer_name}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{ticket.customer_email}</p>
            </div>

            <hr className="border-slate-100" />

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Update Status</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400 font-medium" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Add Note / Reply</label>
                <textarea rows="3" placeholder="Add remarks here..." className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-slate-400 resize-none" value={note} onChange={(e) => setNote(e.target.value)} required></textarea>
              </div>

              <button type="submit" disabled={updating} className="w-full bg-slate-900 text-white text-xs py-2.5 rounded-xl font-medium hover:bg-slate-800 transition disabled:opacity-50">
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