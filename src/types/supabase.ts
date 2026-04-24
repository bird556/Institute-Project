export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          cover_path: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          search_vector: unknown
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          cover_path?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          cover_path?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          cover_path: string | null
          created_at: string | null
          description: string
          event_date: string
          external_url: string | null
          id: string
          location: string | null
          published: boolean
          search_vector: unknown
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_path?: string | null
          created_at?: string | null
          description?: string
          event_date: string
          external_url?: string | null
          id?: string
          location?: string | null
          published?: boolean
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_path?: string | null
          created_at?: string | null
          description?: string
          event_date?: string
          external_url?: string | null
          id?: string
          location?: string | null
          published?: boolean
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_editions: {
        Row: {
          cover_path: string | null
          created_at: string | null
          id: string
          intro: string
          published: boolean
          published_at: string | null
          search_vector: unknown
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_path?: string | null
          created_at?: string | null
          id?: string
          intro?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_path?: string | null
          created_at?: string | null
          id?: string
          intro?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_submissions: {
        Row: {
          abstract: string | null
          admin_note: string | null
          contact_email: string | null
          content: string
          created_at: string | null
          deadline: string | null
          edition_id: string | null
          id: string
          institution: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          search_vector: unknown
          sort_order: number
          status: Database["public"]["Enums"]["submission_status"]
          submitter_email: string
          submitter_name: string
          submitter_role: string | null
          title: string
          type: Database["public"]["Enums"]["submission_type"]
          updated_at: string | null
        }
        Insert: {
          abstract?: string | null
          admin_note?: string | null
          contact_email?: string | null
          content?: string
          created_at?: string | null
          deadline?: string | null
          edition_id?: string | null
          id?: string
          institution?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_vector?: unknown
          sort_order?: number
          status?: Database["public"]["Enums"]["submission_status"]
          submitter_email: string
          submitter_name: string
          submitter_role?: string | null
          title: string
          type: Database["public"]["Enums"]["submission_type"]
          updated_at?: string | null
        }
        Update: {
          abstract?: string | null
          admin_note?: string | null
          contact_email?: string | null
          content?: string
          created_at?: string | null
          deadline?: string | null
          edition_id?: string | null
          id?: string
          institution?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_vector?: unknown
          sort_order?: number
          status?: Database["public"]["Enums"]["submission_status"]
          submitter_email?: string
          submitter_name?: string
          submitter_role?: string | null
          title?: string
          type?: Database["public"]["Enums"]["submission_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_submissions_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "newsletter_editions"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content: string
          id: string
          page: string
          section: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          id?: string
          page: string
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          page?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_path: string | null
          name: string
          published: boolean
          sort_order: number
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_path?: string | null
          name: string
          published?: boolean
          sort_order?: number
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_path?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      reading_list: {
        Row: {
          author: string | null
          cover_path: string | null
          created_at: string | null
          description: string | null
          external_url: string | null
          id: string
          published: boolean
          search_vector: unknown
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          cover_path?: string | null
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          published?: boolean
          search_vector?: unknown
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          cover_path?: string | null
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          published?: boolean
          search_vector?: unknown
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      wellness_posts: {
        Row: {
          content: string
          cover_path: string | null
          created_at: string | null
          doc_path: string | null
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          search_vector: unknown
          slug: string
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string
          cover_path?: string | null
          created_at?: string | null
          doc_path?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug: string
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          cover_path?: string | null
          created_at?: string | null
          doc_path?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      submission_status: "pending" | "approved" | "rejected"
      submission_type: "research_call" | "research_note" | "commentary"
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
    Enums: {
      submission_status: ["pending", "approved", "rejected"],
      submission_type: ["research_call", "research_note", "commentary"],
    },
  },
} as const
