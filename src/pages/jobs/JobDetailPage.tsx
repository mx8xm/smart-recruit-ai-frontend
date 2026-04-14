import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { Job, Application } from '../../types';
import UploadCvSection from '../../components/applications/UploadCvSection';
import ApplicationTable from '../../components/applications/ApplicationTable';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const pollingActive = useRef(false);

  const fetchData = useCallback(async () => {
    if (!jobId) return;
    try {
      const jobRes = await apiClient.get<Job>(ENDPOINTS.JOBS.DETAIL(jobId));
      setJob(jobRes.data);

      let currentApps: Application[] = [];
      if (jobRes.data.applications && Array.isArray(jobRes.data.applications)) {
        currentApps = jobRes.data.applications;
      } else {
        const appsRes = await apiClient.get<Application[]>(ENDPOINTS.APPLICATIONS.LIST(jobId));
        currentApps = appsRes.data;
      }
      setApps(currentApps);
      pollingActive.current = currentApps.some(a => a.status === 'processing' || a.status === 'pending');

    } catch (error) {
      console.error("Error loading job details", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(() => {
      if (pollingActive.current) {
        apiClient.get<Application[]>(ENDPOINTS.APPLICATIONS.LIST(jobId))
          .then(res => {
             setApps(res.data);
             pollingActive.current = res.data.some(a => a.status === 'processing' || a.status === 'pending');
          })
          .catch(() => {});
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [jobId]);

  const copyDescription = () => {
    if (job?.description) {
      navigator.clipboard.writeText(job.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader size="medium" className="mb-4" />
        <div className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading job details...</div>
    </div>
  );

  if (!job) return <div className="text-center py-20 text-red-500">Job not found</div>;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <nav className="flex items-center text-sm font-medium text-slate-400 gap-2">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Jobs</Link>
            <Icon name="chevron_right" className="h-3 w-3" />
            <span className="text-slate-600 dark:text-slate-200">Detail</span>
          </nav>
          
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Icon name="schedule" className="h-3.5 w-3.5 text-primary-500" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Icon name="fingerprint" className="h-3.5 w-3.5 text-primary-500" />
                    <span>ID: {job.id}</span>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-wider">
                    Active
                </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {/* Action buttons could go here */}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Premium Description Box */}
        <section className="xl:col-span-7 flex flex-col h-full">
           <div className="relative group rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary-500/30">
              
              {/* Header of the Box */}
              <div className="relative px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between bg-white/20 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Icon name="description" className="h-4 w-4 text-white" />
                    </div>
                    Job Description
                  </h2>
                  
                  <button 
                    onClick={copyDescription}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Icon name={copied ? 'check' : 'content_copy'} className="h-3.5 w-3.5" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
              </div>

              {/* Content */}
              <div className="p-8 min-h-[400px]">
                 <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                        {job.description}
                    </p>
                 </div>
              </div>
              
              {/* Footer Gradient Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
           </div>
        </section>

        {/* Right Column: Upload & Stats */}
        <section className="xl:col-span-5 flex flex-col gap-6">
           
           {/* Upload Section */}
           <div className="flex-1 min-h-[300px]">
               <UploadCvSection jobId={jobId!} onUploadSuccess={fetchData} />
           </div>

           {/* Info Card */}
           <div className="rounded-3xl p-1 bg-gradient-to-r from-primary-500/20 to-blue-500/20">
             <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[22px] p-6 border border-white/20 dark:border-slate-700/50">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-600 dark:text-primary-400">
                        <Icon name="auto_awesome" className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">AI Match Scoring</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Uploaded CVs are automatically parsed and scored against the job description. 
                            Results appear in the table below.
                        </p>
                    </div>
                </div>
             </div>
           </div>

        </section>
      </div>

      {/* Applications Table */}
      <div className="pt-4">
        <ApplicationTable applications={apps} onRefresh={fetchData} />
      </div>
    </div>
  );
};

export default JobDetailPage;
