# سیستم مدیریت اموال

سیستم حرفه‌ای برای ثبت، پیگیری و مدیریت اموال شخصی یا سازمانی.

## ویژگی‌ها

✅ ثبت و مدیریت کامل اموال  
✅ دسته‌بندی هوشمند  
✅ سیستم انتقال دارایی  
✅ تاریخچه کامل تحویل/تحویل‌گیری  
✅ جستجو و فیلتر پیشرفته  
✅ رابط کاربری فارسی و زیبا  
✅ Responsive و Mobile-friendly  
✅ آماده برای اتصال به Backend دلخواه

## نصب و راه‌اندازی

```bash
# نصب Dependencies
npm install

# راه‌اندازی Supabase (مشاهده SUPABASE_SETUP.md)
# یا از backend خودتان استفاده کنید

# کپی فایل environment
cp .env.example .env
# مقادیر را تنظیم کنید

# اجرای پروژه
npm run dev
```

## دستورات

```bash
npm run dev      # اجرای Development
npm run build    # Build برای Production
npm run preview  # پیش‌نمایش Build
npm run lint     # بررسی کد
```

## تکنولوژی‌ها

- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **React Router** (Routing)
- **TanStack Query** (Data Fetching)
- **Zustand** (State Management)
- **React Hook Form** + **Zod** (Form & Validation)
- **Tailwind CSS** (Styling)
- **Supabase** (Backend - قابل جایگزینی)

## ساختار پروژه

```
src/
├── features/          # Business Logic
│   └── assets/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── validation/
├── components/        # UI Components
│   ├── ui/           # Reusable UI
│   └── shared/       # Shared Components
├── routes/           # Pages
├── lib/              # Utilities
│   ├── supabase/    # Backend Config
│   └── utils/
└── hooks/            # Custom Hooks
```

## جایگزینی Backend

برای استفاده از API خودتان:

1. فایل `src/features/assets/services/assetService.ts` را باز کنید
2. توابع را به API خودتان متصل کنید
3. مثال:

```typescript
async getAll(): Promise<Asset[]> {
  const response = await fetch('https://your-api.com/api/assets');
  return response.json();
}
```

## مستندات

- [راهنمای Setup Supabase](./SUPABASE_SETUP.md)
- [AI Playbook](../.ai-playbook/README.md)

## لایسنس

MIT
