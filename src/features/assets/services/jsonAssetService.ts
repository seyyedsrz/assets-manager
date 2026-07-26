/**
 * JSON-based Asset Service
 * سرویس مدیریت اموال مبتنی بر JSON بدون وابستگی به Supabase
 */

import type { Asset, CreateAssetInput, UpdateAssetInput, TransferAssetInput } from '../types';
import { loadData, saveData, generateId } from '../../../lib/storage/jsonStorage';

export const jsonAssetService = {
  // دریافت همه اموال
  async getAll(): Promise<Asset[]> {
    try {
      const data = loadData();
      return data.assets.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    } catch (error) {
      console.error('خطا در دریافت اموال:', error);
      throw new Error('خطا در بارگذاری اطلاعات');
    }
  },

  // دریافت یک دارایی
  async getById(id: string): Promise<Asset | null> {
    try {
      const data = loadData();
      const asset = data.assets.find(a => a.id === id);
      return asset || null;
    } catch (error) {
      console.error('خطا در دریافت دارایی:', error);
      throw new Error('خطا در بارگذاری اطلاعات');
    }
  },

  // ثبت دارایی جدید
  async create(input: CreateAssetInput): Promise<Asset> {
    try {
      const data = loadData();
      
      const newAsset: Asset = {
        id: generateId(),
        ...input,
        status: 'in_possession',
        registration_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      data.assets.push(newAsset);
      saveData(data);
      
      return newAsset;
    } catch (error) {
      console.error('خطا در ثبت دارایی:', error);
      throw new Error('خطا در ذخیره اطلاعات');
    }
  },

  // ویرایش دارایی
  async update(id: string, input: UpdateAssetInput): Promise<Asset> {
    try {
      const data = loadData();
      const index = data.assets.findIndex(a => a.id === id);
      
      if (index === -1) {
        throw new Error('دارایی یافت نشد');
      }

      const updatedAsset: Asset = {
        ...data.assets[index],
        ...input,
        updated_at: new Date().toISOString(),
      };

      data.assets[index] = updatedAsset;
      saveData(data);
      
      return updatedAsset;
    } catch (error) {
      console.error('خطا در ویرایش دارایی:', error);
      throw new Error(error instanceof Error ? error.message : 'خطا در ذخیره اطلاعات');
    }
  },

  // حذف دارایی
  async delete(id: string): Promise<void> {
    try {
      const data = loadData();
      const index = data.assets.findIndex(a => a.id === id);
      
      if (index === -1) {
        throw new Error('دارایی یافت نشد');
      }

      data.assets.splice(index, 1);
      saveData(data);
    } catch (error) {
      console.error('خطا در حذف دارایی:', error);
      throw new Error(error instanceof Error ? error.message : 'خطا در حذف اطلاعات');
    }
  },

  // انتقال دارایی
  async transfer(input: TransferAssetInput): Promise<Asset> {
    try {
      const data = loadData();
      const { asset_id, transferred_to, notes } = input;
      
      const index = data.assets.findIndex(a => a.id === asset_id);
      if (index === -1) {
        throw new Error('دارایی یافت نشد');
      }

      // به‌روزرسانی وضعیت دارایی
      const updatedAsset: Asset = {
        ...data.assets[index],
        status: 'transferred',
        transferred_to,
        transfer_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      data.assets[index] = updatedAsset;

      // ثبت در تاریخچه انتقالات
      data.transfer_history.push({
        id: generateId(),
        asset_id,
        to_person: transferred_to,
        transfer_date: new Date().toISOString(),
        notes,
      });

      saveData(data);
      
      return updatedAsset;
    } catch (error) {
      console.error('خطا در انتقال دارایی:', error);
      throw new Error(error instanceof Error ? error.message : 'خطا در ذخیره اطلاعات');
    }
  },

  // دریافت اموال بر اساس وضعیت
  async getByStatus(status: 'in_possession' | 'transferred'): Promise<Asset[]> {
    try {
      const data = loadData();
      return data.assets
        .filter(a => a.status === status)
        .sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
    } catch (error) {
      console.error('خطا در دریافت اموال:', error);
      throw new Error('خطا در بارگذاری اطلاعات');
    }
  },

  // جستجوی اموال
  async search(query: string): Promise<Asset[]> {
    try {
      const data = loadData();
      const searchTerm = query.toLowerCase();
      
      return data.assets
        .filter(asset => 
          asset.asset_name.toLowerCase().includes(searchTerm) ||
          asset.asset_number.toLowerCase().includes(searchTerm) ||
          asset.description?.toLowerCase().includes(searchTerm)
        )
        .sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
    } catch (error) {
      console.error('خطا در جستجو:', error);
      throw new Error('خطا در جستجو');
    }
  },

  // دریافت تاریخچه انتقالات یک دارایی
  async getTransferHistory(assetId: string) {
    try {
      const data = loadData();
      return data.transfer_history
        .filter(h => h.asset_id === assetId)
        .sort((a, b) => 
          new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime()
        );
    } catch (error) {
      console.error('خطا در دریافت تاریخچه:', error);
      throw new Error('خطا در بارگذاری تاریخچه');
    }
  },
};
