export default function Header({ user, onLogout }) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">PATTERNOS</h1>
          <p className="text-sm text-slate-400">Retail Media Intelligence OS</p>
        </div>
        
        <nav className="flex items-center gap-8">
          <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Analytics</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Campaigns</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Settings</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white font-medium">{user?.company_name || 'User'}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
