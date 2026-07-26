import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useAssets } from '../features/assets/hooks/useAssets';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AssetCard from '../features/assets/components/AssetCard';
import type { AssetStatus } from '../features/assets/types';

export default function AssetList() {
  const { data: assets, isLoading } = useAssets();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');

  const filteredAssets = assets?.filter((asset) => {
    const matchesSearch =
      asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لیست اموال</h1>
          <p className="text-gray-600 mt-1">مدیریت و مشاهده تمام اموال</p>
        </div>
        <Link to="/assets/new">
          <Button>
            <Plus className="w-5 h-5" />
            ثبت دارایی جدید
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام یا شماره دارایی..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                همه
              </Button>
              <Button
                variant={statusFilter === 'in_possession' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('in_possession')}
              >
                نزد من
              </Button>
              <Button
                variant={statusFilter === 'transferred' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('transferred')}
              >
                تحویل داده شده
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAssets && filteredAssets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'دارایی‌ای یافت نشد'
                : 'هنوز دارایی ثبت نشده'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'فیلترهای جستجو را تغییر دهید'
                : 'برای شروع، اولین دارایی خود را ثبت کنید'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to="/assets/new">
                <Button>
                  <Plus className="w-5 h-5" />
                  ثبت دارایی جدید
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
