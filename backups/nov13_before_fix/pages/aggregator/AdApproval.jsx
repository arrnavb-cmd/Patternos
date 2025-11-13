import React from "react";
import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default function AdApproval() {
  const [pendingAds] = useState([
    {
      id: 'ad_001',
      brandName: 'Nike India',
      campaignName: 'Nike Air Max 270 - Summer Sale',
      adType: 'banner',
      status: 'pending',
      submittedAt: '2025-11-01T14:30:00',
      budget: 5000000,
      targetAudience: '45K high-intent footwear users'
    },
    {
      id: 'ad_002',
      brandName: 'Lakme',
      campaignName: 'Lakme 9to5 Lipstick Launch',
      adType: 'video',
      status: 'pending',
      submittedAt: '2025-11-01T13:15:00',
      budget: 3500000,
      targetAudience: '28K high-intent beauty users'
    }
  ]);

  const handleApprove = (adId) => {
    alert(`✅ Ad ${adId} approved!`);
  };

  const handleReject = (adId) => {
    alert(`❌ Ad ${adId} rejected!`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ad Approval System</h1>
          <p className="text-gray-400">Review and approve ads before they go live on Zepto platform</p>
        </div>

        <div className="grid gap-6">
          {pendingAds.map((ad) => (
            <div key={ad.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{ad.campaignName}</h3>
                  <p className="text-gray-400">{ad.brandName}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-sm flex items-center gap-2">
                  <Clock size={14} />
                  Pending Review
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Budget</div>
                  <div className="text-white font-bold">₹{(ad.budget / 100000).toFixed(1)}L</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ad Type</div>
                  <div className="text-white font-bold capitalize">{ad.adType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Target</div>
                  <div className="text-white font-bold">{ad.targetAudience}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(ad.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(ad.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <XCircle size={20} />
                  Reject
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <Eye size={20} />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
