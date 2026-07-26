/**
 * Data Manager Component
 * کامپوننت مدیریت داده‌ها - بکآپ، بازیابی و دانلود/آپلود
 */

import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Database, HardDrive } from 'lucide-react';
import { 
  downloadDataAsFile, 
  uploadDataFromFile, 
  clearAllData, 
  restoreFromBackup,
  getStorageSize 
} from '../../lib/storage/jsonStorage';
 
import { Card } from '../ui/Card';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui';

export function DataManager() {
  const { showToast } = useToast();
  const [storageInfo, setStorageInfo] = useState(getStorageSize());
  const [isLoading, setIsLoading] = useState(false);
  const uploadeRef = useRef<HTMLInputElement>(null);

  const updateStorageInfo = () => {
    setStorageInfo(getStorageSize());
  };

  const handleDownload = () => {
    try {
      downloadDataAsFile();
      showToast('success', 'فایل با موفقیت دانلود شد');
    } catch (error) {
      showToast('error', 'خطا در دانلود فایل');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await uploadDataFromFile(file);
      updateStorageInfo();
      showToast('success', 'داده‌ها با موفقیت بارگذاری شدند');
      // رفرش صفحه برای نمایش داده‌های جدید
      window.location.reload();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'خطا در بارگذاری فایل');
    } finally {
      setIsLoading(false);
      event.target.value = ''; // ریست کردن input
    }
  };

  const handleClearData = () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید؟ این عملیات غیرقابل بازگشت است!')) {
      return;
    }

    try {
      clearAllData();
      updateStorageInfo();
      showToast('success', 'تمام داده‌ها پاک شدند');
      // رفرش صفحه
      window.location.reload();
    } catch (error) {
      showToast('error', 'خطا در پاک کردن داده‌ها');
    }
  };

  const handleRestoreBackup = () => {
    if (!window.confirm('آیا می‌خواهید داده‌ها را از آخرین بکآپ بازیابی کنید؟')) {
      return;
    }

    try {
      const success = restoreFromBackup();
      if (success) {
        updateStorageInfo();
        showToast('success', 'داده‌ها از بکآپ بازیابی شدند');
        window.location.reload();
      } else {
        showToast('error', 'هیچ بکآپی یافت نشد');
      }
    } catch (error) {
      showToast('error', 'خطا در بازیابی بکآپ');
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercentage = storageInfo.total > 0 
    ? Math.round((storageInfo.used / storageInfo.total) * 100) 
    : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">مدیریت داده‌ها</h2>
      </div>

      <div className="space-y-4">
        {/* نمایش حجم ذخیره‌سازی */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              حجم استفاده شده
            </span>
            <span className="text-sm text-gray-600">
              {formatBytes(storageInfo.used)} از {formatBytes(storageInfo.total)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                storagePercentage > 80 ? 'bg-red-500' : 
                storagePercentage > 50 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>

        {/* دکمه‌های مدیریت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full justify-start"
          >
            <Download className="w-4 h-4 ml-2" />
            دانلود بکآپ (JSON)
          </Button>

          <label className="block" htmlFor='upload'>
            <Button
              variant="outline"
              className="w-full justify-start cursor-pointer"
              disabled={isLoading}
              onClick={()=> uploadeRef?.current?.click()}
            >
              <Upload className="w-4 h-4 ml-2" />
              {isLoading ? 'در حال بارگذاری...' : 'بارگذاری از فایل'}
            </Button>
            <input
              type="file"
              ref={uploadeRef}
              id='upload'
              accept=".json"
              onChange={handleUpload}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          <Button
            onClick={handleRestoreBackup}
            variant="outline"
            className="w-full justify-start"
          >
            <Database className="w-4 h-4 ml-2" />
            بازیابی از بکآپ
          </Button>

          <Button
            onClick={handleClearData}
            variant="outline"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            پاک کردن همه داده‌ها
          </Button>
        </div>

        {/* توضیحات */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">راهنمای استفاده</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>داده‌ها به صورت خودکار در مرورگر ذخیره می‌شوند</li>
            <li>برای پشتیبان‌گیری، فایل JSON را دانلود کنید</li>
            <li>می‌توانید فایل بکآپ را روی رایانه دیگری بارگذاری کنید</li>
            <li>قبل از هر تغییر، یک بکآپ خودکار ایجاد می‌شود</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
