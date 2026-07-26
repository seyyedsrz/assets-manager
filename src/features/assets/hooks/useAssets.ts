import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService } from '../services/assetService';
import type { CreateAssetInput, UpdateAssetInput, TransferAssetInput } from '../types';

export const ASSET_KEYS = {
  all: ['assets'] as const,
  lists: () => [...ASSET_KEYS.all, 'list'] as const,
  list: (status?: string) => [...ASSET_KEYS.lists(), { status }] as const,
  details: () => [...ASSET_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ASSET_KEYS.details(), id] as const,
};

// دریافت همه اموال
export function useAssets() {
  return useQuery({
    queryKey: ASSET_KEYS.lists(),
    queryFn: () => assetService.getAll(),
  });
}

// دریافت اموال بر اساس وضعیت
export function useAssetsByStatus(status: 'in_possession' | 'transferred') {
  return useQuery({
    queryKey: ASSET_KEYS.list(status),
    queryFn: () => assetService.getByStatus(status),
  });
}

// دریافت یک دارایی
export function useAsset(id: string) {
  return useQuery({
    queryKey: ASSET_KEYS.detail(id),
    queryFn: () => assetService.getById(id),
    enabled: !!id,
  });
}

// ایجاد دارایی جدید
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetInput) => assetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_KEYS.lists() });
    },
  });
}

// ویرایش دارایی
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssetInput }) =>
      assetService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ASSET_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ASSET_KEYS.detail(variables.id) });
    },
  });
}

// حذف دارایی
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_KEYS.lists() });
    },
  });
}

// انتقال دارایی
export function useTransferAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferAssetInput) => assetService.transfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_KEYS.lists() });
    },
  });
}
