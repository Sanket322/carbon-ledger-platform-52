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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      energy_readings: {
        Row: {
          carbon_credits_generated: number | null
          created_at: string
          energy_generated_kwh: number
          id: string
          notes: string | null
          project_id: string
          reading_date: string
          reading_type: string
          updated_at: string
        }
        Insert: {
          carbon_credits_generated?: number | null
          created_at?: string
          energy_generated_kwh: number
          id?: string
          notes?: string | null
          project_id: string
          reading_date?: string
          reading_type?: string
          updated_at?: string
        }
        Update: {
          carbon_credits_generated?: number | null
          created_at?: string
          energy_generated_kwh?: number
          id?: string
          notes?: string | null
          project_id?: string
          reading_date?: string
          reading_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "energy_readings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "energy_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "energy_readings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          country: string | null
          created_at: string
          full_name: string
          id: string
          kyc_submitted_at: string | null
          kyc_verified: boolean | null
          kyc_verified_at: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          full_name: string
          id: string
          kyc_submitted_at?: string | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          kyc_submitted_at?: string | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          additionality_demonstration: string | null
          available_credits: number
          baseline_justification: string | null
          carbon_asset_mandate_date: string | null
          carbon_asset_mandate_signed: boolean | null
          certificate_url: string | null
          co2_reduction_estimate: number | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_stage: string | null
          description: string
          id: string
          images: string[] | null
          impact_criteria_compliance: string | null
          installed_capacity: string | null
          latitude: number | null
          location_address: string | null
          location_country: string
          longitude: number | null
          monitoring_plan_url: string | null
          monitoring_report_url: string | null
          no_harm_declaration_date: string | null
          no_harm_declaration_signed: boolean | null
          owner_id: string
          ownership_proof_url: string | null
          pcn_document_url: string | null
          price_per_ton: number
          project_type: Database["public"]["Enums"]["project_type"]
          registry: Database["public"]["Enums"]["registry_type"]
          registry_id: string | null
          stakeholder_consultation_url: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          total_credits: number
          updated_at: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
          vintage_year: number | null
        }
        Insert: {
          additionality_demonstration?: string | null
          available_credits?: number
          baseline_justification?: string | null
          carbon_asset_mandate_date?: string | null
          carbon_asset_mandate_signed?: boolean | null
          certificate_url?: string | null
          co2_reduction_estimate?: number | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_stage?: string | null
          description: string
          id?: string
          images?: string[] | null
          impact_criteria_compliance?: string | null
          installed_capacity?: string | null
          latitude?: number | null
          location_address?: string | null
          location_country: string
          longitude?: number | null
          monitoring_plan_url?: string | null
          monitoring_report_url?: string | null
          no_harm_declaration_date?: string | null
          no_harm_declaration_signed?: boolean | null
          owner_id: string
          ownership_proof_url?: string | null
          pcn_document_url?: string | null
          price_per_ton: number
          project_type: Database["public"]["Enums"]["project_type"]
          registry: Database["public"]["Enums"]["registry_type"]
          registry_id?: string | null
          stakeholder_consultation_url?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          total_credits?: number
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          vintage_year?: number | null
        }
        Update: {
          additionality_demonstration?: string | null
          available_credits?: number
          baseline_justification?: string | null
          carbon_asset_mandate_date?: string | null
          carbon_asset_mandate_signed?: boolean | null
          certificate_url?: string | null
          co2_reduction_estimate?: number | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_stage?: string | null
          description?: string
          id?: string
          images?: string[] | null
          impact_criteria_compliance?: string | null
          installed_capacity?: string | null
          latitude?: number | null
          location_address?: string | null
          location_country?: string
          longitude?: number | null
          monitoring_plan_url?: string | null
          monitoring_report_url?: string | null
          no_harm_declaration_date?: string | null
          no_harm_declaration_signed?: boolean | null
          owner_id?: string
          ownership_proof_url?: string | null
          pcn_document_url?: string | null
          price_per_ton?: number
          project_type?: Database["public"]["Enums"]["project_type"]
          registry?: Database["public"]["Enums"]["registry_type"]
          registry_id?: string | null
          stakeholder_consultation_url?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          total_credits?: number
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          vintage_year?: number | null
        }
        Relationships: []
      }
      retirement_certificates: {
        Row: {
          certificate_url: string | null
          created_at: string
          credits_retired: number
          id: string
          project_id: string
          qr_code_url: string | null
          retirement_reason: string | null
          serial_number: string
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          credits_retired: number
          id?: string
          project_id: string
          qr_code_url?: string | null
          retirement_reason?: string | null
          serial_number: string
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          credits_retired?: number
          id?: string
          project_id?: string
          qr_code_url?: string | null
          retirement_reason?: string | null
          serial_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retirement_certificates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "energy_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "retirement_certificates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          buyer_id: string | null
          created_at: string
          credits: number
          id: string
          price_per_ton: number
          project_id: string
          seller_id: string | null
          serial_number: string | null
          status: string
          total_amount: number
          transaction_type: string
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          credits: number
          id?: string
          price_per_ton: number
          project_id: string
          seller_id?: string | null
          serial_number?: string | null
          status?: string
          total_amount: number
          transaction_type?: string
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          credits?: number
          id?: string
          price_per_ton?: number
          project_id?: string
          seller_id?: string | null
          serial_number?: string | null
          status?: string
          total_amount?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "energy_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          escrow_balance: number
          id: string
          total_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          escrow_balance?: number
          id?: string
          total_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          escrow_balance?: number
          id?: string
          total_credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      energy_summary: {
        Row: {
          avg_energy_per_reading: number | null
          last_reading_date: string | null
          owner_id: string | null
          project_id: string | null
          project_name: string | null
          total_credits_generated: number | null
          total_energy_kwh: number | null
          total_readings: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "buyer" | "trader" | "project_owner"
      project_status:
        | "draft"
        | "pending_verification"
        | "verified"
        | "rejected"
        | "active"
        | "completed"
        | "application"
        | "registration"
        | "pre_validation"
        | "validation"
        | "monitoring"
        | "audited"
      project_type:
        | "Renewable_Energy"
        | "Forest_Conservation"
        | "Reforestation"
        | "Clean_Cookstoves"
        | "Waste_Management"
        | "Energy_Efficiency"
        | "Other"
      registry_type: "UCR" | "Verra" | "Gold_Standard" | "Other"
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
      app_role: ["admin", "buyer", "trader", "project_owner"],
      project_status: [
        "draft",
        "pending_verification",
        "verified",
        "rejected",
        "active",
        "completed",
        "application",
        "registration",
        "pre_validation",
        "validation",
        "monitoring",
        "audited",
      ],
      project_type: [
        "Renewable_Energy",
        "Forest_Conservation",
        "Reforestation",
        "Clean_Cookstoves",
        "Waste_Management",
        "Energy_Efficiency",
        "Other",
      ],
      registry_type: ["UCR", "Verra", "Gold_Standard", "Other"],
    },
  },
} as const
