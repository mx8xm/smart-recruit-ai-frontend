import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';

const JobCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty lines (whitespace only) from the description
    const cleanDescription = formData.description
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');

    const payload = {
        ...formData,
        description: cleanDescription
    };

    try {
      const response = await apiClient.post(ENDPOINTS.JOBS.CREATE, payload);
      navigate(`/jobs/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create job", error);
      alert("Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      
      {/* Header Area - Matched with JobDetailPage */}
      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <nav className="flex items-center text-sm font-medium text-slate-400 gap-2">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Jobs</Link>
            <Icon name="chevron_right" className="h-3 w-3" />
            <span className="text-slate-600 dark:text-slate-200">Create</span>
          </nav>
          
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              Post a New Job
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Create a new opportunity to start matching candidates.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          {/* Glass Card */}
          <form onSubmit={handleSubmit} className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-blue-400 to-primary-500 opacity-70"></div>

            <div className="space-y-8">
              
              {/* Job Title Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 text-lg font-medium shadow-sm"
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Icon name="title" className="h-5 w-5" />
                    </div>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-primary-500 font-medium bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">Markdown Supported</span>
                </div>
                <div className="relative">
                    <textarea 
                        required
                        rows={15}
                        className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 leading-relaxed shadow-sm resize-none font-mono text-sm"
                        placeholder="# Role Overview&#10;Describe the responsibilities...&#10;&#10;# Requirements&#10;- Skill 1&#10;- Skill 2"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                    <>
                        <Loader size="small" color="white" />
                        <span>Creating...</span>
                    </>
                ) : (
                    <>
                        <Icon name="send" className="h-4 w-4" />
                        <span>Publish Job</span>
                    </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Tips */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl p-1 bg-gradient-to-r from-primary-500/20 to-blue-500/20">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[22px] p-6 border border-white/20 dark:border-slate-700/50 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                  <Icon name="auto_awesome" className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  AI Scoring Tips
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Our AI engine matches candidates based on semantic meaning. To get the best results:
                </p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <Icon name="check_circle" className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>Be specific about required tech stacks (e.g., "React", "Python").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="check_circle" className="mt-0.5 h-4 w-4 text-green-500" />
                    <span>Include necessary soft skills.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="cancel" className="mt-0.5 h-4 w-4 text-red-500" />
                    <span>Avoid vague corporate buzzwords.</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCreatePage;
