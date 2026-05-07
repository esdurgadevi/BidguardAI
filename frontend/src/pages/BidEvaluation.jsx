import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BidEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isRecommending, setIsRecommending] = useState(false);

  useEffect(() => {
    fetchTenderAndBids();
  }, [id]);

  const fetchTenderAndBids = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      const [tenderRes, bidsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tenders/${id}`, config),
        axios.get(`http://localhost:5000/api/bids/tender/${id}`, config)
      ]);
      
      setTender(tenderRes.data);
      setBids(bidsRes.data);
      setLoading(false);
      if (bidsRes.data.length > 0) setSelectedBid(bidsRes.data[0]);
    } catch (error) {
      console.error('Error fetching evaluation data:', error);
      setLoading(false);
    }
  };

  const getAiRecommendation = async () => {
    setIsRecommending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bids/tender/${id}/recommend-best`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAiRecommendation(response.data);
      
      // Auto-select the recommended bidder
      const recommended = bids.find(b => b.id === response.data.recommendedBidderId);
      if (recommended) setSelectedBid(recommended);

    } catch (error) {
      console.error('Recommendation error:', error);
      const msg = error.response?.data?.message || 'Failed to get AI recommendation.';
      alert(msg);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleStatusUpdate = async (bidId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bids/${bidId}/status`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchTenderAndBids(); 
      alert(`Bid successfully marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-blue-400 font-bold animate-pulse">Initializing AI Evaluation Matrix...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/officer-dashboard')} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Technical Selection Matrix</h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">AI Powered</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Tender: {tender?.referenceNumber} • {tender?.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={getAiRecommendation}
            disabled={isRecommending || bids.length === 0}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center space-x-2 ${
              isRecommending ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95'
            }`}
          >
            {isRecommending ? (
              <span className="flex items-center"><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div> Running AI Comparison...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Predict Best Match</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Bidder Navigation */}
        <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted Bids ({bids.length})</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {bids.map(bid => (
              <div 
                key={bid.id} 
                onClick={() => setSelectedBid(bid)}
                className={`p-5 cursor-pointer transition-all relative group ${
                  selectedBid?.id === bid.id 
                    ? 'bg-blue-50/50' 
                    : 'hover:bg-slate-50'
                }`}
              >
                {selectedBid?.id === bid.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Bidder Identity</span>
                    <h4 className="font-bold text-slate-800">#{bid.bidderId}</h4>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                    bid.status === 'SELECTED' ? 'bg-green-50 text-green-700 border-green-200' :
                    bid.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {bid.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                   <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        bid.aiRecommendation?.overallRecommendation === 'ELIGIBLE' ? 'bg-green-500 w-full' :
                        bid.aiRecommendation?.overallRecommendation === 'NOT_ELIGIBLE' ? 'bg-red-500 w-1/3' : 'bg-amber-500 w-2/3'
                      }`}></div>
                   </div>
                   {aiRecommendation?.recommendedBidderId === bid.id && (
                     <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded animate-pulse">BEST MATCH</span>
                   )}
                   <span className="text-[10px] font-bold text-slate-500">
                     {bid.aiRecommendation?.overallRecommendation === 'ELIGIBLE' ? '100%' : 
                      bid.aiRecommendation?.overallRecommendation === 'NOT_ELIGIBLE' ? '30%' : '65%'}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Deep Dive Analysis */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8">
          {selectedBid ? (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
              
              {/* Clear Cut Explanation Card (Appears when AI predicts match) */}
              {aiRecommendation && selectedBid?.id === aiRecommendation.recommendedBidderId && (
                <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl shadow-blue-900/20 overflow-hidden">
                  <div className="bg-white rounded-[22px] p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-600/40">🏆</div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Selection Rationale</h2>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                               {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-amber-400 rounded-full border border-white"></div>)}
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Top Rated Strategic Match</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Confidence Index</span>
                         <span className="text-3xl font-black text-blue-600">{aiRecommendation.confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                           <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center">
                             <span className="w-2 h-4 bg-blue-600 rounded-full mr-2"></span>
                             The "Clear Cut" Explanation
                           </h4>
                           <p className="text-slate-600 leading-relaxed font-medium">
                             {aiRecommendation.reasoning}
                           </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                            <h4 className="text-xs font-black uppercase tracking-widest opacity-80 mb-4">Winning Advantages</h4>
                            <ul className="space-y-3 text-sm font-bold">
                               <li className="flex items-center"><svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Technical Superiority</li>
                               <li className="flex items-center"><svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Financial Compliance</li>
                               <li className="flex items-center"><svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Lowest Risk Profile</li>
                            </ul>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex justify-between items-center">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xl font-black">#{selectedBid.bidderId}</div>
                    <div>
                       <h3 className="text-lg font-black text-slate-800">Bidder Verification</h3>
                       <p className="text-xs text-slate-500 font-medium">Evaluate extracted parameters against ground truth</p>
                    </div>
                 </div>
                 <div className="flex space-x-3">
                    <button 
                      onClick={() => handleStatusUpdate(selectedBid.id, 'REJECTED')}
                      className="px-6 py-2.5 bg-white text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-50 transition-all active:scale-95"
                    >
                      Reject Bid
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedBid.id, 'SELECTED')}
                      className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center"
                    >
                      Select as Best Bidder
                    </button>
                 </div>
              </div>

              {/* Parameter Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Technical Parameters */}
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-black uppercase tracking-widest">Technical Parameters</span>
                       </div>
                    </div>
                    <div className="p-6 space-y-6">
                       {selectedBid.aiRecommendation?.technical.map((item, idx) => (
                         <div key={idx} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</p>
                               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                  item.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                               }`}>{item.status}</span>
                            </div>
                            <p className="text-sm text-slate-700 font-bold mb-4">{item.requirement}</p>
                            <div className="bg-white/50 rounded-xl p-3 border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bidder Value</p>
                               <p className="text-sm text-slate-900 font-black">{item.bidderValue}</p>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-3 italic line-clamp-2">Insight: {item.reason}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Financial Parameters */}
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-black uppercase tracking-widest">Financial Parameters</span>
                       </div>
                    </div>
                    <div className="p-6 space-y-6">
                       {selectedBid.aiRecommendation?.financial.map((item, idx) => (
                         <div key={idx} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</p>
                               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                  item.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                               }`}>{item.status}</span>
                            </div>
                            <p className="text-sm text-slate-700 font-bold mb-4">{item.requirement}</p>
                            <div className="bg-white/50 rounded-xl p-3 border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bidder Value</p>
                               <p className="text-sm text-slate-900 font-black">{item.bidderValue}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               {/* Comparative Selection Matrix */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-12 mb-20">
                  <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                     <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Comparative Selection Matrix</h3>
                        <p className="text-xs text-slate-500 font-medium">Side-by-side technical and financial compliance overview</p>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span> Pass</span>
                        <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span> Fail</span>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50/50">
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Bidder Identity</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Technical Score</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Financial Score</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">AI Status</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {bids.map(bid => {
                              const techPass = bid.aiRecommendation?.technical.filter(t => t.status === 'PASS').length;
                              const techTotal = bid.aiRecommendation?.technical.length;
                              const finPass = bid.aiRecommendation?.financial.filter(f => f.status === 'PASS').length;
                              const finTotal = bid.aiRecommendation?.financial.length;
                              
                              return (
                                 <tr key={bid.id} className={`hover:bg-slate-50 transition-colors ${aiRecommendation?.recommendedBidderId === bid.id ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center space-x-3">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${aiRecommendation?.recommendedBidderId === bid.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>#{bid.bidderId}</div>
                                          {aiRecommendation?.recommendedBidderId === bid.id && <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter bg-blue-100 px-1.5 py-0.5 rounded">Top Choice</span>}
                                       </div>
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center space-x-2">
                                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                             <div className="h-full bg-blue-500" style={{ width: `${(techPass / techTotal) * 100}%` }}></div>
                                          </div>
                                          <span className="text-xs font-bold text-slate-600">{techPass}/{techTotal}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center space-x-2">
                                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                             <div className="h-full bg-green-500" style={{ width: `${(finPass / finTotal) * 100}%` }}></div>
                                          </div>
                                          <span className="text-xs font-bold text-slate-600">{finPass}/{finTotal}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5">
                                       <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                                          bid.aiRecommendation?.overallRecommendation === 'ELIGIBLE' ? 'bg-green-100 text-green-700' :
                                          bid.aiRecommendation?.overallRecommendation === 'NOT_ELIGIBLE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                       }`}>
                                          {bid.aiRecommendation?.overallRecommendation}
                                       </span>
                                    </td>
                                    <td className="px-8 py-5">
                                       <button 
                                          onClick={() => {
                                             setSelectedBid(bid);
                                             window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                                       >
                                          Deep Dive
                                       </button>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ready for Evaluation</h3>
              <p className="mt-2 text-slate-500 font-medium text-center max-w-sm">Select a bidder from the navigation panel to begin the deep-dive technical verification process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidEvaluation;
