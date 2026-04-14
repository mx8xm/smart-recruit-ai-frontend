export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Application {
  id: number;
  job_id: number;
  original_filename: string;
  cv_file_path: string;
  candidate_name: string | null;
  match_score: number | null;
  extracted_text: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  created_at: string;
  created_by?: number;
  application_count?: number;
  applications?: Application[];
}

// Derived statistics for frontend use
export interface DashboardStats {
  totalApplications: number;
  accepted: number; // Score > 0.45
  rejected: number; // Score < 0.45
  avgScore: number;
  processing: number;
  pending: number;
  completed: number;
  failed: number;
}
