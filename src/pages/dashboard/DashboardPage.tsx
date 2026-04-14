import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { Job, DashboardStats } from '../../types';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';

interface JobWithDerivedStats extends Job {
  derivedStats?: DashboardStats;
}

const DashboardPage = () => {
  const [jobs, setJobs] = useState<JobWithDerivedStats[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [aggregatedStats, setAggregatedStats] = useState<DashboardStats>({
    totalApplications: 0,
    accepted: 0,
    rejected: 0,
    avgScore: 0,
    processing: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });

  const handleDeleteJob = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(!window.confirm("Are you sure you want to delete this job? All applications will be lost.")) return;
    
    try {
      await apiClient.delete(ENDPOINTS.JOBS.DELETE(id.toString()));
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error("Failed to delete job", error);
      alert("Failed to delete job");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchJobsAndStats = async () => {
      try {
        setLoading(true);
        // 1. Fetch Job List
        const listResponse = await apiClient.get<Job[]>(ENDPOINTS.JOBS.LIST);
        const basicJobs = listResponse.data;

        if (!isMounted) return;

        // 2. Fetch Details for each job
        const detailedJobs = await Promise.all(
          basicJobs.map(async (job) => {
            try {
              const detailResponse = await apiClient.get<Job>(ENDPOINTS.JOBS.DETAIL(job.id.toString()));
              const detailedJob = detailResponse.data;
              const apps = detailedJob.applications || [];
              
              // Calculate Stats
              const total = apps.length;
              let accepted = 0;
              let rejected = 0;
              let scoreSum = 0;
              let scoredCount = 0;
              let processing = 0;
              let pending = 0;
              let completed = 0;
              let failed = 0;

              apps.forEach(app => {
                if (app.status === 'completed') completed++;
                if (app.status === 'processing') processing++;
                if (app.status === 'pending') pending++;
                if (app.status === 'failed') failed++;

                if (app.match_score !== null && app.status === 'completed') {
                  scoreSum += app.match_score;
                  scoredCount++;
                  if (app.match_score >= 0.45) accepted++;
                  else rejected++;
                }
              });

              const stats: DashboardStats = {
                totalApplications: total,
                accepted,
                rejected,
                avgScore: scoredCount > 0 ? scoreSum / scoredCount : 0,
                processing,
                pending,
                completed,
                failed
              };

              return { ...detailedJob, derivedStats: stats };
            } catch (e) {
              console.error(`Failed to fetch details for job ${job.id}`, e);
              return { ...job, derivedStats: undefined };
            }
          })
        );

        if (isMounted) {
            setJobs(detailedJobs);

            // Aggregate Global Stats
            const globalStats: DashboardStats = {
                totalApplications: 0,
                accepted: 0,
                rejected: 0,
                avgScore: 0,
                processing: 0,
                pending: 0,
                completed: 0,
                failed: 0
            };

            let globalScoreSum = 0;
            let globalScoredCount = 0;

            detailedJobs.forEach(j => {
                if(j.derivedStats) {
                    globalStats.totalApplications += j.derivedStats.totalApplications;
                    globalStats.accepted += j.derivedStats.accepted;
                    globalStats.rejected += j.derivedStats.rejected;
                    globalStats.processing += j.derivedStats.processing;
                    globalStats.pending += j.derivedStats.pending;
                    globalStats.completed += j.derivedStats.completed;
                    globalStats.failed += j.derivedStats.failed;

                    if (j.derivedStats.avgScore > 0) {
                         globalScoreSum += (j.derivedStats.avgScore * (j.applications?.filter(a => a.match_score !== null).length || 0));
                         globalScoredCount += (j.applications?.filter(a => a.match_score !== null).length || 0);
                    }
                }
            });

            globalStats.avgScore = globalScoredCount > 0 ? globalScoreSum / globalScoredCount : 0;
            setAggregatedStats(globalStats);
            setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching dashboard data", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchJobsAndStats();

    return () => { isMounted = false; };
  }, []);

  const acceptanceRate = aggregatedStats.completed > 0 
    ? (aggregatedStats.accepted / aggregatedStats.completed) * 100 
    : 0;

  // Donut Chart Config
  const size = 200;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const acceptedOffset = circumference - (acceptanceRate / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time recruitment analytics.</p>
        </div>
        <Link 
          to="/jobs/new" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center gap-2"
        >
          <Icon name="add" className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Jobs', value: jobs.length, sub: 'Positions open', color: 'blue', icon: 'work' },
           { label: 'Total Apps', value: aggregatedStats.totalApplications, sub: 'Candidates', color: 'indigo', icon: 'people' },
           { label: 'Avg Match', value: `${(aggregatedStats.avgScore * 100).toFixed(0)}%`, sub: 'Relevance', color: 'violet', icon: 'auto_awesome' },
           { label: 'Qualified', value: aggregatedStats.accepted, sub: '> 45% Match', color: 'emerald', icon: 'check_circle' },
         ].map((stat, i) => {
           const toneClass = {
             blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
             indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
             violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
             emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
           }[stat.color];

           return (
           <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${toneClass}`}>
                   <Icon name={stat.icon} className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                 {loading ? <span className="text-2xl animate-pulse">...</span> : stat.value}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                   {stat.sub}
                </span>
              </div>
           </div>
         )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Applications per Job Chart */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
           <div className="mb-6 flex justify-between items-center">
             <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Applications by Job</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume across active postings</p>
             </div>
             <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Top Active</span>
           </div>
           
           <div className="flex-1 w-full flex items-end justify-between gap-4 px-2 pb-2 relative border-b border-slate-200 dark:border-slate-700">
             {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader size="medium" />
                </div>
             ) : jobs.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-500">No data available</div>
             ) : (
                jobs.slice(0, 8).map((job) => {
                  const val = job.derivedStats?.totalApplications || 0;
                  const maxVal = Math.max(...jobs.map(j => j.derivedStats?.totalApplications || 0), 10);
                  const heightPct = (val / maxVal) * 100;
                  
                  return (
                    <div key={job.id} className="flex-1 h-full flex flex-col items-center justify-end group gap-3">
                      
                      {/* Bar Container */}
                      <div className="w-full h-full flex items-end justify-center relative">
                         <div className="absolute inset-0 border-r border-slate-100/5 dark:border-slate-700/5 last:border-0 pointer-events-none"></div>
                         
                         <div 
                           style={{ height: `${val === 0 ? 2 : heightPct}%` }} 
                           className={`w-full max-w-[40px] min-h-[4px] rounded-t-lg transition-all duration-500 ease-out relative
                             ${val === 0 ? 'bg-slate-200 dark:bg-slate-800' : 'bg-gradient-to-t from-primary-600 to-primary-400 dark:from-primary-700 dark:to-primary-500 shadow-lg shadow-primary-500/20 group-hover:to-primary-300'}
                           `}
                         >
                           {/* Tooltip */}
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-10 pointer-events-none shadow-xl">
                             {val} Apps
                             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                           </div>
                         </div>
                      </div>

                      {/* Label */}
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center truncate w-full max-w-[80px]" title={job.title}>
                        {job.title.split(' ')[0]}
                      </span>
                    </div>
                  );
                })
             )}
           </div>
        </div>

        {/* Qualification Rate Donut Chart */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Qualification Rate</h3>
           
           <div className="flex-1 flex items-center justify-center min-h-0">
             {loading ? (
                <Loader size="medium" />
             ) : aggregatedStats.completed === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                        <Icon name="data_usage" className="h-8 w-8 text-slate-400" />
                    </div>
                    <span className="text-sm">No processed CVs</span>
                </div>
             ) : (
               <div className="relative flex items-center justify-center">
                 {/* SVG Chart */}
                 <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 overflow-visible">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(16, 185, 129, 0.3)" />
                        </filter>
                    </defs>
                    
                    <circle 
                        cx={center} cy={center} r={radius} 
                        stroke="currentColor" strokeWidth={strokeWidth} 
                        fill="transparent" 
                        className="text-slate-100 dark:text-slate-800" 
                    />
                    
                    <circle 
                      cx={center} cy={center} r={radius} 
                      stroke="url(#chartGradient)" 
                      strokeWidth={strokeWidth} 
                      fill="transparent" 
                      strokeDasharray={circumference}
                      strokeDashoffset={acceptedOffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{ filter: 'url(#shadow)' }}
                    />
                 </svg>
                 
                 {/* Center Label */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                        {acceptanceRate.toFixed(1)}<span className="text-xl align-top text-slate-500 font-bold ml-0.5">%</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Qualified</span>
                 </div>
               </div>
             )}
           </div>

           <div className="w-full space-y-3 mt-4">
             <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
               <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                 <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> Total Processed
               </span>
               <span className="font-bold text-slate-900 dark:text-white">{aggregatedStats.completed}</span>
             </div>
             <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
               <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2 font-medium">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"></span> Qualified ({'>'}45%)
               </span>
               <span className="font-bold text-emerald-700 dark:text-emerald-400">{aggregatedStats.accepted}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center bg-white/40 dark:bg-slate-900/20">
           <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Jobs</h3>
           <Link to="/jobs/new" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Job Title</th>
                <th className="px-6 py-4 font-semibold">Date Posted</th>
                <th className="px-6 py-4 font-semibold">Applications</th>
                <th className="px-6 py-4 font-semibold">Avg Match</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                   <div className="flex justify-center"><Loader size="small" /></div>
                </td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No jobs found. Create one to get started.</td></tr>
              ) : (
                jobs.slice(0, 10).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {job.derivedStats?.totalApplications || 0}
                         </span>
                         {(job.derivedStats?.processing || 0) > 0 && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Processing..."></span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       {job.derivedStats?.avgScore ? (
                         <span className={`text-xs font-bold px-2 py-1 rounded-md ${job.derivedStats.avgScore >= 0.7 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : job.derivedStats.avgScore >= 0.45 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                           {(job.derivedStats.avgScore * 100).toFixed(0)}%
                         </span>
                       ) : <span className="text-slate-400 text-xs">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <Link to={`/jobs/${job.id}`} className="px-3 py-1.5 rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40 text-xs font-bold transition-colors">
                        View
                      </Link>
                      <button 
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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
    </div>
  );
};

export default DashboardPage;
