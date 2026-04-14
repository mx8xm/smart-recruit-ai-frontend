import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { AuthResponse } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import logoUrl from '../../assets/logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      login(response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#020617] relative overflow-hidden transition-colors duration-500 font-sans selection:bg-primary-500/30">
      
      {/* --- Background Ambient Blobs --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      {/* --- Theme Toggle (Black & White) --- */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-900 dark:text-white hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        {isDark ? (
          <Icon name="light_mode" className="h-6 w-6 text-white" />
        ) : (
          <Icon name="dark_mode" className="h-6 w-6 text-slate-900" />
        )}
      </button>

      {/* --- Main Glass Card --- */}
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4">
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-slate-700/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"></div>
        
        <div className="relative z-20 flex flex-col items-center">
           
           {/* Logo Image */}
           <div className="mb-6 filter drop-shadow-2xl">
              <img 
                src={logoUrl}
                alt="Logo" 
                className="w-32 h-32 object-contain" 
              />
           </div>

           {/* Header */}
           <div className="text-center mb-8 w-full">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Enter your credentials to access the portal.</p>
           </div>

           {/* Error Message */}
           {error && (
            <div className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                <Icon name="error" className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>
            </div>
           )}

           {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-5 w-full">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ml-1">Username</label>
                <div className="relative group">
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3.5 px-4 pl-11 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Type your username"
                    />
                    <Icon name="person" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                    <input 
                      type="password" 
                      required
                      className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3.5 px-4 pl-11 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Icon name="lock" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                    <Loader size="small" color="white" />
                ) : (
                    <>
                      <span>Sign In</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                    </>
                )}
              </button>
           </form>

           {/* Footer */}
           <div className="w-full mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                New here?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                  Create an account
                </Link>
              </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
