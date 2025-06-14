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
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          contact_call: boolean
          contact_email: boolean
          contact_whatsapp: boolean
          created_at: string
          description: string | null
          furnished: boolean
          id: string
          images: string[] | null
          is_active: boolean
          location_address: string
          location_area: string
          location_city: string
          owner_id: string
          parking: boolean
          preferences_additional_requirements: string | null
          preferences_gender: string | null
          preferences_lifestyle: string[] | null
          preferences_profession: string[] | null
          property_type: string
          rent_amount: number
          rent_deposit: number
          rent_includes: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          contact_call?: boolean
          contact_email?: boolean
          contact_whatsapp?: boolean
          created_at?: string
          description?: string | null
          furnished?: boolean
          id?: string
          images?: string[] | null
          is_active?: boolean
          location_address: string
          location_area: string
          location_city: string
          owner_id: string
          parking?: boolean
          preferences_additional_requirements?: string | null
          preferences_gender?: string | null
          preferences_lifestyle?: string[] | null
          preferences_profession?: string[] | null
          property_type: string
          rent_amount: number
          rent_deposit?: number
          rent_includes?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          contact_call?: boolean
          contact_email?: boolean
          contact_whatsapp?: boolean
          created_at?: string
          description?: string | null
          furnished?: boolean
          id?: string
          images?: string[] | null
          is_active?: boolean
          location_address?: string
          location_area?: string
          location_city?: string
          owner_id?: string
          parking?: boolean
          preferences_additional_requirements?: string | null
          preferences_gender?: string | null
          preferences_lifestyle?: string[] | null
          preferences_profession?: string[] | null
          property_type?: string
          rent_amount?: number
          rent_deposit?: number
          rent_includes?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      flat_requests: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          message: string | null
          owner_id: string
          seeker_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          owner_id: string
          seeker_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          owner_id?: string
          seeker_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flat_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "flat_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
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
      request_status: "pending" | "accepted" | "rejected" | "withdrawn"
      user_role: "flat_seeker" | "flat_owner"
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
      request_status: ["pending", "accepted", "rejected", "withdrawn"],
      user_role: ["flat_seeker", "flat_owner"],
    },
  },
} as const
