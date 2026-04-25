import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { CompanySettings } from '@/lib/types';
import { saveCompanySettings, getCompanySettings } from '@/lib/storage';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    address: '',
    phone: '',
    logo: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // تحميل الإعدادات عند فتح الشاشة
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const savedSettings = await getCompanySettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الشركة');
      return;
    }

    setSaving(true);
    try {
      await saveCompanySettings(settings);
      Alert.alert('نجح', 'تم حفظ الإعدادات بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الإعدادات');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSettings({
          ...settings,
          logo: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
      console.error('Error picking image:', error);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6 pb-8">
          {/* العنوان */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">إعدادات الشركة</Text>
            <Text className="text-base text-muted">
              أدخل بيانات شركتك هنا. جميع الحقول اختيارية.
            </Text>
          </View>

          {/* الشعار */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">الشعار</Text>
            <TouchableOpacity
              onPress={handlePickImage}
              className="bg-surface border-2 border-dashed border-border rounded-lg p-6 items-center justify-center min-h-40"
            >
              {settings.logo ? (
                <Image
                  source={{ uri: settings.logo }}
                  className="w-32 h-32 rounded-lg"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center gap-2">
                  <Text className="text-4xl">📷</Text>
                  <Text className="text-sm text-muted text-center">
                    اضغط لاختيار الشعار
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* اسم الشركة */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">اسم الشركة</Text>
            <TextInput
              placeholder="أدخل اسم الشركة"
              value={settings.name}
              onChangeText={(text) => setSettings({ ...settings, name: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#9BA1A6"
            />
          </View>

          {/* العنوان */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">العنوان</Text>
            <TextInput
              placeholder="أدخل عنوان الشركة"
              value={settings.address}
              onChangeText={(text) => setSettings({ ...settings, address: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#9BA1A6"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* رقم الهاتف */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">رقم الهاتف</Text>
            <TextInput
              placeholder="أدخل رقم الهاتف"
              value={settings.phone}
              onChangeText={(text) => setSettings({ ...settings, phone: text })}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#9BA1A6"
              keyboardType="phone-pad"
            />
          </View>

          {/* زر الحفظ */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className={cn(
              'bg-primary rounded-lg py-4 items-center justify-center',
              saving && 'opacity-70'
            )}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">حفظ الإعدادات</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
