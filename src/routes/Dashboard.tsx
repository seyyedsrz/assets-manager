import { Link } from 'react-router-dom';
import { Plus, Package, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { useAssets } from '../features/assets/hooks/useAssets';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { DataManager } from '../components/shared/DataManager';

export default function Dashboard() {
  const { data: assets, isLoading } = useAssets();

  const stats = {
    total: assets?.length || 0,
    inPossession: assets?.filter((a) => a.status === 'in_possession').length || 0,
    transferred: assets?.filter((a) => a.status === 'transferred').length || 0,
    totalValue: assets?.reduce((sum, a) => sum + (a.estimated_value || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">داشبورد</h1>
          <p className="text-gray-600 mt-1">خلاصه وضعیت اموال شما</p>
        </div>
        <Link to="/assets/new">
          <Button>
            <Plus className="w-5 h-5" />
            ثبت دارایی جدید
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">مجموع اموال</CardTitle>
            <Package className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">تعداد کل دارایی‌ها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">نزد من</CardTitle>
            <Package className="w-5 h-5 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-600">{stats.inPossession}</div>
            <p className="text-xs text-gray-500 mt-1">اموال در دست</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">تحویل داده شده</CardTitle>
            <ArrowRightLeft className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.transferred}</div>
            <p className="text-xs text-gray-500 mt-1">اموال منتقل شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">ارزش کل</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">
              {stats.totalValue > 0 ? formatCurrency(stats.totalValue) : '-'}
            </div>
            <p className="text-xs text-gray-500 mt-1">ارزش تقریبی اموال</p>
          </CardContent>
        </Card>
      </div>

      {assets && assets.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>آخرین اموال ثبت شده</CardTitle>
                <Link to="/assets">
                  <Button variant="outline" size="sm">
                    مشاهده همه
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.slice(0, 5).map((asset) => (
                  <Link
                    key={asset.id}
                    to={`/assets/${asset.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.asset_name}</h3>
                      <p className="text-sm text-gray-600">شماره: {asset.asset_number}</p>
                    </div>
                    <div className="text-left">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          asset.status === 'in_possession'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {asset.status === 'in_possession' ? 'نزد من' : 'تحویل داده شده'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* کامپوننت مدیریت داده‌ها */}
          <DataManager />
        </>
      ) : (
        <>
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">هنوز دارایی ثبت نشده</h3>
              <p className="text-gray-600 mb-6">برای شروع، اولین دارایی خود را ثبت کنید</p>
              <Link to="/assets/new">
                <Button>
                  <Plus className="w-5 h-5" />
                  ثبت دارایی جدید
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* کامپوننت مدیریت داده‌ها */}
          <DataManager />
        </>
      )}
    </div>
  );
}
