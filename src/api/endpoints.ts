const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultApiBaseUrl = import.meta.env.DEV ? 'http://localhost:8000' : '';

export const API_BASE_URL = (envApiBaseUrl || defaultApiBaseUrl).replace(/\/+$/, '');

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
  },
  JOBS: {
    LIST: '/api/v1/jobs/',
    CREATE: '/api/v1/jobs/',
    DETAIL: (id: string) => `/api/v1/jobs/${id}`,
    UPDATE: (id: string) => `/api/v1/jobs/${id}`,
    DELETE: (id: string) => `/api/v1/jobs/${id}`,
    STATISTICS: (id: string) => `/api/v1/jobs/${id}/statistics`,
  },
  APPLICATIONS: {
    UPLOAD: (jobId: string) => `/api/v1/applications/${jobId}/upload`,
    LIST: (jobId: string) => `/api/v1/applications/${jobId}/applications`,
    DETAIL: (appId: string) => `/api/v1/applications/application/${appId}`,
    DELETE: (appId: string) => `/api/v1/applications/application/${appId}`,
  }
};
