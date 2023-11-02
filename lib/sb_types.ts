export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recon_roots: {
        Row: {
          fs_path: string | null
          geo_type: Database["public"]["Enums"]["geo_type"] | null
          id: string
          row_changed: string | null
          row_created: string | null
          row_touched: string | null
          tag: string | null
          verified: boolean | null
        }
        Insert: {
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          tag?: string | null
          verified?: boolean | null
        }
        Update: {
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id?: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          tag?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      repos: {
        Row: {
          bytes: number | null
          conn: Json | null
          conn_aux: Json | null
          directories: number | null
          display_epsg: number | null
          display_name: string | null
          files: number | null
          fs_path: string | null
          geo_type: Database["public"]["Enums"]["geo_type"] | null
          human_size: string | null
          id: string
          inventory: Json | null
          name: string | null
          recon_root_id: string | null
          repo_mod: string | null
          row_changed: string | null
          row_created: string | null
          row_touched: string | null
          storage_epsg: number | null
          storage_name: string | null
          tag: string | null
        }
        Insert: {
          bytes?: number | null
          conn?: Json | null
          conn_aux?: Json | null
          directories?: number | null
          display_epsg?: number | null
          display_name?: string | null
          files?: number | null
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          human_size?: string | null
          id: string
          inventory?: Json | null
          name?: string | null
          recon_root_id?: string | null
          repo_mod?: string | null
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          storage_epsg?: number | null
          storage_name?: string | null
          tag?: string | null
        }
        Update: {
          bytes?: number | null
          conn?: Json | null
          conn_aux?: Json | null
          directories?: number | null
          display_epsg?: number | null
          display_name?: string | null
          files?: number | null
          fs_path?: string | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          human_size?: string | null
          id?: string
          inventory?: Json | null
          name?: string | null
          recon_root_id?: string | null
          repo_mod?: string | null
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          storage_epsg?: number | null
          storage_name?: string | null
          tag?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          body: Json | null
          directive: string | null
          hostname: string | null
          id: number
          status: string | null
        }
        Insert: {
          body?: Json | null
          directive?: string | null
          hostname?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          body?: Json | null
          directive?: string | null
          hostname?: string | null
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vector_log: {
        Row: {
          doc: Json | null
          geo_type: Database["public"]["Enums"]["geo_type"] | null
          id: string
          repo_id: string
          row_changed: string | null
          row_created: string | null
          row_touched: string | null
          tag: string | null
          well_id: string
        }
        Insert: {
          doc?: Json | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id: string
          repo_id: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          tag?: string | null
          well_id: string
        }
        Update: {
          doc?: Json | null
          geo_type?: Database["public"]["Enums"]["geo_type"] | null
          id?: string
          repo_id?: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          tag?: string | null
          well_id?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          hostname: string
          row_changed: string | null
          row_created: string | null
          row_touched: string | null
          test: string | null
        }
        Insert: {
          hostname: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          test?: string | null
        }
        Update: {
          hostname?: string
          row_changed?: string | null
          row_created?: string | null
          row_touched?: string | null
          test?: string | null
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
      geo_type: "geographix" | "petra" | "kingdom" | "las"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
