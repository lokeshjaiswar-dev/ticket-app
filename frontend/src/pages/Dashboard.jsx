import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Change: Dynamic Axios Instance import kiya

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const statusParam = activeTab === 'All' ? '' : activeTab;
      
      // Change: Dynamic Axios routing use ki
      const res = await API.get(`/tickets?status=${statusParam}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Support CRM Admin Panel</h1>
        <button onClick={handleLogout} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-4 py-1.5 rounded-lg text-sm transition">
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Tabs */}
          <div className="flex border border-slate-200 bg-white rounded-xl p-1 shadow-sm">
            {['All', 'Open', 'In Progress', 'Closed'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <input type="text" placeholder="Search customer, ID or title..." className="w-full md:w-80 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Tickets Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <tr key={t._id} onClick={() => navigate(`/ticket/${t.ticket_id}`)} className="hover:bg-slate-50/50 cursor-pointer transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{t.ticket_id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{t.customer_name}</div>
                      <div className="text-xs text-slate-400">{t.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 max-w-xs truncate">{t.subject}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${t.status.color}15`, color: t.status.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.status.color }} />
                        {t.status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No support tickets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;