import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View as RNView,
} from 'react-native';
import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';
import { InvoiceItem, Customer, Invoice, CompanySettings } from '@/lib/types';
import { calculateInvoice, formatCurrency } from '@/lib/invoice-calculator';
import { saveInvoice, getCompanySettings } from '@/lib/storage';
import { cn } from '@/lib/utils';
import uuid from 'react-native-uuid';

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: uuid.v4().toString(),
      name: '',
      price: 0,
      quantity: 1,
      discountType: 'percentage',
      discountValue: 0,
    },
  ]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'template1' | 'template2' | 'template3'>('template1');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    setLoading(true);
    try {
      const settings = await getCompanySettings();
      setCompanySettings(settings);
    } catch (error) {
      console.error('Error loading company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuid.v4().toString(),
        name: '',
        price: 0,
        quantity: 1,
        discountType: 'percentage',
        discountValue: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      Alert.alert('تنبيه', 'يجب أن تحتوي الفاتورة على صنف واحد على الأقل');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleSaveInvoice = async () => {
    // التحقق من البيانات
    if (items.some(item => !item.name.trim() || item.price <= 0)) {
      Alert.alert('خطأ', 'يرجى ملء جميع بيانات الأصناف بشكل صحيح');
      return;
    }

    setSaving(true);
    try {
      const calculation = calculateInvoice(items);
      const invoice: Invoice = {
        id: uuid.v4().toString(),
        createdAt: new Date().toISOString(),
        customer,
        items,
        companySettings: companySettings || {
          name: '',
          address: '',
          phone: '',
        },
        templateId: selectedTemplate,
        subtotal: calculation.subtotal,
        totalDiscount: calculation.totalDiscount,
        total: calculation.total,
      };

      await saveInvoice(invoice);
      Alert.alert('نجح', 'تم حفظ الفاتورة بنجاح');
      router.back();
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الفاتورة');
      console.error('Error saving invoice:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculation = calculateInvoice(items);

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
            <Text className="text-3xl font-bold text-foreground mb-2">فاتورة جديدة</Text>
          </View>

          {/* بيانات العميل */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">بيانات العميل</Text>

            <RNView>
              <Text className="text-sm font-semibold text-foreground mb-2">الاسم</Text>
              <TextInput
                placeholder="أدخل اسم العميل (اختياري)"
                value={customer.name}
                onChangeText={(text) => setCustomer({ ...customer, name: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
              />
            </RNView>

            <RNView>
              <Text className="text-sm font-semibold text-foreground mb-2">الهاتف</Text>
              <TextInput
                placeholder="أدخل رقم الهاتف (اختياري)"
                value={customer.phone}
                onChangeText={(text) => setCustomer({ ...customer, phone: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                keyboardType="phone-pad"
              />
            </RNView>

            <RNView>
              <Text className="text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</Text>
              <TextInput
                placeholder="أدخل البريد الإلكتروني (اختياري)"
                value={customer.email}
                onChangeText={(text) => setCustomer({ ...customer, email: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                keyboardType="email-address"
              />
            </RNView>

            <RNView>
              <Text className="text-sm font-semibold text-foreground mb-2">العنوان</Text>
              <TextInput
                placeholder="أدخل عنوان العميل (اختياري)"
                value={customer.address}
                onChangeText={(text) => setCustomer({ ...customer, address: text })}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#9BA1A6"
                multiline
                numberOfLines={2}
              />
            </RNView>
          </View>

          {/* الأصناف */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">الأصناف</Text>

            {items.map((item, index) => (
              <View key={item.id} className="bg-surface border border-border rounded-lg p-4 gap-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-foreground">صنف {index + 1}</Text>
                  {items.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      className="bg-error px-3 py-1 rounded"
                    >
                      <Text className="text-white text-xs font-semibold">حذف</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <RNView>
                  <Text className="text-xs text-muted mb-1">الاسم</Text>
                  <TextInput
                    placeholder="اسم الصنف"
                    value={item.name}
                    onChangeText={(text) => handleUpdateItem(item.id, { name: text })}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                    placeholderTextColor="#9BA1A6"
                  />
                </RNView>

                <View className="flex-row gap-2">
                  <RNView className="flex-1">
                    <Text className="text-xs text-muted mb-1">السعر</Text>
                    <TextInput
                      placeholder="0.00"
                      value={item.price.toString()}
                      onChangeText={(text) =>
                        handleUpdateItem(item.id, { price: parseFloat(text) || 0 })
                      }
                      className="bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                      placeholderTextColor="#9BA1A6"
                      keyboardType="decimal-pad"
                    />
                  </RNView>

                  <RNView className="flex-1">
                    <Text className="text-xs text-muted mb-1">الكمية</Text>
                    <TextInput
                      placeholder="1"
                      value={item.quantity.toString()}
                      onChangeText={(text) =>
                        handleUpdateItem(item.id, { quantity: parseInt(text) || 1 })
                      }
                      className="bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                      placeholderTextColor="#9BA1A6"
                      keyboardType="number-pad"
                    />
                  </RNView>
                </View>

                <View className="flex-row gap-2">
                  <RNView className="flex-1">
                    <Text className="text-xs text-muted mb-1">نوع الخصم</Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleUpdateItem(item.id, { discountType: 'percentage' })}
                        className={cn(
                          'flex-1 py-2 rounded-lg items-center',
                          item.discountType === 'percentage' ? 'bg-primary' : 'bg-surface border border-border'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-sm font-semibold',
                            item.discountType === 'percentage' ? 'text-white' : 'text-foreground'
                          )}
                        >
                          %
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleUpdateItem(item.id, { discountType: 'fixed' })}
                        className={cn(
                          'flex-1 py-2 rounded-lg items-center',
                          item.discountType === 'fixed' ? 'bg-primary' : 'bg-surface border border-border'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-sm font-semibold',
                            item.discountType === 'fixed' ? 'text-white' : 'text-foreground'
                          )}
                        >
                          مبلغ
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </RNView>

                  <RNView className="flex-1">
                    <Text className="text-xs text-muted mb-1">قيمة الخصم</Text>
                    <TextInput
                      placeholder="0"
                      value={item.discountValue.toString()}
                      onChangeText={(text) =>
                        handleUpdateItem(item.id, { discountValue: parseFloat(text) || 0 })
                      }
                      className="bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                      placeholderTextColor="#9BA1A6"
                      keyboardType="decimal-pad"
                    />
                  </RNView>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddItem}
              className="bg-surface border-2 border-dashed border-primary rounded-lg py-3 items-center"
            >
              <Text className="text-primary font-semibold">+ إضافة صنف</Text>
            </TouchableOpacity>
          </View>

          {/* الملخص */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground mb-2">الملخص</Text>

            <View className="flex-row justify-between">
              <Text className="text-foreground">الإجمالي قبل الخصم:</Text>
              <Text className="font-semibold text-foreground">{formatCurrency(calculation.subtotal)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-foreground">إجمالي الخصم:</Text>
              <Text className="font-semibold text-error">-{formatCurrency(calculation.totalDiscount)}</Text>
            </View>

            <View className="border-t border-border pt-3 flex-row justify-between">
              <Text className="text-lg font-bold text-foreground">الإجمالي النهائي:</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(calculation.total)}</Text>
            </View>

            <View className="bg-background rounded-lg p-3 mt-2">
              <Text className="text-xs text-muted mb-1">بالكلمات:</Text>
              <Text className="text-sm text-foreground font-semibold">{calculation.totalInWords}</Text>
            </View>
          </View>

          {/* اختيار القالب */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">اختر قالب الفاتورة</Text>
            <View className="flex-row gap-2">
              {(['template1', 'template2', 'template3'] as const).map((template) => (
                <TouchableOpacity
                  key={template}
                  onPress={() => setSelectedTemplate(template)}
                  className={cn(
                    'flex-1 py-3 rounded-lg items-center border-2',
                    selectedTemplate === template
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold',
                      selectedTemplate === template ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {template === 'template1' ? 'بسيط' : template === 'template2' ? 'احترافي' : 'حديث'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* الأزرار */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 bg-border rounded-lg py-3 items-center"
            >
              <Text className="text-foreground font-semibold">إلغاء</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveInvoice}
              disabled={saving}
              className={cn(
                'flex-1 bg-primary rounded-lg py-3 items-center',
                saving && 'opacity-70'
              )}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold">حفظ الفاتورة</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
