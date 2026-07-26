import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, Edit, Trash2, ArrowRightLeft, Package, Calendar, User, Tag, DollarSign } from 'lucide-react';
import { useAsset, useDeleteAsset, useTransferAsset } from '../features/assets/hooks/useAssets';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TransferModal from '../features/assets/components/TransferModal';
import { formatDate, formatCurrency, getCategoryLabel, getStatusLabel } from '../lib/utils';

export default function AssetDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: asset, isLoading } = useAsset(id!);
  const deleteMutation = useDeleteAsset();
  const transferMutation = useTransferAsset();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate('/assets');
    } catch (error) {
      console.error('خطا در حذف دارایی:', error);
    }
  };

  const handleTransfer = async (data: { transferred_to: string; notes?: string }) => {
    if (!id) return;
    try {
      await transferMutation.mutateAsync({
        asset_id: id,
        ...data,
      });
      setIsTransferModalOpen(false);
    } catch (error) {
      console.error('خطا در انتقال دارایی:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">دارایی یافت نشد</h2>
        <Link to="/assets">
          <Button variant="outline">بازگشت به لیست</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{asset.asset_name}</h1>
          <p className="text-gray-600 mt-1">شماره: {asset.asset_number}</p>
        </div>
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            asset.status === 'in_possession'
              ? 'bg-success-100 text-success-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {getStatusLabel(asset.status)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دارایی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">دسته‌بندی</p>
                <p className="text-base font-medium text-gray-900">{getCategoryLabel(asset.category)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">تاریخ ثبت</p>
                <p className="text-base font-medium text-gray-900">{formatDate(asset.registration_date)}</p>
              </div>
            </div>

            {asset.estimated_value && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">ارزش تقریبی</p>
                  <p className="text-base font-medium text-gray-900">{formatCurrency(asset.estimated_value)}</p>
                </div>
              </div>
            )}

            {asset.received_from && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">تحویل‌دهنده</p>
                  <p className="text-base font-medium text-gray-900">{asset.received_from}</p>
                </div>
              </div>
            )}

            {asset.transferred_to && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">تحویل‌گیرنده</p>
                  <p className="text-base font-medium text-gray-900">{asset.transferred_to}</p>
                </div>
              </div>
            )}

            {asset.transfer_date && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">تاریخ انتقال</p>
                  <p className="text-base font-medium text-gray-900">{formatDate(asset.transfer_date)}</p>
                </div>
              </div>
            )}
          </div>

          {asset.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">توضیحات</p>
              <p className="text-base text-gray-900">{asset.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {asset.status === 'in_possession' && (
          <>
            <Link to={`/assets/${id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full">
                <Edit className="w-5 h-5" />
                ویرایش
              </Button>
            </Link>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setIsTransferModalOpen(true)}
            >
              <ArrowRightLeft className="w-5 h-5" />
              انتقال دارایی
            </Button>
          </>
        )}
        <Button
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          isLoading={deleteMutation.isPending}
        >
          <Trash2 className="w-5 h-5" />
          حذف
        </Button>
      </div>

      {isTransferModalOpen && (
        <TransferModal
          onClose={() => setIsTransferModalOpen(false)}
          onSubmit={handleTransfer}
          isLoading={transferMutation.isPending}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>تأیید حذف</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                آیا از حذف دارایی <strong>{asset.asset_name}</strong> اطمینان دارید؟
                این عمل قابل بازگشت نیست.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deleteMutation.isPending}
                  className="flex-1"
                >
                  حذف
                </Button>
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                  انصراف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
