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
      flat_listings: {
        Row: {
          address_line1: string
          address_line2: string | null
          amenities: string[] | null
          available_from: string | null
          bathrooms: number
          bedrooms: number
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
          rent_includes: string[] | null
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
          rent_includes?: string[] | null
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
          rent_includes?: string[] | null
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
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone_number: string
          profession: string | null
          profile_picture_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          verification_documents: string[] | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone_number?: string
          profession?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          verification_documents?: string[] | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string
          profession?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          verification_documents?: string[] | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
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
      user_role: "flat_seeker" | "flat_owner" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
      user_role: ["flat_seeker", "flat_owner", "both"],
    },
  },
} as const
