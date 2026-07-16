import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 selection:bg-slate-200">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_25px_rgba(15,23,42,0.02)] p-8 border border-slate-100">
        <h2 className="text-xl font-semibold text-center text-slate-900 tracking-tight">Datastraw CRM</h2>
        <p className="text-slate-400 text-center text-[10px] mt-1 mb-6 uppercase tracking-wider font-bold">Internal Administrator Access</p>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl text-xs font-medium mb-4 border border-rose-100 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@datastraw.com"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition active:scale-[0.99]">
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">System Demo Access</p>
          <p className="text-xs text-slate-600">Email: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200/80 font-bold">admin@datastraw.com</span></p>
          <p className="text-xs text-slate-600 mt-1.5">Pass: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200/80 font-bold">admin123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;