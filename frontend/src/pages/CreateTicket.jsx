import React, { useState } from 'react';
import API from '../api'; 

const CreateTicket = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const uploadToCloudinary = async () => {
    if (!file) return { url: null, type: null };
    
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "datastraw_crm"); 
    
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dn8xnitiw/${resourceType}/upload`, {
        method: "POST",
        body: data
      });
      const fileData = await res.json();
      setUploading(false);
      return { url: fileData.secure_url, type: resourceType };
    } catch (err) {
      setUploading(false);
      console.error("Cloudinary error: ", err);
      throw new Error("File upload failed to Cloudinary");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formTarget = e.target; 

    try {
      let mediaData = { url: null, type: null };
      if (file) {
        mediaData = await uploadToCloudinary();
      }

      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        subject,
        description,
        media_url: mediaData.url,
        media_type: mediaData.type
      };

      const res = await API.post('/tickets', payload);
      setMessage(`Ticket generated successfully! ID: ${res.data.ticket_id}`);

      setCustomerName('');
      setCustomerEmail('');
      setSubject('');
      setDescription('');
      setFile(null);

      formTarget.reset(); 

    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 selection:bg-slate-200">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-8 border border-slate-100">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Support Portal</p>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Create Support Ticket</h2>
        </div>
        
        {message && (
          <div className="p-4 bg-slate-50 text-slate-700 rounded-xl text-xs font-medium mb-5 border border-slate-200/60 leading-relaxed">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Your Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition" 
              value={customerEmail} 
              onChange={(e) => setCustomerEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition resize-none" 
              rows="4" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Attachment (Image or Video)</label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 border-dashed rounded-xl flex items-center">
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={uploading} 
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition active:scale-[0.99] disabled:bg-slate-300"
          >
            {uploading ? 'Uploading Attachment...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;