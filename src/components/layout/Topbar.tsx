import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../common/Icon';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="h-16 px-8 flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* Left: Search with polished style */}
        <div className="flex items-center gap-4 w-96">
           <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input 
                type="text" 
                className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-lg block pl-10 p-2 transition-all focus:bg-white dark:focus:bg-slate-950 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 outline-none placeholder:text-slate-400" 
                placeholder="Search jobs, candidates..." 
              />
           </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Button - Black/White Only */}
          <button 
              onClick={toggleTheme} 
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Toggle Theme"
          >
              {isDark ? (
                  <Icon name="light_mode" className="h-5 w-5 text-white" />
              ) : (
                  <Icon name="dark_mode" className="h-5 w-5 text-slate-900" />
              )}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.full_name || user?.username}</div>
                <div className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">Admin</div>
            </div>

            <button 
               onClick={handleLogout}
               className="group flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 dark:border-red-900/20"
               title="Logout"
            >
              <Icon name="logout" className="h-5 w-5 group-hover:ml-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
