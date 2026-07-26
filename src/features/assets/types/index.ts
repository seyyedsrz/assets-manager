export type AssetStatus = 'in_possession' | 'transferred';

export type AssetCategory = 
  | 'electronics'
  | 'furniture'
  | 'office_supplies'
  | 'equipment'
  | 'vehicle'
  | 'other';

export interface Asset {
  id: string;
  asset_name: string;
  asset_number: string;
  status: AssetStatus;
  category: AssetCategory;
  estimated_value?: number | null;
  description?: string;
  image_url?: string;
  registration_date: string;
  received_from?: string;
  transferred_to?: string;
  transfer_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TransferHistory {
  id: string;
  asset_id: string;
  from_person?: string;
  to_person?: string;
  transfer_date: string;
  notes?: string;
  created_at: string;
}

export interface CreateAssetInput {
  asset_name: string;
  asset_number: string;
  category: AssetCategory;
  estimated_value?: number | null;
  description?: string;
  received_from?: string;
}

export interface UpdateAssetInput {
  asset_name?: string;
  asset_number?: string;
  category?: AssetCategory;
  estimated_value?: number | null;
  description?: string;
}

export interface TransferAssetInput {
  asset_id: string;
  transferred_to: string;
  notes?: string;
}
