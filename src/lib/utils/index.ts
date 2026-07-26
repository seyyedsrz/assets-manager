import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fa-IR').format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    electronics: 'الکترونیک',
    furniture: 'اثاثه',
    office_supplies: 'لوازم اداری',
    equipment: 'تجهیزات',
    vehicle: 'وسیله نقلیه',
    other: 'سایر',
  };
  return labels[category] || category;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_possession: 'نزد من',
    transferred: 'تحویل داده شده',
  };
  return labels[status] || status;
}
