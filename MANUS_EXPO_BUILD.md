# بناء APK حقيقي باستخدام Manus و Expo EAS

## ✅ الخطوات المطلوبة

### 1. إنشاء حساب Expo (مجاني)

1. اذهب إلى: https://expo.dev
2. انقر "Sign up"
3. استخدم البريد: tulipaymn@gmail.com
4. استخدم كلمة المرور: Koka1508**
5. أكمل التسجيل

---

### 2. إنشاء Personal Access Token

1. اذهب إلى: https://expo.dev/settings/access-tokens
2. انقر "Create Token"
3. اختر اسم: "invoice-pro-build"
4. انقر "Create"
5. **انسخ الـ Token** (لن تستطيع رؤيته مرة أخرى)

---

### 3. إضافة Token إلى GitHub

1. اذهب إلى: https://github.com/oka-soft/invoice-pro-app/settings/secrets/actions
2. انقر "New repository secret"
3. الاسم: `EXPO_TOKEN`
4. القيمة: (الـ Token الذي نسخته)
5. انقر "Add secret"

---

### 4. تشغيل البناء

**الطريقة 1: من GitHub (تلقائي)**
```
1. اذهب إلى: https://github.com/oka-soft/invoice-pro-app
2. انقر "Actions"
3. اختر "Build APK with Expo EAS"
4. انقر "Run workflow"
5. انتظر 30-45 دقيقة
```

**الطريقة 2: من Terminal (محلي)**
```bash
cd /home/ubuntu/invoice-pro-app
eas login
eas build --platform android
```

---

## 📱 بعد انتهاء البناء

### ستحصل على:
- ✅ رابط تحميل مباشر للـ APK
- ✅ رمز QR للتحميل السريع
- ✅ ملف APK جاهز للتثبيت

### التثبيت على الهاتف:
1. حمّل APK
2. انقل إلى الهاتف
3. اضغط على الملف
4. اختر "Install"

---

## 🔍 متابعة البناء

### من GitHub:
```
1. اذهب إلى Actions
2. اختر آخر workflow run
3. شاهد التقدم
4. عند الانتهاء، ستجد APK في Artifacts
```

### من Terminal:
```bash
# عرض حالة البناء
eas build:list

# عرض تفاصيل بناء معين
eas build:view <BUILD_ID>
```

---

## ⏱️ الوقت المطلوب

| المرحلة | الوقت |
|--------|-------|
| إنشاء حساب | 5 دقائق |
| إنشاء Token | 2 دقيقة |
| إضافة إلى GitHub | 2 دقيقة |
| البناء | 30-45 دقيقة |
| **المجموع** | **40-55 دقيقة** |

---

## 🆘 استكشاف الأخطاء

### خطأ: "Invalid EXPO_TOKEN"
**الحل:**
1. تحقق من Token في GitHub Secrets
2. أعد إنشاء Token من Expo
3. حدّث Secret في GitHub

### خطأ: "Build failed"
**الحل:**
1. تحقق من أن المشروع يعمل محلياً
2. جرّب البناء من Terminal
3. تحقق من السجلات في Expo Dashboard

### خطأ: "Timeout"
**الحل:**
1. الخوادم مشغولة، حاول لاحقاً
2. استخدم `--wait` مع EAS CLI

---

## 💡 نصائح مهمة

1. ✅ احفظ Token في مكان آمن
2. ✅ لا تشارك Token مع أحد
3. ✅ استخدم Token واحد فقط لكل مشروع
4. ✅ يمكنك حذف Token وإنشاء واحد جديد في أي وقت

---

## 🎯 الخطوات السريعة

```bash
# 1. تثبيت EAS
npm install -g eas-cli

# 2. تسجيل الدخول
eas login

# 3. بناء APK
cd /home/ubuntu/invoice-pro-app
eas build --platform android

# 4. اختر الخيارات:
# - Build type: apk
# - Distribution: internal
```

---

## 📊 مقارنة الطرق

| الطريقة | السهولة | السرعة | الموثوقية |
|--------|--------|--------|----------|
| GitHub Actions | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Terminal محلي | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Android Studio | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🔗 روابط مفيدة

- **Expo Dashboard:** https://expo.dev/dashboard
- **EAS Documentation:** https://docs.expo.dev/build/setup/
- **GitHub Repository:** https://github.com/oka-soft/invoice-pro-app
- **Expo CLI Reference:** https://docs.expo.dev/build/setup/

---

## ✨ المميزات

✅ بناء سحابي (بدون تثبيت Android SDK)
✅ توقيع تلقائي
✅ سريع وموثوق
✅ دعم كامل من Expo
✅ يعمل على أي نظام تشغيل

---

**استمتع ببناء تطبيقك! 🚀**
