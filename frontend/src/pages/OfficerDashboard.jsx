import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TenderUploadModal from '../components/TenderUploadModal';

const OfficerDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tenders');
      setTenders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-crpf-dark rounded-full flex items-center justify-center text-white font-bold">
            C
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">BidGuard AI <span className="text-crpf-dark font-medium">| Officer Portal</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-crpf-dark hover:bg-crpf-light text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Upload Tender</span>
          </button>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Active Tenders</h2>
            <div className="text-sm text-gray-500">
              Total: {tenders.length}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crpf-dark"></div>
            </div>
          ) : tenders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No tenders found</h3>
              <p className="text-gray-500 mt-1 mb-6">Upload your first tender document to start AI parsing.</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="text-crpf-dark font-semibold hover:underline"
              >
                Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => (
                <div 
                  key={tender.id}
                  onClick={() => navigate(`/tender/${tender.id}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      tender.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tender.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(tender.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-crpf-dark transition-colors duration-200 mb-2">
                    {tender.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {tender.description || 'No description provided.'}
                  </p>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">AI</div>
                      <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-600">PDF</div>
                    </div>
                    <span className="text-xs font-medium text-crpf-dark flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <TenderUploadModal 
          onClose={() => setShowUploadModal(false)} 
          onSuccess={() => {
            setShowUploadModal(false);
            fetchTenders();
          }}
        />
      )}
    </div>
  );
};

export default OfficerDashboard;
