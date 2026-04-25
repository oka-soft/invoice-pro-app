# دليل بناء APK باستخدام Android Studio - شرح مفصل

## 📋 المتطلبات الأساسية

### 1. تثبيت Android Studio
- **اذهب إلى:** https://developer.android.com/studio
- **حمّل:** أحدث إصدار لنظام التشغيل الخاص بك
- **ثبّت:** اتبع معالج التثبيت

### 2. المتطلبات الإضافية
- **Java Development Kit (JDK):** إصدار 17 أو أحدث
- **Android SDK:** إصدار 34 أو أحدث
- **Gradle:** سيتم تثبيته تلقائياً
- **مساحة تخزين:** 10GB على الأقل

---

## 🔧 الخطوة 1: إعداد Android Studio

### بعد التثبيت:

1. **افتح Android Studio**
2. **انتظر التحديثات الأولية** (قد تستغرق عدة دقائق)
3. **اذهب إلى:** Tools → SDK Manager
4. **تحقق من التثبيت:**
   - ✓ Android SDK Platform 34
   - ✓ Android SDK Build-Tools 34.0.0
   - ✓ Android Emulator (اختياري)
   - ✓ Android SDK Platform-Tools

### إذا لم تكن مثبتة:
1. انقر على "SDK Platforms" tab
2. اختر "Android 14 (API 34)"
3. انقر "Apply" ثم "OK"
4. انتظر التثبيت

---

## 📁 الخطوة 2: تصدير المشروع من Expo

### على جهازك (في Terminal):

```bash
# 1. انتقل إلى مجلد المشروع
cd /home/ubuntu/invoice-pro-app

# 2. تصدير للـ Android
npx expo export --platform android

# 3. سيتم إنشاء مجلد "dist"
# المجلد الناتج يحتوي على:
# - dist/metadata.json
# - dist/_expo/
# - ملفات أخرى
```

---

## 🎯 الخطوة 3: فتح المشروع في Android Studio

### الطريقة الأولى: من الواجهة

1. **افتح Android Studio**
2. **انقر:** File → Open
3. **اختر:** مجلد `/home/ubuntu/invoice-pro-app`
4. **انقر:** OK
5. **انتظر:** Gradle Sync (قد يستغرق 5-10 دقائق)

### الطريقة الثانية: من Terminal

```bash
cd /home/ubuntu/invoice-pro-app
open -a "Android Studio" .
# أو على Linux:
android-studio .
```

---

## ⚙️ الخطوة 4: إعدادات المشروع

### بعد فتح المشروع:

1. **انتظر Gradle Sync** ليكتمل
   - ستظهر شريط في الأسفل
   - انتظر حتى يصبح أخضر ✓

2. **تحقق من البنية:**
   - الجانب الأيسر: Project Structure
   - يجب أن ترى:
     - app/
     - gradle/
     - build.gradle
     - settings.gradle

3. **إذا حدث خطأ:**
   - انقر: File → Sync Now
   - أو: Build → Clean Project

---

## 🔑 الخطوة 5: إنشاء Keystore (للتوقيع)

### ما هو Keystore؟
ملف يحتوي على مفتاح التوقيع الرقمي للتطبيق (مهم جداً)

### إنشاء Keystore:

1. **من القائمة العلوية:**
   - Build → Generate Signed Bundle / APK

2. **انقر:** APK (وليس Bundle)

3. **نافذة جديدة ستظهر:**
   - اختر: "Create new..." بجانب "Key store path"

4. **ملء البيانات:**
   ```
   Key store path: /Users/YourName/invoice-pro-app.jks
   Password: (اختر كلمة مرور قوية - احفظها!)
   Confirm: (أعد كتابة نفس الكلمة)
   ```

5. **بيانات المفتاح:**
   ```
   Alias: invoice-pro-key
   Password: (نفس الكلمة أعلاه أو مختلفة)
   Confirm: (أعد كتابة)
   Validity (years): 25
   ```

6. **بيانات الشركة (اختياري):**
   ```
   First and Last Name: Your Name
   Organizational Unit: Development
   Organization: Your Company
   City or Locality: Your City
   State or Province: Your State
   Country Code: SA (أو رمز دولتك)
   ```

7. **انقر:** OK

---

## 🏗️ الخطوة 6: بناء APK

### بعد إنشاء Keystore:

1. **نافذة "Select Destination Folder":**
   - اختر مجلد لحفظ APK
   - مثال: `/Users/YourName/Desktop/`
   - انقر: OK

2. **ملء بيانات التوقيع:**
   ```
   Key store path: (سيكون مملوء مسبقاً)
   Key store password: (أدخل الكلمة التي أنشأتها)
   Key alias: invoice-pro-key
   Key password: (الكلمة التي أدخلتها)
   ```

3. **اختر Build Variant:**
   - اختر: release
   - انقر: Create

4. **انتظر البناء:**
   - شريط التقدم يظهر في الأسفل
   - قد يستغرق 10-30 دقيقة
   - ستظهر رسالة: "APK(s) generated successfully"

---

## ✅ الخطوة 7: تحديد موقع APK

### بعد انتهاء البناء:

1. **نافذة البناء ستظهر:**
   - انقر: "locate" أو "show in folder"

2. **أو ابحث يدويًا:**
   ```
   /Users/YourName/Desktop/app-release.apk
   ```

3. **ستجد ملف APK:**
   - اسمه: `app-release.apk`
   - حجمه: حوالي 50-100 MB

---

## 📱 الخطوة 8: نقل APK إلى الهاتف

### الطريقة 1: عبر USB

