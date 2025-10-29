import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  if (currentPage === 'dashboard') {
    return <Dashboard onBackToHome={() => setCurrentPage('landing')} />;
  }

  return <LandingPage onEnterDashboard={() => setCurrentPage('dashboard')} />;
}
