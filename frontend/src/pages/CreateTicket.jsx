import React, { useState } from 'react';
import axios from 'axios';

const CreateTicket = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', description: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async () => {
    if (!file) return { url: null, type: null };
    
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "datastraw_crm"); // Replace with actual preset
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/${resourceType}/upload`, {
        method: "POST",
        body: data
      });
      const fileData = await res.json();
      setUploading(false);
      return { url: fileData.secure_url, type: resourceType };
    } catch (err) {
      setUploading(false);
      throw new Error("File upload failed to Cloudinary");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      let mediaDetails = { url: null, type: null };
      if (file) {
        mediaDetails = await uploadToCloudinary();
      }

      await axios.post('http://localhost:5000/api/tickets', {
        customer_name: form.name,
        customer_email: form.email,
        subject: form.subject,
        description: form.description,
        media_url: mediaDetails.url,
        media_type: mediaDetails.type
      });

      setStatus({ type: 'success', msg: 'Your support ticket has been created and logged successfully!' });
      setForm({ name: '', email: '', subject: '', description: '' });
      setFile(null);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Something went wrong.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Create Support Ticket</h2>
        <p className="text-slate-500 text-center mb-8 text-sm">Please fill out this form to submit your issues or feedback.</p>

        {status.msg && (
          <div className={`p-4 rounded-lg mb-6 border text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
            <input type="text" name="subject" value={form.subject} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea name="description" value={form.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attachment (Image or Video)</label>
            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50">
            {uploading ? 'Uploading Attachment...' : 'Submit Support Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;