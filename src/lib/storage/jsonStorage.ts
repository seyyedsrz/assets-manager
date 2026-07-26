/**
 * JSON File Storage
 * سیستم ذخیره‌سازی مبتنی بر فایل JSON برای مستقل کردن برنامه از Supabase
 */

import type { Asset } from '../../features/assets/types';

export interface StorageData {
  assets: Asset[];
  transfer_history: Array<{
    id: string;
    asset_id: string;
    to_person: string;
    transfer_date: string;
    notes?: string;
  }>;
  last_updated: string;
}

const STORAGE_KEY = 'asset_manager_data';
const BACKUP_KEY = 'asset_manager_backup';

// داده پیش‌فرض
const DEFAULT_DATA: StorageData = {
  assets: [],
  transfer_history: [],
  last_updated: new Date().toISOString(),
};

/**
 * بارگذاری داده از localStorage
 */
export function loadData(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as StorageData;
      return data;
    }
    return { ...DEFAULT_DATA };
  } catch (error) {
    console.error('خطا در بارگذاری داده:', error);
    return { ...DEFAULT_DATA };
  }
}

/**
 * ذخیره داده در localStorage
 */
export function saveData(data: StorageData): void {
  try {
    // بکآپ از داده قبلی
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      localStorage.setItem(BACKUP_KEY, current);
    }

    // ذخیره داده جدید
    data.last_updated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('خطا در ذخیره داده:', error);
    throw new Error('خطا در ذخیره اطلاعات');
  }
}

/**
 * بازیابی از بکآپ
 */
export function restoreFromBackup(): boolean {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      localStorage.setItem(STORAGE_KEY, backup);
      return true;
    }
    return false;
  } catch (error) {
    console.error('خطا در بازیابی بکآپ:', error);
    return false;
  }
}

/**
 * دانلود داده به صورت فایل JSON
 */
export function downloadDataAsFile(): void {
  try {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asset-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('خطا در دانلود فایل:', error);
    throw new Error('خطا در دانلود فایل');
  }
}

/**
 * بارگذاری داده از فایل JSON
 */
export function uploadDataFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as StorageData;
        
        // اعتبارسنجی ساختار داده
        if (!data.assets || !Array.isArray(data.assets)) {
          throw new Error('فرمت فایل نامعتبر است');
        }
        
        saveData(data);
        resolve();
      } catch (error) {
        console.error('خطا در پردازش فایل:', error);
        reject(new Error('فایل نامعتبر است'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('خطا در خواندن فایل'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * پاک کردن تمام داده‌ها
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
  } catch (error) {
    console.error('خطا در پاک کردن داده:', error);
    throw new Error('خطا در پاک کردن اطلاعات');
  }
}

/**
 * دریافت حجم ذخیره‌سازی
 */
export function getStorageSize(): { used: number; total: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const backup = localStorage.getItem(BACKUP_KEY) || '';
    const used = new Blob([data, backup]).size;
    
    // حداکثر حجم localStorage معمولا 5-10 مگابایت است
    const total = 5 * 1024 * 1024; // 5MB
    
    return { used, total };
  } catch {
    return { used: 0, total: 0 };
  }
}

/**
 * تولید ID یکتا
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
