import React, { useState } from 'react';
import axios from 'axios';

const TenderUploadModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    referenceNumber: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a tender document.');
      return;
    }

    setUploading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const officerId = user.id || 1;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('referenceNumber', formData.referenceNumber);
    data.append('officerId', officerId);
    data.append('tenderFile', file);

    try {
      await axios.post('http://localhost:5000/api/tenders/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload tender. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-crpf-dark px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold">Upload New Tender</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tender Title*</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crpf-dark focus:border-transparent transition-all outline-none"
              placeholder="e.g. Procurement of Tactical Gear 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crpf-dark focus:border-transparent transition-all outline-none"
              placeholder="TENDER/CRPF/2024/001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crpf-dark focus:border-transparent transition-all outline-none h-24"
              placeholder="Brief description of the tender requirements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tender Document (PDF/DOC)*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-crpf-dark transition-colors duration-200">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-crpf-dark hover:text-crpf-light focus-within:outline-none">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                {file && <p className="text-xs font-bold text-green-600 mt-2">Selected: {file.name}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-bold transition-all ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-crpf-dark hover:bg-crpf-light'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Parsing...
                </span>
              ) : 'Start Analysis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenderUploadModal;
