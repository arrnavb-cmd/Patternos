import React from "react";
import { useState } from 'react';
import { Wallet, Plus, TrendingUp, Download, RefreshCw, DollarSign, CreditCard } from 'lucide-react';

export default function WalletWise() {
  const [walletData] = useState({
    balance: 125000,
    currency: 'INR',
    spent_this_month: 87500,
    pending: 15000,
    credit_limit: 500000,
    auto_topup: true,
    transactions: [
      {
        id: 'TXN001',
        type: 'credit',
        amount: 150000,
        description: 'Monthly budget allocation',
        date: '2025-10-25',
        status: 'completed'
      },
      {
        id: 'TXN002',
        type: 'debit',
        amount: 45000,
        description: 'Campaign: Diwali Sale - Earbuds',
        date: '2025-10-26',
        status: 'completed'
      },
      {
        id: 'TXN003',
        type: 'debit',
        amount: 42500,
        description: 'Campaign: Back to School - Laptops',
        date: '2025-10-27',
        status: 'completed'
      },
      {
        id: 'TXN004',
        type: 'credit',
        amount: 25000,
        description: 'Cashback bonus',
        date: '2025-10-28',
        status: 'completed'
      },
      {
        id: 'TXN005',
        type: 'debit',
        amount: 15000,
        description: 'Campaign: Fashion Week',
        date: '2025-10-29',
        status: 'pending'
      }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Wallet size={32} />
          <div>
            <h2 className="text-2xl font-bold">Wallet Wise</h2>
            <p className="text-green-100">Manage your advertising budget & payments</p>
          </div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="text-green-400" size={24} />
            <p className="text-slate-400 text-sm">Available Balance</p>
          </div>
          <p className="text-4xl font-bold text-white">₹{walletData.balance.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-2">+₹25K cashback this month</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-400" size={24} />
            <p className="text-slate-400 text-sm">Spent This Month</p>
          </div>
          <p className="text-4xl font-bold text-white">₹{walletData.spent_this_month.toLocaleString()}</p>
          <p className="text-slate-400 text-sm mt-2">Across 3 campaigns</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="text-yellow-400" size={24} />
            <p className="text-slate-400 text-sm">Pending Charges</p>
          </div>
          <p className="text-4xl font-bold text-white">₹{walletData.pending.toLocaleString()}</p>
          <p className="text-slate-400 text-sm mt-2">Will be settled in 2 days</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-purple-400" size={24} />
            <p className="text-slate-400 text-sm">Credit Limit</p>
          </div>
          <p className="text-4xl font-bold text-white">₹{walletData.credit_limit.toLocaleString()}</p>
          <p className="text-slate-400 text-sm mt-2">
            Used: {Math.round((walletData.spent_this_month / walletData.credit_limit) * 100)}%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all">
            <Plus size={20} />
            Add Funds
          </button>
          <button className="flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all">
            <RefreshCw size={20} />
            Setup Auto Top-up
          </button>
          <button className="flex items-center justify-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
            <Download size={20} />
            Download Statement
          </button>
        </div>
      </div>

      {/* Auto Top-up Settings */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Auto Top-up</h3>
            <p className="text-slate-400 text-sm">Automatically add funds when balance is low</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={walletData.auto_topup} className="sr-only peer" readOnly />
            <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">Trigger When Balance Below</p>
            <p className="text-white font-bold text-lg">₹50,000</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">Auto Top-up Amount</p>
            <p className="text-white font-bold text-lg">₹1,00,000</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-1">Payment Method</p>
            <p className="text-white font-bold text-lg">UPI Auto-pay</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {walletData.transactions.map(txn => (
            <div key={txn.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  txn.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {txn.type === 'credit' ? (
                    <Plus className="text-green-400" size={24} />
                  ) : (
                    <TrendingUp className="text-red-400" size={24} />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{txn.description}</p>
                  <p className="text-slate-400 text-sm">{txn.date} • {txn.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  txn.type === 'credit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  txn.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incentive Programs */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">💰 Incentive Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-purple-200 text-sm mb-1">Cashback Earned</p>
            <p className="text-3xl font-bold">₹25,000</p>
            <p className="text-purple-200 text-xs mt-1">5% on total spend</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-purple-200 text-sm mb-1">Loyalty Bonus</p>
            <p className="text-3xl font-bold">₹10,000</p>
            <p className="text-purple-200 text-xs mt-1">Quarterly reward</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-purple-200 text-sm mb-1">Referral Rewards</p>
            <p className="text-3xl font-bold">₹5,000</p>
            <p className="text-purple-200 text-xs mt-1">2 brands referred</p>
          </div>
        </div>
      </div>
    </div>
  );
}
