import React, { useState, useEffect } from 'react';
import API from '../api'; 
import { useNavigate, useLocation } from 'react-router-dom';

const TrackTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTicketDetails = async (idToTrack) => {
    setLoading(true);
    setError('');
    setTicketData(null);
    setNotes([]);

    try {
      const res = await API.get(`/tickets/${idToTrack.toUpperCase().trim()}`);
      setTicketData(res.data.ticket);
      setNotes(res.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || 'Ticket not found. Please check your Ticket ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setTicketId(idFromUrl);
      fetchTicketDetails(idFromUrl); 
    }
  }, [location.search]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    fetchTicketDetails(ticketId);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-16 px-4 selection:bg-slate-200">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 px-1">
        <button 
          onClick={() => navigate('/create-ticket')} 
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 tracking-wide uppercase transition"
        >
          &larr; Create Ticket
        </button>
        <button 
          onClick={() => navigate('/login')} 
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 tracking-wide uppercase transition"
        >
          Agent Login
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight text-center">Track Status</h2>
        <p className="text-slate-400 text-center text-xs mt-1 mb-8">Get live updates on your reported issue</p>

        <form onSubmit={handleTrackSubmit} className="flex gap-2.5 mb-8">
          <input 
            type="text" 
            placeholder="Enter Ticket ID (e.g. TKT-1001)" 
            className="flex-1 px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white uppercase tracking-wider transition"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition active:scale-[0.98] disabled:bg-slate-300"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium border border-rose-100 text-center mb-6">
            {error}
          </div>
        )}

        {ticketData && (
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">REFERENCE</span>
                <h3 className="text-base font-semibold text-slate-900 font-mono">{ticketData.ticket_id}</h3>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 text-right">CURRENT STATUS</span>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-white tracking-wide"
                  style={{ backgroundColor: ticketData.status.color }}
                >
                  {ticketData.status.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs">
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">Subject</p>
                <p className="text-slate-800 font-semibold text-sm">{ticketData.subject}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">Created At</p>
                <p className="text-slate-800 text-sm">{new Date(ticketData.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Reported Case Details</p>
              <div className="text-slate-700 bg-slate-50/50 p-4 rounded-xl text-sm border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {ticketData.description}
              </div>
            </div>

            {ticketData.media_url && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Attached Media File</p>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 flex items-center justify-center bg-slate-50">
                  {ticketData.media_type === 'image' ? (
                    <img src={ticketData.media_url} alt="Attachment" className="max-h-72 w-full object-contain" />
                  ) : (
                    <video src={ticketData.media_url} controls className="max-h-72 w-full object-contain" />
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Resolution Timeline & Agent Logs</p>
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
                  Our system shows no logs yet. Your ticket will be reviewed soon.
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note._id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <p className="text-slate-700 text-sm leading-relaxed">{note.note_text}</p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-2">
                        Logged on: {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackTicket;