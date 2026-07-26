import { z } from 'zod';

export const assetCategoryEnum = z.enum([
  'electronics',
  'furniture',
  'office_supplies',
  'equipment',
  'vehicle',
  'other',
]);

export const createAssetSchema = z.object({
  asset_name: z.string().min(3, 'نام دارایی باید حداقل ۳ کاراکتر باشد').max(100),
  asset_number: z.string().min(1, 'شماره دارایی الزامی است').max(50),
  category: assetCategoryEnum,
  estimated_value: z.preprocess(
    (val) => {
      // اگر مقدار خالی یا null بود، آن را undefined برگردان
      if (val === "" || val === null || val === undefined) return undefined;
      // در غیر این صورت آن را به عدد تبدیل کن
      return Number(val);
    },
    z.number().min(0).optional().or(z.literal(undefined))
  ),
  description: z.string().max(500).optional(),
  received_from: z.string().max(100).optional(),
});

export const updateAssetSchema = z.object({
  asset_name: z.string().min(3).max(100).optional(),
  asset_number: z.string().min(1).max(50).optional(),
  category: assetCategoryEnum.optional(),
  estimated_value: z.preprocess(
    (val) => {
      // اگر مقدار خالی یا null بود، آن را undefined برگردان
      if (val === "" || val === null || val === undefined) return undefined;
      // در غیر این صورت آن را به عدد تبدیل کن
      return Number(val);
    },
    z.number().min(0).optional().or(z.literal(undefined))
  ),
  description: z.string().max(500).optional(),
});

export const transferAssetSchema = z.object({
  transferred_to: z.string().min(3, 'نام تحویل‌گیرنده باید حداقل ۳ کاراکتر باشد').max(100),
  notes: z.string().max(500).optional(),
});

export type CreateAssetFormData = z.infer<typeof createAssetSchema>;
export type UpdateAssetFormData = z.infer<typeof updateAssetSchema>;
export type TransferAssetFormData = z.infer<typeof transferAssetSchema>;
