import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import DashboardContent from '../components/dashboard/Dashboard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} onLogout={handleLogout} />
      <DashboardContent />
    </div>
  );
}
