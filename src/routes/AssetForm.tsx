import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useAsset, useCreateAsset, useUpdateAsset } from '../features/assets/hooks/useAssets';
import { createAssetSchema, type CreateAssetFormData } from '../features/assets/validation/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { getCategoryLabel } from '../lib/utils';
import type { AssetCategory } from '../features/assets/types';

const categories: AssetCategory[] = [
  'electronics',
  'furniture',
  'office_supplies',
  'equipment',
  'vehicle',
  'other',
];

export default function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: asset } = useAsset(id || '');
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssetFormData>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: asset
      ? {
          asset_name: asset.asset_name,
          asset_number: asset.asset_number,
          category: asset.category,
          estimated_value: asset.estimated_value || 0,
          description: asset.description || undefined,
          received_from: asset.received_from || undefined,
        }
      : undefined,
  });

  const onSubmit = async (data: CreateAssetFormData) => {
    
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/assets');
    } catch (error) {
      console.error('خطا در ثبت دارایی:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'ویرایش دارایی' : 'ثبت دارایی جدید'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'اطلاعات دارایی را ویرایش کنید' : 'اطلاعات دارایی را وارد کنید'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دارایی</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="نام دارایی"
              placeholder="مثلاً: لپ‌تاپ Dell"
              error={errors.asset_name?.message}
              required
              {...register('asset_name')}
            />

            <Input
              label="شماره دارایی"
              placeholder="مثلاً: AST-001"
              error={errors.asset_number?.message}
              required
              {...register('asset_number')}
            />

            <Select
              label="دسته‌بندی"
              error={errors.category?.message}
              required
              {...register('category')}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </Select>

            <Input
              label="ارزش تقریبی (ریال)"
              type="number"
              placeholder="مثلاً: 50000000"
              error={errors.estimated_value?.message}
              {...register('estimated_value')}
            />

            <Input
              label="تحویل‌دهنده"
              placeholder="از چه کسی تحویل گرفته‌اید؟"
              error={errors.received_from?.message}
              {...register('received_from')}
            />

            <Textarea
              label="توضیحات"
              placeholder="توضیحات اضافی در مورد دارایی..."
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {isEditing ? 'ذخیره تغییرات' : 'ثبت دارایی'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
