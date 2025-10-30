import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';

export default function CampaignOverview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      <div className="text-center">
        <Target className="mx-auto mb-4 text-blue-400" size={64} />
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Overview</h2>
        <p className="text-slate-400">Coming soon...</p>
      </div>
    </div>
  );
}
