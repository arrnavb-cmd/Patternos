import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { User, Building2, Mail, Phone, MapPin, Globe, Calendar, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const brand = localStorage.getItem('brand') || 'Brand';
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [isEditing, setIsEditing] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  const [profileData, setProfileData] = useState({
    companyName: brand + ' India',
    brandName: brand,
    email: 'nike@zepto.com',
    phone: '+91 98765 43210',
    gstin: '29ABCDE1234F1Z5',
    address: 'Embassy Tech Village, Outer Ring Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560103',
    country: 'India',
    website: 'www.nike.com',
    accountManager: 'Priya Sharma',
    accountType: 'Premium Brand Partner',
    memberSince: 'January 2024',
    billingEmail: 'billing@nike.com',
    taxId: 'PAN: ABCDE1234F'
  });

  return (
    <div className="min-h-screen bg-slate-900">
      
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Profile</h1>
            <p className="text-gray-400">Manage your account information and business details</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-4xl">N</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{profileData.companyName}</h2>
                <p className="text-gray-400 text-sm mb-4">{profileData.brandName}</p>
                <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                  {profileData.accountType}
                </span>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="text-sm">Member since {profileData.memberSince}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <User size={18} className="text-gray-500" />
                  <span className="text-sm">AM: {profileData.accountManager}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">Company Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={profileData.brandName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, brandName: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">GSTIN</label>
                  <input
                    type="text"
                    value={profileData.gstin}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, gstin: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tax ID (PAN)</label>
                  <input
                    type="text"
                    value={profileData.taxId}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, taxId: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Billing Email</label>
                  <input
                    type="email"
                    value={profileData.billingEmail}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, billingEmail: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Business Address</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                      isEditing ? 'border-blue-500' : 'border-slate-600'
                    } focus:outline-none focus:border-blue-500`}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                        isEditing ? 'border-blue-500' : 'border-slate-600'
                      } focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.state}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                      className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                        isEditing ? 'border-blue-500' : 'border-slate-600'
                      } focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={profileData.pincode}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                      className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                        isEditing ? 'border-blue-500' : 'border-slate-600'
                      } focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    <input
                      type="text"
                      value={profileData.country}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 border ${
                        isEditing ? 'border-blue-500' : 'border-slate-600'
                      } focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
