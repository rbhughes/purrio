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
      asset_job: {
        Row: {
          active: boolean
          asset: string
          chunk: number
          created_at: string
          cron: string | null
          filter: string | null
          geo_type: Database["public"]["Enums"]["geo_type"]
          id: number
          last_invoked: string | null
          recency: number
          repo_fs_path: string | null
          repo_id: string
          repo_name: string | null
          tag: string | null
          touched_at: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          asset: string
          chunk?: number
          created_at?: string
          cron?: string | null
          filter?: string | null
          geo_type: Database["public"]["Enums"]["geo_type"]
          id?: number
          last_invoked?: string | null
          recency?: number
          repo_fs_path?: string | null
          repo_id: string
          repo_name?: string | null
          tag?: string | null
          touched_at?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          asset?: string
          chunk?: number
          created_at?: string
          cron?: string | null
          filter?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"]
          id?: number
          last_invoked?: string | null
          recency?: number
          repo_fs_path?: string | null
          repo_id?: string
          repo_name?: string | null
          tag?: string | null
          touched_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      batch_ledger: {
        Row: {
          batch_id: string
          directive: string | null
          num_tasks: number | null
          status: string | null
          task_id: number
        }
        Insert: {
          batch_id: string
          directive?: string | null
          num_tasks?: number | null
          status?: string | null
          task_id: number
        }
        Update: {
          batch_id?: string
          directive?: string | null
          num_tasks?: number | null
          status?: string | null
          task_id?: number
        }
        Relationships: []
      }
      message: {
        Row: {
          activity: string | null
          created_at: string
          directive: string | null
          function: string | null
          id: number
          level: string | null
          message: string | null
          params: string | null
          repo_id: string | null
          service: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          activity?: string | null
          created_at?: string
          directive?: string | null
          function?: string | null
          id?: number
          level?: string | null
          message?: string | null
          params?: string | null
          repo_id?: string | null
          service?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          activity?: string | null
          created_at?: string
          directive?: string | null
          function?: string | null
          id?: number
          level?: string | null
          message?: string | null
          params?: string | null
          repo_id?: string | null
          service?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
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
      repo: {
        Row: {
          active: boolean
          bytes: number | null
          conn: Json | null
          conn_aux: Json | null
          created_at: string
          directories: number | null
          display_epsg: number | null
          display_name: string | null
          files: number | null
          fs_path: string | null
          geo_type: Database["public"]["Enums"]["geo_type"] | null
          id: string
          name: string | null
          outline: Json | null
          repo_mod: string | null
          storage_epsg: number | null
          storage_name: string | null
          touched_at: string
          updated_at: string
          well_count: number | null
          wells_with_completion: number | null
          wells_with_core: number | null
          wells_with_dst: number | null
          wells_with_formation: number | null
          wells_with_ip: number | null
          wells_with_perforation: number | null
          wells_with_production: number | null
          wells_with_raster_log: number | null
          wells_with_survey: number | null
          wells_with_vector_log: number | null
          wells_with_zone: number | null
        }
        Insert: {
          active?: boolean
          bytes?: number | null
          conn?: Json | null
          conn_aux?: Json | null
          created_at?: string
          directories?: number | null
          display_epsg?: number | null
          display_name?: string | null
          files?: number | null
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id: string
          name?: string | null
          outline?: Json | null
          repo_mod?: string | null
          storage_epsg?: number | null
          storage_name?: string | null
          touched_at?: string
          updated_at?: string
          well_count?: number | null
          wells_with_completion?: number | null
          wells_with_core?: number | null
          wells_with_dst?: number | null
          wells_with_formation?: number | null
          wells_with_ip?: number | null
          wells_with_perforation?: number | null
          wells_with_production?: number | null
          wells_with_raster_log?: number | null
          wells_with_survey?: number | null
          wells_with_vector_log?: number | null
          wells_with_zone?: number | null
        }
        Update: {
          active?: boolean
          bytes?: number | null
          conn?: Json | null
          conn_aux?: Json | null
          created_at?: string
          directories?: number | null
          display_epsg?: number | null
          display_name?: string | null
          files?: number | null
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id?: string
          name?: string | null
          outline?: Json | null
          repo_mod?: string | null
          storage_epsg?: number | null
          storage_name?: string | null
          touched_at?: string
          updated_at?: string
          well_count?: number | null
          wells_with_completion?: number | null
          wells_with_core?: number | null
          wells_with_dst?: number | null
          wells_with_formation?: number | null
          wells_with_ip?: number | null
          wells_with_perforation?: number | null
          wells_with_production?: number | null
          wells_with_raster_log?: number | null
          wells_with_survey?: number | null
          wells_with_vector_log?: number | null
          wells_with_zone?: number | null
        }
        Relationships: []
      }
      task: {
        Row: {
          body: Json | null
          directive: string | null
          id: number
          status: string | null
          worker: string | null
        }
        Insert: {
          body?: Json | null
          directive?: string | null
          id?: number
          status?: string | null
          worker?: string | null
        }
        Update: {
          body?: Json | null
          directive?: string | null
          id?: number
          status?: string | null
          worker?: string | null
        }
        Relationships: []
      }
      worker: {
        Row: {
          created_at: string
          hostname: string
          test: string | null
          touched_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hostname: string
          test?: string | null
          touched_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hostname?: string
          test?: string | null
          touched_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_geo_type_values: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["geo_type"][]
      }
    }
    Enums: {
      geo_type: "geographix" | "petra" | "kingdom" | "las"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
