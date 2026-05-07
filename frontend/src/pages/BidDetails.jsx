import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BidDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBidDetails();
  }, [id]);

  const fetchBidDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bids/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBid(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bid details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading evaluation report...</div>;
  if (!bid) return <div className="p-20 text-center">Bid not found.</div>;

  const report = bid.aiRecommendation;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/bidder-dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bid Evaluation Report</h1>
            <p className="text-xs text-gray-400">Tender: {bid.Tender?.title}</p>
          </div>
        </div>
        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
          bid.status === 'SELECTED' ? 'bg-green-100 text-green-700' :
          bid.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          Status: {bid.status}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-8 px-6 space-y-8">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${
              report?.overallRecommendation === 'ELIGIBLE' ? 'bg-green-500' : 
              report?.overallRecommendation === 'NOT_ELIGIBLE' ? 'bg-red-500' : 'bg-amber-500'
            }`}>
              {report?.overallRecommendation === 'ELIGIBLE' ? '✓' : report?.overallRecommendation === 'NOT_ELIGIBLE' ? '✗' : '!'}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">AI Eligibility Result</h2>
              <p className={`text-sm font-bold uppercase tracking-widest ${
                report?.overallRecommendation === 'ELIGIBLE' ? 'text-green-600' : 'text-red-600'
              }`}>
                {report?.overallRecommendation || 'PROCESSING'}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">AI Key Findings</h4>
            <p className="text-gray-700 leading-relaxed italic">
              "Based on the documents provided, you {report?.overallRecommendation === 'ELIGIBLE' ? 'meet' : 'do not meet'} the essential criteria. {bid.status === 'PENDING' ? 'Waiting for final manual officer review.' : `Final decision: ${bid.status}.`}"
            </p>
          </div>
        </div>

        {/* Technical Gaps Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-gray-700 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">🛠️</div>
            Technical Compliance & Gaps
          </h3>
          <div className="grid gap-4">
            {report?.technical.map((item, idx) => (
              <div key={idx} className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center justify-between transition-all ${
                item.status === 'FAIL' ? 'border-red-100 bg-red-50/10' : 'border-gray-100'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${item.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <h4 className="font-bold text-gray-800 text-sm">{item.requirement}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Extracted Value: <span className="font-bold text-gray-700">{item.bidderValue}</span></p>
                  {item.status === 'FAIL' && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-medium border border-red-100 mt-2">
                      <span className="font-black uppercase text-[10px] block mb-1">Why you lagged:</span>
                      {item.reason}
                    </div>
                  )}
                </div>
                <div className={`mt-4 md:mt-0 md:ml-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Gaps Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-gray-700 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">💰</div>
            Financial Eligibility
          </h3>
          <div className="grid gap-4">
            {report?.financial.map((item, idx) => (
              <div key={idx} className={`bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between ${
                item.status === 'FAIL' ? 'border-red-100 bg-red-50/10' : 'border-gray-100'
              }`}>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{item.requirement}</h4>
                  <p className="text-xs text-gray-500">Your Quote/Value: <span className="font-bold text-gray-700">{item.bidderValue}</span></p>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Improvement Tips */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">💡</div>
             <h3 className="text-xl font-bold">AI Improvement Suggestions</h3>
          </div>
          <ul className="space-y-3 opacity-90 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Ensure all certificates are scanned clearly for better AI extraction.
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              If you lagged in experience, include project completion certificates in your next bid.
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Check the budget estimate in the tender details to keep your financial quote competitive.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BidDetails;
