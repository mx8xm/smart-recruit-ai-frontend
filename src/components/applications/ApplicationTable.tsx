import React, { useState } from 'react';
import { Application } from '../../types';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Icon from '../common/Icon';

interface ApplicationTableProps {
  applications: Application[];
  onRefresh: () => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await apiClient.delete(ENDPOINTS.APPLICATIONS.DELETE(id.toString()));
      onRefresh();
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete application");
    }
  };

  const filteredApps = applications.filter(app => 
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const sortedApps = [...filteredApps].sort((a, b) => {
    const scoreA = a.match_score || 0;
    const scoreB = b.match_score || 0;
    return sortOrder === 'desc' 
      ? scoreB - scoreA 
      : scoreA - scoreB;
  });

  // Helper for Circular Progress
  const CircularScore = ({ score }: { score: number | null }) => {
    if (score === null) return <span className="text-slate-400 text-xs">-</span>;
    
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.round(score * 100);
    const offset = circumference - (percent / 100) * circumference;
    
    let color = 'text-emerald-500';
    if(percent < 45) color = 'text-red-500';
    else if(percent < 70) color = 'text-yellow-500';

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-700" />
          <circle 
            cx="24" cy="24" r={radius} 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="transparent" 
            className={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-slate-900 dark:text-white">{percent}%</span>
      </div>
    );
  };

  // Helper for Avatar
  const Avatar = ({ name }: { name: string | null }) => {
    const displayName = name || 'CV';
    const initials = displayName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    const bgColors = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-sky-600'];
    const color = bgColors[displayName.length % bgColors.length];

    return (
      <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
      {/* Table Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <Icon name="group" className="h-5 w-5 text-primary-500" />
          Candidates ({applications.length})
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  className="pl-10 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-48 py-2 outline-none placeholder:text-slate-500" 
                  placeholder="Search..." 
                  type="text"
                />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm hover:border-primary-500 transition-colors"
            >
              <span>Score</span>
              <span className="text-primary-600 font-bold">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 font-semibold">Candidate</th>
              <th className="px-6 py-4 font-semibold text-center">Match Score</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Processed</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedApps.length === 0 ? (
               <tr>
                 <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Icon name="inbox" className="mb-2 h-10 w-10" />
                      <p>No applications found.</p>
                    </div>
                 </td>
               </tr>
            ) : (
              sortedApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={app.candidate_name} />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {app.candidate_name && app.candidate_name !== 'Unknown' ? app.candidate_name : <span className="italic text-slate-500">Extracting name...</span>}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]" title={app.original_filename}>
                          {app.original_filename}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <CircularScore score={app.match_score} />
                  </td>
                  <td className="px-6 py-4">
                     {app.status === 'completed' && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full border border-green-200 dark:border-green-800">
                           Completed
                        </span>
                     )}
                     {app.status === 'processing' && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1 w-fit">
                           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Processing
                        </span>
                     )}
                     {app.status === 'failed' && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full border border-red-200 dark:border-red-800" title={app.error_message || "Unknown error"}>
                           Failed
                        </span>
                     )}
                     {app.status === 'pending' && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                           Pending
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {app.processed_at ? new Date(app.processed_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(app.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Application"
                    >
                      <Icon name="delete" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;
