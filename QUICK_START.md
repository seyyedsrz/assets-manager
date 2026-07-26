# شروع سریع ⚡

## گام 1: نصب Dependencies

```bash
cd asset-manager
npm install
```

## گام 2: تنظیم Environment Variables

```bash
copy .env.example .env
```

فایل `.env` رو باز کنید و مقادیر Supabase رو وارد کنید:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

💡 **نکته**: برای دریافت کلیدها، به [راهنمای Supabase](./SUPABASE_SETUP.md) مراجعه کنید.

## گام 3: ایجاد جداول Database

در Supabase SQL Editor کد زیر را اجرا کنید:

```sql
-- جدول اموال
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_name VARCHAR(100) NOT NULL,
  asset_number VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'in_possession',
  category VARCHAR(50) NOT NULL,
  estimated_value BIGINT,
  description TEXT,
  image_url TEXT,
  registration_date TIMESTAMP DEFAULT NOW(),
  received_from VARCHAR(100),
  transferred_to VARCHAR(100),
  transfer_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول تاریخچه
CREATE TABLE transfer_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  from_person VARCHAR(100),
  to_person VARCHAR(100),
  transfer_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## گام 4: اجرای پروژه

```bash
npm run dev
```

🎉 **تمام!** پروژه در http://localhost:3000 در دسترس است

## مشکلات رایج

### ❌ پروژه اجرا نمیشه
- مطمئن شوید `node_modules` نصب شده: `npm install`
- پورت 3000 رو هیچ برنامه دیگه‌ای استفاده نمی‌کنه

### ❌ خطای Supabase
- Environment Variables رو چک کنید
- مطمئن شوید جداول ساخته شده‌اند
- Connection رو در Supabase Dashboard چک کنید

### ❌ Build Error
- Dependencies رو دوباره نصب کنید: `rm -rf node_modules && npm install`
- Cache رو پاک کنید: `npm run build -- --force`

## مراحل بعدی

1. ✅ اولین دارایی رو ثبت کنید
2. ✅ فیلترها و جستجو رو امتحان کنید
3. ✅ یک دارایی رو انتقال بدید
4. ✅ پروژه رو سفارشی‌سازی کنید

## Need Help?

- 📖 [مستندات کامل](./README.md)
- 🔧 [راهنمای Supabase](./SUPABASE_SETUP.md)
- 💬 Issue ثبت کنید
