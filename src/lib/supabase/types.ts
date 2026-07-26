// Auto-generated types for Supabase
// These can be regenerated using: npx supabase gen types typescript

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
      assets: {
        Row: {
          id: string
          asset_name: string
          asset_number: string
          status: 'in_possession' | 'transferred'
          category: string
          estimated_value: number | null
          description: string | null
          image_url: string | null
          registration_date: string
          received_from: string | null
          transferred_to: string | null
          transfer_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asset_name: string
          asset_number: string
          status?: 'in_possession' | 'transferred'
          category: string
          estimated_value?: number | null
          description?: string | null
          image_url?: string | null
          registration_date?: string
          received_from?: string | null
          transferred_to?: string | null
          transfer_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asset_name?: string
          asset_number?: string
          status?: 'in_possession' | 'transferred'
          category?: string
          estimated_value?: number | null
          description?: string | null
          image_url?: string | null
          registration_date?: string
          received_from?: string | null
          transferred_to?: string | null
          transfer_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transfer_history: {
        Row: {
          id: string
          asset_id: string
          from_person: string | null
          to_person: string | null
          transfer_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          from_person?: string | null
          to_person?: string | null
          transfer_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          from_person?: string | null
          to_person?: string | null
          transfer_date?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
