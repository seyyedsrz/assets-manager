import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { transferAssetSchema, type TransferAssetFormData } from '../validation/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

interface TransferModalProps {
  onClose: () => void;
  onSubmit: (data: TransferAssetFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export default function TransferModal({ onClose, onSubmit, isLoading }: TransferModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferAssetFormData>({
    resolver: zodResolver(transferAssetSchema),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>انتقال دارایی</CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="تحویل‌گیرنده"
              placeholder="نام شخصی که دارایی به او منتقل می‌شود"
              error={errors.transferred_to?.message}
              required
              {...register('transferred_to')}
            />

            <Textarea
              label="یادداشت"
              placeholder="توضیحات اضافی در مورد انتقال..."
              error={errors.notes?.message}
              {...register('notes')}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isLoading} className="flex-1">
                انتقال
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
