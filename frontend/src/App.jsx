import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BrandDashboard from './pages/BrandDashboard';
import BrandAnalytics from './pages/BrandAnalytics';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import BrandCampaigns from './pages/BrandCampaigns';
import Products from './pages/Products';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BehavioralIntelligence from './pages/intelligence/Behavioral';
import VisualIntelligence from './pages/intelligence/Visual';
import VoiceIntelligence from './pages/intelligence/Voice';
import PredictiveIntelligence from './pages/intelligence/Predictive';
import SocialMedia from './pages/social/SocialMedia';
import Audiences from './pages/social/Audiences';
import SocialAnalytics from './pages/social/Analytics';
import IntentDashboard from './pages/intent/IntentDashboard';
import HighIntentUsers from './pages/intent/HighIntentUsers';
import EventIngestion from './pages/intent/EventIngestion';
import CreateAudience from './pages/intent/CreateAudience';
import MasterDashboard from './pages/aggregator/MasterDashboard';
import AttributionDashboard from './pages/AttributionDashboard';
import AdApproval from './pages/AdApproval';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAggregatorAdmin = user?.username === 'zepto' || user?.username === 'admin';
  const isBrandUser = !isAggregatorAdmin;
  const isLoggedIn = !!localStorage.getItem('access_token');
  
  const showHeader = isLoggedIn && location.pathname !== '/login';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {isAggregatorAdmin ? <MasterDashboard /> : <BrandDashboard />}
            </ProtectedRoute>
          } 
        />

        {/* Intent Intelligence - Aggregator Only */}
        {/* Brand Dashboard Routes */}
        <Route 
          path="/brand/:brandName/dashboard" 
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/:brandName/analytics" 
          element={
            <ProtectedRoute>
              <BrandAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/:brandName/campaigns" 
          element={
            <ProtectedRoute>
              <BrandCampaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/:brandName/campaigns/create" 
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          } 
        />
        
                <Route 
          path="/intent" 
          element={
            <ProtectedRoute>
              <IntentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intent/high-intent" 
          element={
            <ProtectedRoute>
              <HighIntentUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intent/events" 
          element={
            <ProtectedRoute>
              <EventIngestion />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intent/audiences" 
          element={
            <ProtectedRoute>
              <CreateAudience />
            </ProtectedRoute>
          } 
        />

        {/* Ad Approval - Aggregator Only */}
        <Route 
          path="/ad-approval" 
          element={
            <ProtectedRoute>
              <AdApproval />
            </ProtectedRoute>
          } 
        />

        {/* Analytics - Available to All */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/attribution" 
          element={
            <ProtectedRoute>
              <AttributionDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Campaigns */}
        <Route 
          path="/campaigns" 
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/campaigns/create" 
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* Intelligence Modules */}
        <Route 
          path="/intelligence/behavioral" 
          element={
            <ProtectedRoute>
              <BehavioralIntelligence />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intelligence/visual" 
          element={
            <ProtectedRoute>
              <VisualIntelligence />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intelligence/voice" 
          element={
            <ProtectedRoute>
              <VoiceIntelligence />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intelligence/predictive" 
          element={
            <ProtectedRoute>
              <PredictiveIntelligence />
            </ProtectedRoute>
          } 
        />

        {/* Social Media Integration */}
        <Route 
          path="/social" 
          element={
            <ProtectedRoute>
              <SocialMedia />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/social/audiences" 
          element={
            <ProtectedRoute>
              <Audiences />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/social/analytics" 
          element={
            <ProtectedRoute>
              <SocialAnalytics />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
