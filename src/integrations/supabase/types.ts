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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      aadhaar_auth: {
        Row: {
          aadhaar_number: string
          created_at: string
          date_of_birth: string
          id: string
          is_verified: boolean
          name: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          aadhaar_number: string
          created_at?: string
          date_of_birth: string
          id?: string
          is_verified?: boolean
          name: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          aadhaar_number?: string
          created_at?: string
          date_of_birth?: string
          id?: string
          is_verified?: boolean
          name?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_partners: {
        Row: {
          available: boolean | null
          created_at: string
          id: string
          location: Json | null
          name: string
          phone: string
          price_per_km: number
          rating: number | null
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          id?: string
          location?: Json | null
          name: string
          phone: string
          price_per_km: number
          rating?: number | null
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          id?: string
          location?: Json | null
          name?: string
          phone?: string
          price_per_km?: number
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      farms: {
        Row: {
          created_at: string
          farmer_id: string
          id: string
          location: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          farmer_id: string
          id?: string
          location?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          farmer_id?: string
          id?: string
          location?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_fee: number | null
          delivery_partner_id: string | null
          id: string
          order_status: string
          order_type: string
          payment_status: string
          product_id: string
          quantity: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_fee?: number | null
          delivery_partner_id?: string | null
          id?: string
          order_status?: string
          order_type: string
          payment_status?: string
          product_id: string
          quantity: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_fee?: number | null
          delivery_partner_id?: string | null
          id?: string
          order_status?: string
          order_type?: string
          payment_status?: string
          product_id?: string
          quantity?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone_number: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          otp_code: string
          phone_number: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone_number?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_info: string | null
          category: string
          contact_info: string | null
          created_at: string
          description: string | null
          farm_id: string
          farmer_id: string
          id: string
          image: string | null
          name: string
          price: number
          quantity: number
          type: string
          unit: string
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          category: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          farm_id: string
          farmer_id: string
          id?: string
          image?: string | null
          name: string
          price: number
          quantity: number
          type: string
          unit: string
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          farm_id?: string
          farmer_id?: string
          id?: string
          image?: string | null
          name?: string
          price?: number
          quantity?: number
          type?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          location: Json | null
          name: string | null
          phone: string | null
          profile_completed: boolean | null
          updated_at: string
          user_id: string
          user_type: string
          verified: boolean | null
          whatsapp_number: string | null
        }
        Insert: {
          aadhar_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          location?: Json | null
          name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          updated_at?: string
          user_id: string
          user_type: string
          verified?: boolean | null
          whatsapp_number?: string | null
        }
        Update: {
          aadhar_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          location?: Json | null
          name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          updated_at?: string
          user_id?: string
          user_type?: string
          verified?: boolean | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
