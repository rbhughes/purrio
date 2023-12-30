export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      asset_job: {
        Row: {
          active: boolean | null;
          asset: string | null;
          chunk: number | null;
          cron: string | null;
          filter: string | null;
          id: number;
          last_invoked: string | null;
          repo_fs_path: string | null;
          repo_geo_type: Database["public"]["Enums"]["geo_type"] | null;
          repo_id: string;
          repo_name: string | null;
          row_created: string | null;
        };
        Insert: {
          active?: boolean | null;
          asset?: string | null;
          chunk?: number | null;
          cron?: string | null;
          filter?: string | null;
          id?: number;
          last_invoked?: string | null;
          repo_fs_path?: string | null;
          repo_geo_type?: Database["public"]["Enums"]["geo_type"] | null;
          repo_id: string;
          repo_name?: string | null;
          row_created?: string | null;
        };
        Update: {
          active?: boolean | null;
          asset?: string | null;
          chunk?: number | null;
          cron?: string | null;
          filter?: string | null;
          id?: number;
          last_invoked?: string | null;
          repo_fs_path?: string | null;
          repo_geo_type?: Database["public"]["Enums"]["geo_type"] | null;
          repo_id?: string;
          repo_name?: string | null;
          row_created?: string | null;
        };
        Relationships: [];
      };
      batch_ledger: {
        Row: {
          batch_id: string;
          directive: string | null;
          num_tasks: number | null;
          status: string | null;
          task_id: number;
        };
        Insert: {
          batch_id: string;
          directive?: string | null;
          num_tasks?: number | null;
          status?: string | null;
          task_id: number;
        };
        Update: {
          batch_id?: string;
          directive?: string | null;
          num_tasks?: number | null;
          status?: string | null;
          task_id?: number;
        };
        Relationships: [];
      };
      message: {
        Row: {
          directive: string | null;
          function: string | null;
          id: number;
          level: string | null;
          message: string | null;
          params: string | null;
          repo_id: string | null;
          row_created: string | null;
          service: string | null;
          source: string | null;
          user_id: string;
        };
        Insert: {
          directive?: string | null;
          function?: string | null;
          id?: number;
          level?: string | null;
          message?: string | null;
          params?: string | null;
          repo_id?: string | null;
          row_created?: string | null;
          service?: string | null;
          source?: string | null;
          user_id: string;
        };
        Update: {
          directive?: string | null;
          function?: string | null;
          id?: number;
          level?: string | null;
          message?: string | null;
          params?: string | null;
          repo_id?: string | null;
          row_created?: string | null;
          service?: string | null;
          source?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          last_name?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      repo: {
        Row: {
          bytes: number | null;
          conn: Json | null;
          conn_aux: Json | null;
          directories: number | null;
          display_epsg: number | null;
          display_name: string | null;
          files: number | null;
          fs_path: string | null;
          geo_type: Database["public"]["Enums"]["geo_type"] | null;
          id: string;
          name: string | null;
          repo_mod: string | null;
          row_changed: string | null;
          row_created: string | null;
          row_touched: string | null;
          storage_epsg: number | null;
          storage_name: string | null;
          well_count: number | null;
          wells_with_completion: number | null;
          wells_with_core: number | null;
          wells_with_dst: number | null;
          wells_with_formation: number | null;
          wells_with_ip: number | null;
          wells_with_perforation: number | null;
          wells_with_production: number | null;
          wells_with_raster_log: number | null;
          wells_with_survey: number | null;
          wells_with_vector_log: number | null;
          wells_with_zone: number | null;
        };
        Insert: {
          bytes?: number | null;
          conn?: Json | null;
          conn_aux?: Json | null;
          directories?: number | null;
          display_epsg?: number | null;
          display_name?: string | null;
          files?: number | null;
          fs_path?: string | null;
          geo_type?: Database["public"]["Enums"]["geo_type"] | null;
          id: string;
          name?: string | null;
          repo_mod?: string | null;
          row_changed?: string | null;
          row_created?: string | null;
          row_touched?: string | null;
          storage_epsg?: number | null;
          storage_name?: string | null;
          well_count?: number | null;
          wells_with_completion?: number | null;
          wells_with_core?: number | null;
          wells_with_dst?: number | null;
          wells_with_formation?: number | null;
          wells_with_ip?: number | null;
          wells_with_perforation?: number | null;
          wells_with_production?: number | null;
          wells_with_raster_log?: number | null;
          wells_with_survey?: number | null;
          wells_with_vector_log?: number | null;
          wells_with_zone?: number | null;
        };
        Update: {
          bytes?: number | null;
          conn?: Json | null;
          conn_aux?: Json | null;
          directories?: number | null;
          display_epsg?: number | null;
          display_name?: string | null;
          files?: number | null;
          fs_path?: string | null;
          geo_type?: Database["public"]["Enums"]["geo_type"] | null;
          id?: string;
          name?: string | null;
          repo_mod?: string | null;
          row_changed?: string | null;
          row_created?: string | null;
          row_touched?: string | null;
          storage_epsg?: number | null;
          storage_name?: string | null;
          well_count?: number | null;
          wells_with_completion?: number | null;
          wells_with_core?: number | null;
          wells_with_dst?: number | null;
          wells_with_formation?: number | null;
          wells_with_ip?: number | null;
          wells_with_perforation?: number | null;
          wells_with_production?: number | null;
          wells_with_raster_log?: number | null;
          wells_with_survey?: number | null;
          wells_with_vector_log?: number | null;
          wells_with_zone?: number | null;
        };
        Relationships: [];
      };
      task: {
        Row: {
          body: Json | null;
          directive: string | null;
          hostname: string | null;
          id: number;
          status: string | null;
        };
        Insert: {
          body?: Json | null;
          directive?: string | null;
          hostname?: string | null;
          id?: number;
          status?: string | null;
        };
        Update: {
          body?: Json | null;
          directive?: string | null;
          hostname?: string | null;
          id?: number;
          status?: string | null;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          id: number;
          inserted_at: string;
          is_complete: boolean | null;
          task: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      worker: {
        Row: {
          hostname: string;
          row_changed: string | null;
          row_created: string | null;
          row_touched: string | null;
          test: string | null;
        };
        Insert: {
          hostname: string;
          row_changed?: string | null;
          row_created?: string | null;
          row_touched?: string | null;
          test?: string | null;
        };
        Update: {
          hostname?: string;
          row_changed?: string | null;
          row_created?: string | null;
          row_touched?: string | null;
          test?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_geo_type_values: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Enums"]["geo_type"][];
      };
    };
    Enums: {
      geo_type: "geographix" | "petra" | "kingdom" | "las";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

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
  : never;