1. **وصّل الهاتف بالكمبيوتر** عبر USB
2. **فعّل "USB Debugging"** على الهاتف:
   - Settings → About Phone
   - اضغط "Build Number" 7 مرات
   - ستظهر "Developer Options"
   - فعّل "USB Debugging"

3. **في Android Studio:**
   - Build → Select Build Variant
   - اختر: release
   - Run → Run 'app'
   - سيتم التثبيت تلقائياً

### الطريقة 2: نقل يدوي

1. **انسخ ملف APK:**
   ```bash
   cp app-release.apk /path/to/phone/storage/
   ```

2. **على الهاتف:**
   - افتح File Manager
   - اذهب إلى المجلد الذي نقلت فيه الملف
   - اضغط على APK
   - اختر "Install"

### الطريقة 3: عبر البريد الإلكتروني

1. **أرسل APK** إلى بريدك الإلكتروني
2. **على الهاتف:**
   - افتح البريد
   - حمّل الملف
   - اضغط عليه للتثبيت

---

## 🧪 الخطوة 9: اختبار التطبيق

### بعد التثبيت:

1. **افتح التطبيق** من قائمة التطبيقات
2. **اختبر الميزات:**
   - ✓ إنشاء فاتورة
   - ✓ إضافة أصناف
   - ✓ تطبيق الخصم
   - ✓ توليد PDF
   - ✓ المشاركة عبر WhatsApp
   - ✓ البحث والتصفية

3. **إذا حدث خطأ:**
   - افتح Logcat في Android Studio
   - ابحث عن الخطأ
   - أصلحه وأعد البناء

---

## 🔄 الخطوة 10: إعادة البناء (للتحديثات)

### عند إجراء تغييرات:

1. **عدّل الكود** في المشروع
2. **صدّر مرة أخرى:**
   ```bash
   npx expo export --platform android
   ```

3. **في Android Studio:**
   - Build → Clean Project
   - Build → Rebuild Project

4. **أعد البناء:**
   - Build → Generate Signed Bundle / APK
   - اتبع نفس الخطوات (استخدم نفس Keystore)

---

## 🐛 استكشاف الأخطاء الشائعة

### خطأ 1: "Gradle sync failed"
**الحل:**
```bash
# في Terminal
cd /home/ubuntu/invoice-pro-app
./gradlew clean
./gradlew build
```

### خطأ 2: "SDK not found"
**الحل:**
1. File → Project Structure
2. SDK Location
3. تأكد من وجود Android SDK
4. إذا لم يكن موجوداً، انقر "Edit" وحدد المسار

### خطأ 3: "Build failed"
**الحل:**
1. Build → Clean Project
2. Build → Rebuild Project
3. إذا استمر الخطأ، تحقق من Logcat

### خطأ 4: "Keystore password incorrect"
**الحل:**
- تأكد من كتابة كلمة المرور بشكل صحيح
- إذا نسيتها، أنشئ keystore جديد

### خطأ 5: "APK too large"
**الحل:**
```bash
# تقليل حجم APK
# في build.gradle:
android {
    bundle {
        language.enableSplit = true
        density.enableSplit = true
    }
}
```

---

## 💾 حفظ Keystore بأمان

### ⚠️ مهم جداً:

1. **احفظ Keystore في مكان آمن:**
   ```bash
   cp invoice-pro-app.jks ~/secure-location/
   ```

2. **احفظ كلمة المرور:**
   - في ملف نصي مشفر
   - أو في مدير كلمات مرور

3. **لا تشاركها:**
   - لا تضعها في GitHub
   - لا تشاركها مع أحد

4. **للنشر على Google Play:**
   - ستحتاج إلى نفس Keystore
   - إذا فقدتها، لن تستطيع تحديث التطبيق

---

## 📊 ملخص الخطوات

| الخطوة | الوصف | الوقت |
|-------|-------|-------|
| 1 | تثبيت Android Studio | 30 دقيقة |
| 2 | تصدير من Expo | 5 دقائق |
| 3 | فتح في Android Studio | 10 دقائق |
| 4 | Gradle Sync | 10 دقائق |
| 5 | إنشاء Keystore | 5 دقائق |
| 6 | بناء APK | 20 دقيقة |
| 7 | نقل إلى الهاتف | 5 دقائق |
| 8 | الاختبار | 10 دقائق |
| **المجموع** | | **95 دقيقة** |

---

## 🎉 النتيجة النهائية

بعد اتباع هذه الخطوات، ستحصل على:
- ✅ ملف APK جاهز للتثبيت
- ✅ التطبيق يعمل على أي هاتف Android
- ✅ Keystore محفوظ للتحديثات المستقبلية
- ✅ تطبيق موقّع رسمياً

---

## 📞 نصائح إضافية

1. **للنشر على Google Play:**
   - استخدم نفس Keystore
   - اتبع إرشادات Google Play

2. **للتوزيع المباشر:**
   - شارك ملف APK عبر البريد أو WhatsApp
   - المستخدمون يمكنهم تثبيته مباشرة

3. **للاختبار على أجهزة متعددة:**
   - استخدم Android Emulator
   - أو وصّل عدة أجهزة عبر USB

4. **لتقليل حجم APK:**
   - استخدم ProGuard/R8
   - أزل الموارد غير المستخدمة
   - استخدم Dynamic Feature Modules

---

## 🔗 روابط مفيدة

- **Android Studio Docs:** https://developer.android.com/studio/intro
- **Build APK Guide:** https://developer.android.com/studio/publish/app-signing
- **Expo Android Build:** https://docs.expo.dev/build/setup/
- **Google Play Console:** https://play.google.com/console

---

**استمتع ببناء تطبيقك! 🚀**
