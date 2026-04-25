# دليل بناء APK حقيقي - Invoice Pro App

## ⚠️ المشكلة الحالية
GitHub Actions وحده لا يمكنه بناء APK حقيقي لأنه يحتاج إلى:
- Android SDK كامل
- Gradle
- Keystore للتوقيع
- موارد كبيرة جداً

## ✅ الحلول المتاحة

### الحل 1: استخدام Expo EAS (الأفضل والأسهل)

**المميزات:**
- بناء سحابي بدون الحاجة لـ Android SDK محلياً
- توقيع تلقائي
- دعم كامل من Expo

**الخطوات:**

1. **إنشاء حساب Expo:**
   ```bash
   npm install -g eas-cli
   eas auth:login
   # أو
   eas auth:register
   ```

2. **بناء APK:**
   ```bash
   cd /home/ubuntu/invoice-pro-app
   eas build --platform android --local
   ```

3. **أو بناء من GitHub Actions:**
   - أضف EAS token إلى GitHub Secrets
   - استخدم Workflow محسّن

---

### الحل 2: بناء محلي باستخدام Android Studio

**المتطلبات:**
- Android Studio
- Android SDK 34+
- Java 17+
- 10GB مساحة حرة

**الخطوات:**

```bash
# 1. تصدير المشروع
cd /home/ubuntu/invoice-pro-app
npx expo export --platform android

# 2. فتح Android Studio
# 3. File > Open > اختر مجلد dist
# 4. Build > Build Bundle(s) / APK(s)
```

---

### الحل 3: استخدام Docker

**الفائدة:** بيئة معزولة وموثوقة

```bash
docker run --rm -v /home/ubuntu/invoice-pro-app:/app \
  reactnativecommunity/react-native-android \
  bash -c "cd /app && npm install && npm run build:android"
```

---

## 🚀 الطريقة الموصى بها: Expo EAS

### خطوات سريعة:

1. **تثبيت EAS:**
   ```bash
   npm install -g eas-cli
   ```

2. **تسجيل الدخول:**
   ```bash
   eas auth:login
   ```

3. **بناء APK:**
   ```bash
   cd /home/ubuntu/invoice-pro-app
   eas build --platform android --local
   ```

4. **تحميل APK:**
   - سيتم حفظ APK في مجلد المشروع
   - يمكنك نقله إلى هاتفك والتثبيت

---

## 📱 اختبار التطبيق قبل البناء

### على Expo Go (الأسهل):

```bash
cd /home/ubuntu/invoice-pro-app
pnpm dev
# امسح QR code بهاتفك
```

### على محاكي Android:

```bash
cd /home/ubuntu/invoice-pro-app
npx expo start --android
```

---

## 🔐 التوقيع والإصدار

بعد بناء APK:

```bash
# توقيع APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore \
  app-release-unsigned.apk alias_name

# التحقق
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

---

## 📊 مقارنة الطرق

| الطريقة | السهولة | السرعة | التكلفة | الموثوقية |
|--------|--------|--------|--------|----------|
| Expo EAS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | مجاني | ⭐⭐⭐⭐⭐ |
| Android Studio | ⭐⭐⭐ | ⭐⭐⭐ | مجاني | ⭐⭐⭐⭐ |
| Docker | ⭐⭐ | ⭐⭐ | مجاني | ⭐⭐⭐ |

---

## 💡 نصائح

1. **اختبر أولاً على Expo Go** قبل البناء
2. **استخدم Expo EAS** للبناء الأول
3. **احفظ Keystore** في مكان آمن
4. **اختبر APK** على أجهزة حقيقية قبل النشر

---

## 🆘 استكشاف الأخطاء

### خطأ: "No Android SDK found"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### خطأ: "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew build
```

### خطأ: "Keystore not found"
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

---

## 📞 الدعم

- **Expo Docs:** https://docs.expo.dev/build/setup/
- **React Native Docs:** https://reactnative.dev/docs/signed-apk-android
- **GitHub Issues:** https://github.com/oka-soft/invoice-pro-app/issues
