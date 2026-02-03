// Database types for Supabase
// These types can be auto-generated with: npm run supabase:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          country_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      progress: {
        Row: {
          id: string
          user_id: string
          chapter_id: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_id: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_id?: number
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          chapter_id: number
          score: number
          total_questions: number
          passed: boolean
          duration_seconds: number | null
          attempt_number: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_id: number
          score: number
          total_questions: number
          passed: boolean
          duration_seconds?: number | null
          attempt_number?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_id?: number
          score?: number
          total_questions?: number
          passed?: boolean
          duration_seconds?: number | null
          attempt_number?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      leaderboard_cache: {
        Row: {
          user_id: string | null
          display_name: string | null
          avatar_url: string | null
          country_code: string | null
          completed_chapters: number | null
          completion_percentage: number | null
          global_rank: number | null
        }
        Relationships: []
      }
      user_best_quiz_scores: {
        Row: {
          user_id: string | null
          chapter_id: number | null
          score: number | null
          total_questions: number | null
          passed: boolean | null
          attempt_number: number | null
          created_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      refresh_leaderboard_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_next_attempt_number: {
        Args: { p_user_id: string; p_chapter_id: number }
        Returns: number
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Progress = Database['public']['Tables']['progress']['Row']
export type ProgressInsert = Database['public']['Tables']['progress']['Insert']

export type LeaderboardEntry = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  country_code: string | null
  completed_chapters: number
  completion_percentage: number
  global_rank: number
}

export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
export type QuizAttemptInsert = Database['public']['Tables']['quiz_attempts']['Insert']

export type BestQuizScore = {
  user_id: string
  chapter_id: number
  score: number
  total_questions: number
  passed: boolean
  attempt_number: number
  created_at: string
}
