// Auto-generated from the Supabase schema (project: household-dashboard).
// Regenerate with: supabase gen types typescript --project-id llbgaxlqtmqrixktaits > src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          all_day: boolean
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          external_id: string | null
          id: string
          location: string | null
          source: string
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          source?: string
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          source?: string
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      commitments: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          id: string
          owner_id: string
          source: string
          source_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          owner_id?: string
          source?: string
          source_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          owner_id?: string
          source?: string
          source_id?: string | null
          status?: string
        }
        Relationships: []
      }
      context_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          owner_id: string
          related_feature: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          owner_id?: string
          related_feature?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          owner_id?: string
          related_feature?: string | null
        }
        Relationships: []
      }
      daily_recaps: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          recap_date: string
          summary: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id?: string
          recap_date?: string
          summary?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          recap_date?: string
          summary?: string
        }
        Relationships: []
      }
      dispatch_flags: {
        Row: {
          created_at: string
          gmail_message_id: string
          id: string
          owner_id: string
          received_at: string | null
          snippet: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          gmail_message_id: string
          id?: string
          owner_id?: string
          received_at?: string | null
          snippet?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          gmail_message_id?: string
          id?: string
          owner_id?: string
          received_at?: string | null
          snippet?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          activity: string
          created_at: string
          duration_minutes: number | null
          id: string
          log_date: string
          notes: string | null
          owner_id: string
        }
        Insert: {
          activity: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          log_date?: string
          notes?: string | null
          owner_id?: string
        }
        Update: {
          activity?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          log_date?: string
          notes?: string | null
          owner_id?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          owner_id: string
          started_at: string
          task_label: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          owner_id?: string
          started_at?: string
          task_label?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          owner_id?: string
          started_at?: string
          task_label?: string | null
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          log_date: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          owner_id?: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          archived: boolean
          color: string
          created_at: string
          id: string
          name: string
          owner_id: string
          target_per_week: number
        }
        Insert: {
          archived?: boolean
          color?: string
          created_at?: string
          id?: string
          name: string
          owner_id?: string
          target_per_week?: number
        }
        Update: {
          archived?: boolean
          color?: string
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          target_per_week?: number
        }
        Relationships: []
      }
      household_members: {
        Row: {
          created_at: string
          display_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          entry_date: string
          id: string
          mood: string | null
          owner_id: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string | null
          owner_id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string | null
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          created_at: string
          description: string
          id: string
          meal_date: string
          meal_type: string
          owner_id: string
          planned: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          meal_date?: string
          meal_type: string
          owner_id?: string
          planned?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          meal_date?: string
          meal_type?: string
          owner_id?: string
          planned?: boolean
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          owner_id: string
          pinned: boolean
          tags: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          owner_id?: string
          pinned?: boolean
          tags?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          owner_id?: string
          pinned?: boolean
          tags?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token_secret_id: string | null
          created_at: string
          expires_at: string | null
          external_account_email: string | null
          id: string
          owner_id: string
          provider: string
          refresh_token_secret_id: string | null
          scope: string | null
          updated_at: string
        }
        Insert: {
          access_token_secret_id?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_email?: string | null
          id?: string
          owner_id?: string
          provider: string
          refresh_token_secret_id?: string | null
          scope?: string | null
          updated_at?: string
        }
        Update: {
          access_token_secret_id?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_email?: string | null
          id?: string
          owner_id?: string
          provider?: string
          refresh_token_secret_id?: string | null
          scope?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading_list: {
        Row: {
          author: string | null
          created_at: string
          finished_at: string | null
          id: string
          notes: string | null
          owner_id: string
          rating: number | null
          started_at: string | null
          status: string
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          finished_at?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          rating?: number | null
          started_at?: string | null
          status?: string
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string
          finished_at?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          rating?: number | null
          started_at?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          owner_id: string
          recurrence: string
          remind_at: string
          title: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          owner_id?: string
          recurrence?: string
          remind_at: string
          title: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          owner_id?: string
          recurrence?: string
          remind_at?: string
          title?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          notes: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_household_member: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
