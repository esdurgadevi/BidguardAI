import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BidderDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'applied'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      const [tendersRes, bidsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tenders?status=PUBLISHED'),
        axios.get('http://localhost:5000/api/bids/my-bids', config)
      ]);
      
      setTenders(tendersRes.data);
      setMyBids(bidsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
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
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            B
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">BidGuard AI <span className="text-blue-600 font-medium">| Bidder Portal</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit mb-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'available' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Tenders
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'applied' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Submissions ({myBids.length})
            </button>
          </div>

          {activeTab === 'available' ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Open Opportunities</h2>
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
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row"
                    >
                      <div className="bg-blue-50 w-full md:w-48 p-6 flex flex-col items-center justify-center border-r border-gray-50">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Available</span>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              REF: {tender.referenceNumber || 'N/A'}
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-bold text-gray-400 mb-1">DEADLINE</span>
                              <span className="text-xs font-bold text-red-500">
                                {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                            {tender.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {tender.description || 'No description provided.'}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="text-sm font-bold text-green-600">
                            Budget: {tender.budget ? `₹${tender.budget} Cr` : 'N/A'}
                          </div>
                          <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-200">
                            View Details
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
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Submissions</h2>
              {myBids.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">You haven't submitted any bids yet</h3>
                  <p className="text-gray-500 mt-1">Applied tenders will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {myBids.map((bid) => (
                    <div 
                      key={bid.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                          bid.status === 'SELECTED' ? 'bg-green-500' : 
                          bid.status === 'REJECTED' ? 'bg-red-500' : 'bg-blue-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{bid.Tender?.title}</h3>
                          <p className="text-xs text-gray-400">Submitted on {new Date(bid.submissionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Status</p>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block ${
                            bid.aiRecommendation?.overallRecommendation === 'ELIGIBLE' ? 'bg-green-100 text-green-700' :
                            bid.aiRecommendation?.overallRecommendation === 'NOT_ELIGIBLE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {bid.aiRecommendation?.overallRecommendation || 'EVALUATING'}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Final Decision</p>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block ${
                            bid.status === 'SELECTED' ? 'bg-green-600 text-white' : 
                            bid.status === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {bid.status}
                          </span>
                        </div>

                        <button 
                          onClick={() => navigate(`/bid/${bid.id}`)}
                          className="p-2 hover:bg-gray-50 rounded-lg text-blue-600 transition-colors group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BidderDashboard;
