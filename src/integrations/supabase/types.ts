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
      buyers: {
        Row: {
          created_at: string
          id: string
          otp_attempts: number | null
          otp_code: string | null
          otp_expires_at: string | null
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_partners: {
        Row: {
          base_delivery_charge: number | null
          created_at: string
          email: string | null
          id: string
          is_available: boolean | null
          location_lat: number | null
          location_lng: number | null
          name: string
          per_km_charge: number | null
          phone_number: string
          rating: number | null
          service_areas: string[] | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          base_delivery_charge?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_available?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          per_km_charge?: number | null
          phone_number: string
          rating?: number | null
          service_areas?: string[] | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          base_delivery_charge?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_available?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          per_km_charge?: number | null
          phone_number?: string
          rating?: number | null
          service_areas?: string[] | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      farmers: {
        Row: {
          aadhaar_number: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          name: string | null
          otp_attempts: number | null
          otp_code: string | null
          otp_expires_at: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          aadhaar_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          name?: string | null
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          aadhaar_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          name?: string | null
          otp_attempts?: number | null
          otp_code?: string | null
          otp_expires_at?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price_per_kg: number
          quantity_kg: number
          total_price: number
          vegetable_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_per_kg: number
          quantity_kg: number
          total_price: number
          vegetable_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_per_kg?: number
          quantity_kg?: number
          total_price?: number
          vegetable_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vegetable_id_fkey"
            columns: ["vegetable_id"]
            isOneToOne: false
            referencedRelation: "vegetables"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          buyer_name: string | null
          buyer_phone: string | null
          created_at: string
          delivery_address: string | null
          delivery_charge: number | null
          delivery_partner_id: string | null
          delivery_required: boolean | null
          farmer_id: string | null
          id: string
          order_status: string | null
          payment_method: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          total_amount: number
          updated_at: string
          vegetable_ids: string[] | null
        }
        Insert: {
          buyer_id?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_charge?: number | null
          delivery_partner_id?: string | null
          delivery_required?: boolean | null
          farmer_id?: string | null
          id?: string
          order_status?: string | null
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          total_amount: number
          updated_at?: string
          vegetable_ids?: string[] | null
        }
        Update: {
          buyer_id?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_charge?: number | null
          delivery_partner_id?: string | null
          delivery_required?: boolean | null
          farmer_id?: string | null
          id?: string
          order_status?: string | null
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          total_amount?: number
          updated_at?: string
          vegetable_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      vegetables: {
        Row: {
          created_at: string
          cropped_date: string
          description: string | null
          estimated_shelf_life_days: number
          farmer_id: string
          id: string
          price_per_kg: number | null
          quantity_available_kg: number | null
          updated_at: string
          vegetable_name: string
        }
        Insert: {
          created_at?: string
          cropped_date: string
          description?: string | null
          estimated_shelf_life_days: number
          farmer_id: string
          id?: string
          price_per_kg?: number | null
          quantity_available_kg?: number | null
          updated_at?: string
          vegetable_name: string
        }
        Update: {
          created_at?: string
          cropped_date?: string
          description?: string | null
          estimated_shelf_life_days?: number
          farmer_id?: string
          id?: string
          price_per_kg?: number | null
          quantity_available_kg?: number | null
          updated_at?: string
          vegetable_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vegetables_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_freshness_status: {
        Args: { cropped_date: string; shelf_life_days: number }
        Returns: string
      }
      get_time_left_days: {
        Args: { cropped_date: string; shelf_life_days: number }
        Returns: number
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
    Enums: {},
  },
} as const
