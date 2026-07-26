// استفاده از سرویس JSON به جای Supabase
import { jsonAssetService } from './jsonAssetService';
import type { Asset, CreateAssetInput, UpdateAssetInput, TransferAssetInput } from '../types';

/**
 * Asset Service
 * 
 * این سرویس حالا کاملا مستقل از Supabase است و داده‌ها را روی JSON ذخیره می‌کند
 */

export const assetService = {
  // دریافت همه اموال
  async getAll(): Promise<Asset[]> {
    return jsonAssetService.getAll();
  },

  // دریافت یک دارایی
  async getById(id: string): Promise<Asset | null> {
    return jsonAssetService.getById(id);
  },

  // ثبت دارایی جدید
  async create(input: CreateAssetInput): Promise<Asset> {
    return jsonAssetService.create(input);
  },

  // ویرایش دارایی
  async update(id: string, input: UpdateAssetInput): Promise<Asset> {
    return jsonAssetService.update(id, input);
  },

  // حذف دارایی
  async delete(id: string): Promise<void> {
    return jsonAssetService.delete(id);
  },

  // انتقال دارایی
  async transfer(input: TransferAssetInput): Promise<Asset> {
    return jsonAssetService.transfer(input);
  },

  // دریافت اموال بر اساس وضعیت
  async getByStatus(status: 'in_possession' | 'transferred'): Promise<Asset[]> {
    return jsonAssetService.getByStatus(status);
  },

  // جستجوی اموال
  async search(query: string): Promise<Asset[]> {
    return jsonAssetService.search(query);
  },
};
