export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          full_name: string;
          tagline: string;
          bio: string;
          photo_url: string;
          hero_image_url: string;
          cv_url: string;
          email: string;
          phone: string | null;
          location: string;
          social_links: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          tagline: string;
          bio: string;
          photo_url?: string;
          hero_image_url?: string;
          cv_url?: string;
          email: string;
          phone?: string | null;
          location: string;
          social_links?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          tagline?: string;
          bio?: string;
          photo_url?: string;
          hero_image_url?: string;
          cv_url?: string;
          email?: string;
          phone?: string | null;
          location?: string;
          social_links?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          cover_image_url: string;
          gallery: string[];
          tech_stack: string[];
          project_url: string | null;
          repo_url: string | null;
          role: string;
          is_featured: boolean;
          status: "draft" | "published";
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          description?: string;
          cover_image_url?: string;
          gallery?: string[];
          tech_stack?: string[];
          project_url?: string | null;
          repo_url?: string | null;
          role?: string;
          is_featured?: boolean;
          status?: "draft" | "published";
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          description?: string;
          cover_image_url?: string;
          gallery?: string[];
          tech_stack?: string[];
          project_url?: string | null;
          repo_url?: string | null;
          role?: string;
          is_featured?: boolean;
          status?: "draft" | "published";
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiry_date: string | null;
          credential_id: string | null;
          credential_url: string | null;
          badge_image_url: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiry_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          badge_image_url?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string;
          expiry_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          badge_image_url?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
