import React, { useState } from 'react';
import API from '../api'; // Change 1: Humara centralized dynamic Axios instance

const CreateTicket = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Cloudinary upload function jo tumhara Unsigned Preset use karega
  const uploadToCloudinary = async () => {
    if (!file) return { url: null, type: null };
    
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    
    // Hamara banaya hua preset name
    data.append("upload_preset", "datastraw_crm"); 
    
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      // Tera exact cloud name 'dn8xnitiw' use ho raha hai
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

  // 2. Submit handler jo upload complete hone ke baad details backend ko bhejega
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formTarget = e.target; // Form element ka reference le liya

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

      // Change 2: Hardcoded string hata kar custom axios instance use kiya
      const res = await API.post('/tickets', payload);
      setMessage(`Ticket generated successfully! ID: ${res.data.ticket_id}`);
      
      // ✅ React State Reset
      setCustomerName('');
      setCustomerEmail('');
      setSubject('');
      setDescription('');
      setFile(null);

      // ✅ Visually clear file input (and other native fields)
      formTarget.reset(); 

    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Support Ticket</h2>
        {message && <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm mb-4 border border-blue-100">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Your Name</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Subject</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
            <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Attachment (Image or Video)</label>
            <input type="file" accept="image/*,video/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400">
            {uploading ? 'Uploading Attachment...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;