# نظام إدارة الأوفر تايم (AFF)

واجهة React + TypeScript + Tailwind لإدارة طلبات الشغل الإضافي في المصانع.

## التشغيل محليًا
```bash
npm install
npm run dev
```

## البناء
```bash
npm run build      # الناتج في dist/
npm run typecheck  # فحص TypeScript (اختياري)
```

## النشر على GitHub Pages
1. ارفع المشروع على GitHub (فرع `main`).
2. من **Settings → Pages** اختار **Source: GitHub Actions**.
3. أي push على `main` هينشر الموقع تلقائيًا.

## ملاحظات
- البيانات تجريبية (`src/data/mockData.ts`) ومحفوظة في المتصفح فقط.
- فولدر `legacy/` فيه ملفات قديمة غير مستخدمة، محفوظة للرجوع إليها.
- ⚠️ كلمات المرور في `mockData.ts` تجريبية وظاهرة في الكود. غيّرها ولا تستخدم السيستم ببيانات حقيقية قبل إضافة باك إند ومصادقة فعلية.
