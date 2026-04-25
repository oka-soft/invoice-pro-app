# إعداد GitHub لبناء APK

## الخطوات:

### 1. إنشاء Repository على GitHub
- اذهب إلى https://github.com/new
- أنشئ repository جديد باسم `invoice-pro-app`
- اختر "Public" أو "Private" حسب تفضيلك

### 2. دفع المشروع إلى GitHub
```bash
cd /home/ubuntu/invoice-pro-app
git remote add origin https://github.com/YOUR_USERNAME/invoice-pro-app.git
git branch -M main
git push -u origin main
```

### 3. تفعيل GitHub Actions
- اذهب إلى repository على GitHub
- انقر على "Actions" tab
- اختر "I understand my workflows, go ahead and enable them"

### 4. بناء APK تلقائياً
عند كل push إلى main branch، سيتم بناء APK تلقائياً:
- اذهب إلى "Actions" tab
- ابحث عن "Build APK" workflow
- انقر عليه لرؤية التفاصيل
- بعد انتهاء البناء، ستجد APK في "Artifacts"

### 5. تحميل APK
- انقر على workflow run
- انقر على "Artifacts"
- حمّل `invoice-pro-app.apk`

## ملاحظات:
- البناء قد يستغرق 10-15 دقيقة
- تأكد من أن لديك Java 11+ مثبتة محلياً
- يمكنك إنشاء release tags لحفظ إصدارات محددة

## مثال على الأوامر:
```bash
# إنشاء tag للإصدار
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

هذا سيقوم بإنشاء release على GitHub مع APK مرفق.
