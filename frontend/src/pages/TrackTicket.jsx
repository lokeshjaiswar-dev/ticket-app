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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl flex justify-between mb-8">
        <button 
          onClick={() => navigate('/create-ticket')} 
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          ← Create New Ticket
        </button>
        <button 
          onClick={() => navigate('/login')} 
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          Agent Login
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Track Your Ticket</h2>
        <p className="text-slate-500 text-center text-sm mb-6">Enter your Ticket ID to view real-time status and remarks</p>

        <form onSubmit={handleTrackSubmit} className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="e.g., TKT-1001" 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:bg-blue-400"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 mb-6 text-center">
            {error}
          </div>
        )}

        {ticketData && (
          <div className="space-y-6 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket ID</span>
                <h3 className="text-xl font-bold text-slate-800">{ticketData.ticket_id}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-1"
                  style={{ backgroundColor: ticketData.status.color }}
                >
                  {ticketData.status.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-sm">
              <div>
                <p className="text-slate-500 font-semibold">Subject:</p>
                <p className="text-slate-800 font-medium">{ticketData.subject}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">Submitted On:</p>
                <p className="text-slate-800">{new Date(ticketData.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Issue Description:</p>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-lg text-sm border border-slate-100 whitespace-pre-wrap">
                {ticketData.description}
              </p>
            </div>

            {ticketData.media_url && (
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Your Attachment:</p>
                {ticketData.media_type === 'image' ? (
                  <img src={ticketData.media_url} alt="Attachment" className="max-h-60 rounded-lg border border-slate-200 object-contain bg-slate-50" />
                ) : (
                  <video src={ticketData.media_url} controls className="max-h-60 rounded-lg border border-slate-200 object-contain bg-slate-50" />
                )}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Updates & Remarks from Support Team:</p>
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg text-center">
                  No remarks added yet. The support team is currently reviewing your ticket.
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note._id} className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-lg text-sm">
                      <p className="text-slate-700 font-medium">{note.note_text}</p>
                      <span className="text-[10px] text-slate-400 block mt-1.5">
                        Updated on: {new Date(note.createdAt).toLocaleString()}
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