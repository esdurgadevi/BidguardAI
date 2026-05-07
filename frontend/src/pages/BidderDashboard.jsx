import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BidderDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublishedTenders();
  }, []);

  const fetchPublishedTenders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tenders?status=PUBLISHED');
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

  const filteredTenders = tenders.filter(tender => 
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            B
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">BidGuard AI <span className="text-blue-600 font-medium">| Bidder Portal</span></h1>
        </div>
        <div className="flex items-center space-x-4">
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
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Tenders</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text"
                placeholder="Search by title or reference number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700">No matching tenders found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTenders.map((tender) => (
                <div 
                  key={tender.id}
                  onClick={() => navigate(`/tender/${tender.id}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group flex flex-col md:flex-row"
                >
                  <div className="bg-blue-50 w-full md:w-48 p-6 flex flex-col items-center justify-center border-r border-gray-50">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Tender Doc</span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          REF: {tender.referenceNumber || 'N/A'}
                        </span>
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Open
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                        {tender.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {tender.description || 'No description provided.'}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                        </svg>
                        Posted {new Date(tender.createdAt).toLocaleDateString()}
                      </div>
                      <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-200">
                        Check Eligibility
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BidderDashboard;
