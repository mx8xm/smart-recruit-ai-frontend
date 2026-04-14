import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  // Sidebar is now default closed (true)
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans bg-slate-50 dark:bg-[#020617] transition-colors duration-500 relative selection:bg-indigo-500/30">
      
      {/* --- Ambient Background Blobs (Fixed) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 dark:bg-indigo-500/10 blur-[100px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-out ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <Topbar />
        <main className="flex-1 px-8 pb-8 max-w-[1600px] mx-auto w-full mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;