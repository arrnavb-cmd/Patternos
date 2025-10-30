import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AggregatorLogin from './pages/AggregatorLogin';
import AggregatorDashboard from './pages/AggregatorDashboard';
import BrandManagement from './pages/BrandManagement';
import CampaignOverview from './pages/CampaignOverview';
import RevenueAnalytics from './pages/RevenueAnalytics';
import WhiteLabelSettings from './pages/WhiteLabelSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AggregatorLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AggregatorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brands" 
          element={
            <ProtectedRoute>
              <BrandManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/campaigns" 
          element={
            <ProtectedRoute>
              <CampaignOverview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/revenue" 
          element={
            <ProtectedRoute>
              <RevenueAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <WhiteLabelSettings />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
