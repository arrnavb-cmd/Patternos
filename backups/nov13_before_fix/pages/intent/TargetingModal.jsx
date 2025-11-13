import React from 'react';
import { Target, X, IndianRupee, Eye, MousePointer, ShoppingCart } from 'lucide-react';


const TargetingModal = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  const handleNotifyBrand = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: opportunity.brand,
          category: opportunity.category,
          high_intent_users: opportunity.high_intent_users,
          potential_revenue: opportunity.potential_revenue,
          campaign_cost: totalCost,
          estimated_roas: estimatedROAS
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert(`✅ Notification sent to ${opportunity.brand}!`);
        onClose();
      }
    } catch (error) {
      alert('Failed to send notification');
    }
  };


  // Dynamic pricing parameters (from PatternOS model)
  const baseCPM = 150;
  const highIntentMultiplier = 1.5;
  const platformFeePercent = 0.10;
  const highIntentPremiumPercent = 0.20;
  const avgCTR = 0.035;
  const campaignDuration = 30;
  
  // Calculate metrics based on REAL brand data
  const dailyImpressions = Math.round(opportunity.high_intent_users * 4);
  const totalImpressions = dailyImpressions * campaignDuration;
  const expectedClicks = Math.round(totalImpressions * avgCTR);
  const expectedConversions = Math.round(expectedClicks * opportunity.conversion_lift);
  
  const highIntentCPM = baseCPM * highIntentMultiplier;
  const impressionCost = (totalImpressions / 1000) * highIntentCPM;
  const platformFee = impressionCost * platformFeePercent;
  const highIntentPremium = impressionCost * highIntentPremiumPercent;
  const totalCost = impressionCost + platformFee + highIntentPremium;
  
  const estimatedRevenue = expectedConversions * opportunity.avg_order_value;
  const estimatedROAS = estimatedRevenue / totalCost;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl border border-orange-600/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/20 border-b border-orange-600/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-2 text-orange-400" />
              Campaign Pricing: {opportunity.brand}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{opportunity.category} • 30-Day Campaign</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Target Audience</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">High-Intent Users</p>
                <p className="text-2xl font-bold text-orange-400">{opportunity.high_intent_users.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Conversion Probability</p>
                <p className="text-2xl font-bold text-green-400">{(opportunity.conversion_lift * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Campaign Projections (30 Days)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Total Impressions</p>
                    <p className="text-lg font-semibold text-white">{totalImpressions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <MousePointer className="w-5 h-5 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Expected Clicks</p>
                    <p className="text-lg font-semibold text-white">{expectedClicks.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Expected Conversions</p>
                    <p className="text-lg font-semibold text-white">{expectedConversions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/10 rounded-xl p-5 border border-orange-600/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <IndianRupee className="w-5 h-5 text-orange-400 mr-2" />
              Campaign Pricing Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">High-Intent CPM (₹{highIntentCPM}/1000)</span>
                <span className="text-white font-semibold">₹{impressionCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Platform Fee (10%)</span>
                <span className="text-white font-semibold">₹{platformFee.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-400">High-Intent Premium (20%)</span>
                <span className="text-orange-400 font-semibold">₹{highIntentPremium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total Campaign Cost</span>
                <span className="text-2xl font-bold text-green-400">₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-5 border border-green-600/30">
            <h3 className="text-lg font-bold text-white mb-4">Expected ROI</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Estimated Revenue</p>
                <p className="text-2xl font-bold text-green-400">₹{estimatedRevenue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Expected ROAS</p>
                <p className="text-2xl font-bold text-blue-400">{estimatedROAS.toFixed(1)}x</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold">
              Cancel
            </button>
            <button onClick={handleNotifyBrand} className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold">
              Notify Brand →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetingModal;
