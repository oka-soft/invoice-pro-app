import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Invoice } from '@/lib/types';
import { getInvoice } from '@/lib/storage';
import { formatCurrency } from '@/lib/invoice-calculator';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { cn } from '@/lib/utils';
import { printInvoice } from '@/lib/print-service';

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const { invoiceId } = useLocalSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    if (!invoiceId) return;

    setLoading(true);
    try {
      const inv = await getInvoice(invoiceId as string);
      setInvoice(inv);
    } catch (error) {
      console.error('Error loading invoice:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الفاتورة');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceText = (): string => {
    if (!invoice) return '';

    const itemsText = invoice.items
      .map(
        (item) =>
          `${item.name}\nالسعر: ${formatCurrency(item.price)}\nالكمية: ${item.quantity}\nالخصم: ${item.discountType === 'percentage' ? item.discountValue + '%' : formatCurrency(item.discountValue)}\nالإجمالي: ${formatCurrency(
            item.price * item.quantity -
              (item.discountType === 'percentage'
                ? (item.price * item.quantity * item.discountValue) / 100
                : item.discountValue)
          )}`
      )
      .join('\n\n');

    return `
=====================================
           الفاتورة
=====================================

تاريخ: ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
رقم الفاتورة: ${invoice.id}

-------------------------------------
بيانات الشركة
-------------------------------------
${invoice.companySettings.name}
${invoice.companySettings.address}
${invoice.companySettings.phone}

-------------------------------------
بيانات العميل
-------------------------------------
الاسم: ${invoice.customer.name || '-'}
الهاتف: ${invoice.customer.phone || '-'}
البريد: ${invoice.customer.email || '-'}
العنوان: ${invoice.customer.address || '-'}

-------------------------------------
الأصناف
-------------------------------------
${itemsText}

-------------------------------------
الملخص
-------------------------------------
الإجمالي قبل الخصم: ${formatCurrency(invoice.subtotal)}
إجمالي الخصم: ${formatCurrency(invoice.totalDiscount)}
الإجمالي النهائي: ${formatCurrency(invoice.total)}

=====================================
شكراً لك على تعاملك معنا
    `;
  };

  const handleShareWhatsApp = async () => {
    setSharing(true);
    try {
      if (Platform.OS === 'web') {
        Alert.alert('تنبيه', 'المشاركة عبر WhatsApp غير متاحة على الويب');
        setSharing(false);
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('خطأ', 'المشاركة غير متاحة على هذا الجهاز');
        setSharing(false);
        return;
      }

      const fileName = `invoice_${invoice?.id}.txt`;
      const filePath = (FileSystem.documentDirectory || '') + fileName;
      const content = generateInvoiceText();

      await FileSystem.writeAsStringAsync(filePath, content);
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/plain',
        dialogTitle: 'مشاركة الفاتورة',
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة الفاتورة');
    } finally {
      setSharing(false);
    }
  };

  const handlePrintInvoice = async () => {
    setPrinting(true);
    try {
      const templateMap: Record<string, 'classic' | 'professional' | 'modern'> = {
        'template1': 'classic',
        'template2': 'professional',
        'template3': 'modern',
      };
      const templateType = templateMap[invoice?.templateId || 'template1'] || 'classic';
      await printInvoice(invoice!, templateType);
      Alert.alert('نجح', 'تم إرسال الفاتورة للطباعة');
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('خطأ', 'فشل في الطباعة');
    } finally {
      setPrinting(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  if (!invoice) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <Text className="text-foreground">لم يتم العثور على الفاتورة</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6 pb-8">
          {/* العنوان */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">تفاصيل الفاتورة</Text>
            <Text className="text-sm text-muted">
              {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
            </Text>
          </View>

          {/* بيانات الشركة */}
          {invoice.companySettings.name && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-muted">الشركة</Text>
              <Text className="text-lg font-bold text-foreground">{invoice.companySettings.name}</Text>
              {invoice.companySettings.address && (
                <Text className="text-sm text-foreground">{invoice.companySettings.address}</Text>
              )}
              {invoice.companySettings.phone && (
                <Text className="text-sm text-foreground">{invoice.companySettings.phone}</Text>
              )}
            </View>
          )}

          {/* بيانات العميل */}
          {invoice.customer.name && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-muted">العميل</Text>
              <Text className="text-lg font-bold text-foreground">{invoice.customer.name}</Text>
              {invoice.customer.phone && (
                <Text className="text-sm text-foreground">{invoice.customer.phone}</Text>
              )}
              {invoice.customer.email && (
                <Text className="text-sm text-foreground">{invoice.customer.email}</Text>
              )}
              {invoice.customer.address && (
                <Text className="text-sm text-foreground">{invoice.customer.address}</Text>
              )}
            </View>
          )}

          {/* الأصناف */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">الأصناف</Text>
            {invoice.items.map((item) => (
              <View key={item.id} className="bg-surface border border-border rounded-lg p-4 gap-2">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted mt-1">
                      {item.quantity} × {formatCurrency(item.price)}
                    </Text>
                  </View>
                  <Text className="text-base font-bold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>

                {item.discountValue > 0 && (
                  <View className="flex-row justify-between pt-2 border-t border-border">
                    <Text className="text-sm text-muted">
                      خصم {item.discountType === 'percentage' ? item.discountValue + '%' : formatCurrency(item.discountValue)}
                    </Text>
                    <Text className="text-sm text-error">
                      -{formatCurrency(
                        item.discountType === 'percentage'
                          ? (item.price * item.quantity * item.discountValue) / 100
                          : item.discountValue
                      )}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* الملخص */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-3">
            <View className="flex-row justify-between">
              <Text className="text-foreground">الإجمالي قبل الخصم:</Text>
              <Text className="font-semibold text-foreground">{formatCurrency(invoice.subtotal)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-foreground">إجمالي الخصم:</Text>
              <Text className="font-semibold text-error">-{formatCurrency(invoice.totalDiscount)}</Text>
            </View>

            <View className="border-t border-border pt-3 flex-row justify-between">
              <Text className="text-lg font-bold text-foreground">الإجمالي النهائي:</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(invoice.total)}</Text>
            </View>
          </View>

          {/* الأزرار */}
          <View className="gap-2">
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 bg-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">رجوع</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShareWhatsApp}
                disabled={sharing}
                className={cn(
                  'flex-1 bg-success rounded-lg py-3 items-center',
                  sharing && 'opacity-70'
                )}
              >
                {sharing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-semibold">مشاركة</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handlePrintInvoice}
              disabled={printing}
              className={cn(
                'bg-primary rounded-lg py-3 items-center',
                printing && 'opacity-70'
              )}
            >
              {printing ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold">🖨️ طباعة الفاتورة</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
