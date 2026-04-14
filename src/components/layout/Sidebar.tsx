import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';
import logoUrl from '../../assets/logo.png';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItemClass = (path: string) => `
    relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 mb-2 group
    ${isActive(path) 
      ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
  `;

  return (
    <aside 
      className={`fixed left-0 top-0 h-full flex flex-col transition-all duration-300 z-30 
      ${collapsed ? 'w-20 items-center' : 'w-72'}
      backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-r border-slate-200/50 dark:border-slate-800/50
      `}
    >
      {/* Header / Logo */}
      <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-24`}>
        <div className="flex items-center gap-3">
          {/* Replaced Icon with Logo Image */}
          <div className="flex items-center justify-center filter drop-shadow-md">
             <img 
               src={logoUrl}
               alt="Smart Recruit Logo" 
               className="w-10 h-10 object-contain"
             />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Smart<span className="text-primary-600 dark:text-primary-400">Recruit</span>
              </h1>
            </div>
          )}
        </div>
        
        {!collapsed && (
           <button onClick={() => setCollapsed(true)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
             <Icon name="chevron_left" className="h-4 w-4" />
           </button>
        )}
      </div>

      {/* Collapse Trigger (When closed) */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mb-6 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-500 transition-colors">
           <Icon name="chevron_right" className="h-5 w-5" />
        </button>
      )}
      
      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-3 w-full flex flex-col items-center' : 'px-6'}`}>
        
        {!collapsed && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>}
        
        <Link to="/dashboard" className={navItemClass('/dashboard')} title="Dashboard">
          <Icon name="dashboard" className="h-5 w-5" />
          {!collapsed && <span className="font-medium text-sm">Dashboard</span>}
          {isActive('/dashboard') && !collapsed && (
             <span className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"></span>
          )}
        </Link>
        
        <Link to="/jobs/new" className={navItemClass('/jobs/new')} title="Post a Job">
           <Icon name="add_circle_outline" className="h-5 w-5" />
           {!collapsed && <span className="font-medium text-sm">Post New Job</span>}
           {isActive('/jobs/new') && !collapsed && (
             <span className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"></span>
          )}
        </Link>

      </nav>
      
      {/* Footer / User Profile Snippet */}
      <div className="p-4 m-4 mb-6">
         <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-700">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.full_name || user?.username || 'User'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate" title={user?.email}>
                  {user?.email || 'No email'}
                </div>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
