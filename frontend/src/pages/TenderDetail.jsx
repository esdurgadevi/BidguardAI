import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOfficer = user.role === 'CRPF_OFFICER';

  const fetchTenderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tenders/${id}`);
      setTender(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tender details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenderDetails();
  }, [id]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await axios.patch(`http://localhost:5000/api/tenders/${id}/status`, { status: 'PUBLISHED' });
      await fetchTenderDetails(); // Refresh data
      alert('Tender published successfully!');
    } catch (error) {
      console.error('Error publishing tender:', error);
      alert('Failed to publish tender.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isOfficer ? 'border-crpf-dark' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  if (!tender) {
    return <div className="text-center p-20 text-gray-500">Tender not found.</div>;
  }

  const { criteria } = tender;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{tender.title}</h1>
            <p className="text-xs text-gray-400">REF: {tender.referenceNumber || 'N/A'}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all">
            Download PDF
          </button>
          {isOfficer ? (
            <button 
              onClick={handlePublish}
              disabled={publishing || tender.status === 'PUBLISHED'}
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all ${
                tender.status === 'PUBLISHED' ? 'bg-green-600 cursor-not-allowed' : 'bg-crpf-dark hover:bg-crpf-light'
              }`}
            >
              {publishing ? 'Publishing...' : tender.status === 'PUBLISHED' ? 'Published' : 'Publish Tender'}
            </button>
          ) : (
            <button className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all">
              Apply Now
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">AI Summary</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {criteria?.summary || 'No summary available.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</label>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  <span className="text-sm font-semibold text-gray-700">{tender.status}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Uploaded On</label>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  {new Date(tender.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Original File</label>
                <a href={`http://localhost:5000/${tender.filePath}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-crpf-dark hover:underline flex items-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  tender_doc.pdf
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Criteria */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Criteria */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-blue-900">Technical Eligibility</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {criteria?.technical?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Financial Criteria */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-green-900">Financial Requirements</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {criteria?.financial?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Statutory Compliance */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04currA12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-purple-900">Statutory Compliance</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {criteria?.compliance?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
