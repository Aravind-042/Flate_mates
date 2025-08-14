export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_access_log: {
        Row: {
          accessed_at: string
          credits_used: number
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          accessed_at?: string
          credits_used?: number
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          accessed_at?: string
          credits_used?: number
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_access_log_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          listing_id: string | null
          participant_1: string
          participant_2: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          participant_1: string
          participant_2: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          participant_1?: string
          participant_2?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_1_fkey"
            columns: ["participant_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_fkey"
            columns: ["participant_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          related_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flat_listings: {
        Row: {
          address_line1: string
          address_line2: string | null
          amenities: string[] | null
          available_from: string | null
          bathrooms: number
          bedrooms: number
          boost_score: number | null
          brokerage_amount: number | null
          carpet_area_sqft: number | null
          contact_email: boolean | null
          contact_phone: boolean | null
          contact_whatsapp: boolean | null
          created_at: string | null
          current_occupants: number | null
          description: string | null
          featured_until: string | null
          floor_number: number | null
          furnishing_details: string[] | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_furnished: boolean | null
          landmark: string | null
          last_boosted_at: string | null
          lease_duration_months: number | null
          lifestyle_preferences: string[] | null
          location_id: string | null
          maintenance_charges: number | null
          max_occupants: number | null
          monthly_rent: number
          nearby_facilities: string[] | null
          owner_id: string
          parking_available: boolean | null
          parking_type: string | null
          preferred_age_max: number | null
          preferred_age_min: number | null
          preferred_contact_time: string | null
          preferred_gender:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          preferred_professions: string[] | null
          property_type: Database["public"]["Enums"]["property_type"]
          quality_score: number | null
          rent_includes: string[] | null
          response_rate: number | null
          search_vector: unknown | null
          security_deposit: number | null
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          total_floors: number | null
          total_rooms: number | null
          updated_at: string | null
          video_tour_url: string | null
          view_count: number | null
          virtual_tour_url: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          amenities?: string[] | null
          available_from?: string | null
          bathrooms?: number
          bedrooms?: number
          boost_score?: number | null
          brokerage_amount?: number | null
          carpet_area_sqft?: number | null
          contact_email?: boolean | null
          contact_phone?: boolean | null
          contact_whatsapp?: boolean | null
          created_at?: string | null
          current_occupants?: number | null
          description?: string | null
          featured_until?: string | null
          floor_number?: number | null
          furnishing_details?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_furnished?: boolean | null
          landmark?: string | null
          last_boosted_at?: string | null
          lease_duration_months?: number | null
          lifestyle_preferences?: string[] | null
          location_id?: string | null
          maintenance_charges?: number | null
          max_occupants?: number | null
          monthly_rent: number
          nearby_facilities?: string[] | null
          owner_id: string
          parking_available?: boolean | null
          parking_type?: string | null
          preferred_age_max?: number | null
          preferred_age_min?: number | null
          preferred_contact_time?: string | null
          preferred_gender?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          preferred_professions?: string[] | null
          property_type: Database["public"]["Enums"]["property_type"]
          quality_score?: number | null
          rent_includes?: string[] | null
          response_rate?: number | null
          search_vector?: unknown | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          total_floors?: number | null
          total_rooms?: number | null
          updated_at?: string | null
          video_tour_url?: string | null
          view_count?: number | null
          virtual_tour_url?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          amenities?: string[] | null
          available_from?: string | null
          bathrooms?: number
          bedrooms?: number
          boost_score?: number | null
          brokerage_amount?: number | null
          carpet_area_sqft?: number | null
          contact_email?: boolean | null
          contact_phone?: boolean | null
          contact_whatsapp?: boolean | null
          created_at?: string | null
          current_occupants?: number | null
          description?: string | null
          featured_until?: string | null
          floor_number?: number | null
          furnishing_details?: string[] | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_furnished?: boolean | null
          landmark?: string | null
          last_boosted_at?: string | null
          lease_duration_months?: number | null
          lifestyle_preferences?: string[] | null
          location_id?: string | null
          maintenance_charges?: number | null
          max_occupants?: number | null
          monthly_rent?: number
          nearby_facilities?: string[] | null
          owner_id?: string
          parking_available?: boolean | null
          parking_type?: string | null
          preferred_age_max?: number | null
          preferred_age_min?: number | null
          preferred_contact_time?: string | null
          preferred_gender?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          preferred_professions?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"]
          quality_score?: number | null
          rent_includes?: string[] | null
          response_rate?: number | null
          search_vector?: unknown | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          total_floors?: number | null
          total_rooms?: number | null
          updated_at?: string | null
          video_tour_url?: string | null
          view_count?: number | null
          virtual_tour_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flat_listings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flat_listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flat_requests: {
        Row: {
          budget_range_max: number | null
          budget_range_min: number | null
          created_at: string | null
          id: string
          last_message_at: string | null
          lease_duration_preference: number | null
          listing_id: string
          message: string | null
          owner_id: string
          owner_response: string | null
          preferred_move_in_date: string | null
          rejection_reason: string | null
          seeker_id: string
          seeker_response: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          status_changed_at: string | null
          status_changed_by: string | null
          updated_at: string | null
          viewing_address: string | null
          viewing_scheduled_at: string | null
          viewing_status: string | null
        }
        Insert: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lease_duration_preference?: number | null
          listing_id: string
          message?: string | null
          owner_id: string
          owner_response?: string | null
          preferred_move_in_date?: string | null
          rejection_reason?: string | null
          seeker_id: string
          seeker_response?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          status_changed_at?: string | null
          status_changed_by?: string | null
          updated_at?: string | null
          viewing_address?: string | null
          viewing_scheduled_at?: string | null
          viewing_status?: string | null
        }
        Update: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          lease_duration_preference?: number | null
          listing_id?: string
          message?: string | null
          owner_id?: string
          owner_response?: string | null
          preferred_move_in_date?: string | null
          rejection_reason?: string | null
          seeker_id?: string
          seeker_response?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          status_changed_at?: string | null
          status_changed_by?: string | null
          updated_at?: string | null
          viewing_address?: string | null
          viewing_scheduled_at?: string | null
          viewing_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flat_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flat_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flat_requests_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flat_requests_status_changed_by_fkey"
            columns: ["status_changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_boosts: {
        Row: {
          amount_paid: number
          boost_type: string
          created_at: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          listing_id: string
          starts_at: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          boost_type: string
          created_at?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          listing_id: string
          starts_at: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          boost_type?: string
          created_at?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          listing_id?: string
          starts_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_boosts_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_boosts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_tags: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_tags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_views: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          referrer: string | null
          user_agent: string | null
          view_duration: number | null
          viewer_id: string | null
          viewer_ip: unknown | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          referrer?: string | null
          user_agent?: string | null
          view_duration?: number | null
          viewer_id?: string | null
          viewer_ip?: unknown | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          referrer?: string | null
          user_agent?: string | null
          view_duration?: number | null
          viewer_id?: string | null
          viewer_ip?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_views_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_suggestions: {
        Row: {
          area: string
          city: string
          created_at: string | null
          full_address: string | null
          id: string
          latitude: number | null
          longitude: number | null
          popularity_score: number | null
        }
        Insert: {
          area: string
          city: string
          created_at?: string | null
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          popularity_score?: number | null
        }
        Update: {
          area?: string
          city?: string
          created_at?: string | null
          full_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          popularity_score?: number | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          area: string
          city: string
          created_at: string | null
          id: string
          is_popular: boolean | null
          latitude: number | null
          longitude: number | null
          pincode: string | null
          state: string | null
        }
        Insert: {
          area: string
          city: string
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          state?: string | null
        }
        Update: {
          area?: string
          city?: string
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          state?: string | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_four: string | null
          provider: string | null
          provider_payment_method_id: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          last_active_at: string | null
          phone_number: string
          phone_verified: boolean | null
          preferences: Json | null
          profession: string | null
          profile_picture_url: string | null
          social_links: Json | null
          updated_at: string | null
          verification_documents: string[] | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          last_active_at?: string | null
          phone_number?: string
          phone_verified?: boolean | null
          preferences?: Json | null
          profession?: string | null
          profile_picture_url?: string | null
          social_links?: Json | null
          updated_at?: string | null
          verification_documents?: string[] | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_active_at?: string | null
          phone_number?: string
          phone_verified?: boolean | null
          preferences?: Json | null
          profession?: string | null
          profile_picture_url?: string | null
          social_links?: Json | null
          updated_at?: string | null
          verification_documents?: string[] | null
        }
        Relationships: []
      }
      property_reports: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          id: string
          listing_id: string
          report_type: string
          reporter_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          listing_id: string
          report_type: string
          reporter_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          listing_id?: string
          report_type?: string
          reporter_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          credits_awarded: number | null
          id: string
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_awarded?: number | null
          id?: string
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_awarded?: number | null
          id?: string
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          listing_id: string | null
          rating: number
          review_text: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          listing_id?: string | null
          rating: number
          review_text?: string | null
          review_type: string
          reviewee_id: string
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          listing_id?: string | null
          rating?: number
          review_text?: string | null
          review_type?: string
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          email_alerts: boolean | null
          id: string
          is_active: boolean | null
          last_notified_at: string | null
          name: string
          search_criteria: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          is_active?: boolean | null
          last_notified_at?: string | null
          name: string
          search_criteria: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          is_active?: boolean | null
          last_notified_at?: string | null
          name?: string
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          result_count: number | null
          search_query: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          result_count?: number | null
          search_query?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          result_count?: number | null
          search_query?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_listings: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          priority_support: boolean | null
          updated_at: string | null
          verified_badge: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_listings?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          priority_support?: boolean | null
          updated_at?: string | null
          verified_badge?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_listings?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          priority_support?: boolean | null
          updated_at?: string | null
          verified_badge?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          payment_gateway: string | null
          payment_method_id: string | null
          status: string | null
          subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_gateway?: string | null
          payment_method_id?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          payment_gateway?: string | null
          payment_method_id?: string | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trending_searches: {
        Row: {
          created_at: string | null
          id: string
          last_searched_at: string | null
          search_count: number | null
          search_term: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_searched_at?: string | null
          search_count?: number | null
          search_term: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_searched_at?: string | null
          search_count?: number | null
          search_term?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          credits: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          ends_at: string
          id: string
          payment_method: string | null
          plan_id: string
          starts_at: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          ends_at: string
          id?: string
          payment_method?: string | null
          plan_id: string
          starts_at: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          ends_at?: string
          id?: string
          payment_method?: string | null
          plan_id?: string
          starts_at?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits_to_user: {
        Args: {
          target_user_id: string
          credit_amount: number
          transaction_type?: string
          description?: string
          related_id?: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          action_type: string
          max_attempts?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      consume_credit_for_contact: {
        Args: { listing_id: string }
        Returns: boolean
      }
      create_sample_listings_for_user: {
        Args: { user_id: string }
        Returns: number
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_credit_balance: {
        Args: { target_user_id: string }
        Returns: number
      }
      log_security_event: {
        Args: {
          action_type: string
          resource_type?: string
          resource_id?: string
          details?: Json
        }
        Returns: undefined
      }
      process_referral_signup: {
        Args: { referred_email: string; referral_code: string }
        Returns: undefined
      }
      search_listings: {
        Args: {
          search_query?: string
          city_filter?: string
          min_rent?: number
          max_rent?: number
          property_types?: string[]
          min_bedrooms?: number
          amenities_filter?: string[]
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          monthly_rent: number
          property_type: string
          bedrooms: number
          bathrooms: number
          search_rank: number
          boost_score: number
          created_at: string
        }[]
      }
      track_search_term: {
        Args: { term: string }
        Returns: undefined
      }
    }
    Enums: {
      gender_preference: "male" | "female" | "any"
      listing_status: "active" | "inactive" | "rented" | "expired"
      property_type:
        | "apartment"
        | "independent_house"
        | "villa"
        | "pg"
        | "shared_room"
        | "studio"
      request_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "withdrawn"
        | "expired"
      user_role: "flat_seeker" | "flat_owner"
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
      gender_preference: ["male", "female", "any"],
      listing_status: ["active", "inactive", "rented", "expired"],
      property_type: [
        "apartment",
        "independent_house",
        "villa",
        "pg",
        "shared_room",
        "studio",
      ],
      request_status: [
        "pending",
        "accepted",
        "rejected",
        "withdrawn",
        "expired",
      ],
      user_role: ["flat_seeker", "flat_owner"],
    },
  },
} as const
