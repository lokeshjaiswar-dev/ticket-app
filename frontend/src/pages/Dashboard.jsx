import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const statusParam = activeTab === 'All' ? '' : activeTab;

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center selection:bg-slate-200">
      {/* Header Container - Same vertical column column width alignment */}
      <header className="w-full max-w-7xl bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-base font-semibold text-slate-900 tracking-tight">Datastraw CRM</h1>
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Admin Console</p>
        </div>
        <button onClick={handleLogout} className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium px-4 py-1.5 rounded-xl text-xs transition">
          Sign Out
        </button>
      </header>

      {/* Main Content Container - Matches exact header structural width */}
      <main className="w-full max-w-7xl py-10 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex border border-slate-200/60 bg-white rounded-xl p-1 shadow-sm w-full sm:w-auto overflow-x-auto">
            {['All', 'Open', 'In Progress', 'Closed'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-800'}`}>
                {tab}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="Search customer, ID or subject..." 
            className="w-full sm:w-72 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-slate-400 shadow-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-500">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.length > 0 ? (
                  tickets.map((t) => (
                    <tr key={t._id} onClick={() => navigate(`/ticket/${t.ticket_id}`)} className="hover:bg-slate-50/60 cursor-pointer transition">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm tracking-tight">{t.ticket_id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 text-sm">{t.customer_name}</div>
                        <div className="text-slate-400 font-normal">{t.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 max-w-xs truncate">{t.subject}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white" style={{ backgroundColor: t.status.color }}>
                          {t.status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-slate-400 italic">No support tickets found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;