import { Link } from 'react-router-dom';
import { Package, Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { formatDate, formatCurrency, getCategoryLabel, getStatusLabel } from '../../../lib/utils';
import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  return (
    <Link to={`/assets/${asset.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        <CardContent className="p-6 pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{asset.asset_name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                شماره: {asset.asset_number}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                asset.status === 'in_possession'
                  ? 'bg-success-100 text-success-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {getStatusLabel(asset.status)}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span>{getCategoryLabel(asset.category)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>ثبت: {formatDate(asset.registration_date)}</span>
            </div>

            {asset.received_from && asset.status === 'in_possession' && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>از: {asset.received_from}</span>
              </div>
            )}

            {asset.transferred_to && asset.status === 'transferred' && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>به: {asset.transferred_to}</span>
              </div>
            )}

            {asset.estimated_value && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-primary-600">
                  {formatCurrency(asset.estimated_value)}
                </span>
              </div>
            )}
          </div>

          {asset.description && (
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">{asset.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
