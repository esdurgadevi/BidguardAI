import React, { useState } from 'react';
import axios from 'axios';

const BidSubmissionModal = ({ tender, onClose, onSuccess }) => {
  const [technicalFile, setTechnicalFile] = useState(null);
  const [financialFile, setFinancialFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!technicalFile || !financialFile) {
      setError('Please upload both Technical and Financial documents.');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('tenderId', tender.id);
    data.append('technicalDocs', technicalFile);
    data.append('financialDocs', financialFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bids/submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit bid. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold">Submit Bid: {tender.title}</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-4">
            <p className="font-semibold">Requirement Checklist:</p>
            <ul className="list-disc list-inside mt-1 opacity-80">
              <li>Technical Experience Proof</li>
              <li>GST/ISO Certificates</li>
              <li>Financial Price Quotation</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">1. Technical Bid (PDF/DOC)*</label>
            <input 
              type="file" 
              onChange={(e) => setTechnicalFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">2. Financial Bid (PDF/DOC)*</label>
            <input 
              type="file" 
              onChange={(e) => setFinancialFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading Bid...
                </span>
              ) : 'Submit Final Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidSubmissionModal;
