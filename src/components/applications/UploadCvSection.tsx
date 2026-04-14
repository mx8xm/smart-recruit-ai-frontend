import React, { useState, useRef } from 'react';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Icon from '../common/Icon';

interface UploadCvSectionProps {
  jobId: string;
  onUploadSuccess: () => void;
}

const UploadCvSection: React.FC<UploadCvSectionProps> = ({ jobId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      await apiClient.post(ENDPOINTS.APPLICATIONS.UPLOAD(jobId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  return (
    <div 
      className={`relative h-full min-h-[350px] w-full rounded-3xl overflow-hidden transition-all duration-300 group
        ${dragActive 
          ? 'scale-[1.02] shadow-2xl ring-4 ring-primary-500/20' 
          : 'hover:shadow-xl hover:-translate-y-1'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Background Container with Glass Effect */}
      <div className={`absolute inset-0 transition-colors duration-300
         ${dragActive 
            ? 'bg-primary-50 dark:bg-primary-900/30' 
            : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl'}
      `}></div>
      
      {/* Border Layer (Dashed) */}
      <div className={`absolute inset-0 border-2 border-dashed rounded-3xl m-1 transition-colors duration-300
         ${dragActive 
            ? 'border-primary-500' 
            : 'border-slate-300 dark:border-slate-700 group-hover:border-primary-400 dark:group-hover:border-primary-600'}
      `}></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
        
        {uploading ? (
             <div className="flex flex-col items-center animate-fade-in">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="smart_toy" className="h-8 w-8 animate-pulse text-primary-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analyzing CVs...</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Our AI is extracting candidate data</p>
             </div>
        ) : (
            <label className="flex flex-col items-center cursor-pointer w-full">
                {/* Icon Circle */}
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-lg
                    ${dragActive 
                        ? 'bg-primary-500 text-white rotate-12 scale-110' 
                        : 'bg-white dark:bg-slate-800 text-primary-500 group-hover:bg-primary-500 group-hover:text-white'}
                `}>
                    <Icon name="cloud_upload" className="h-16 w-16" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">
                    {dragActive ? 'Drop it like it\'s hot!' : 'Upload CVs'}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8 leading-relaxed">
                    Drag and drop your <span className="font-semibold text-slate-700 dark:text-slate-200">PDF</span> or <span className="font-semibold text-slate-700 dark:text-slate-200">DOCX</span> files here to start the magic.
                </p>

                <div className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                    <Icon name="folder_open" className="h-4 w-4" />
                    <span>Browse Files</span>
                </div>
                
                <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </label>
        )}
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-400/20 transition-all"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none group-hover:bg-indigo-400/20 transition-all"></div>
    </div>
  );
};

export default UploadCvSection;
