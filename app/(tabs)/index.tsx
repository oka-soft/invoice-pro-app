import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter, useFocusEffect } from 'expo-router';
import { Invoice } from '@/lib/types';
import { getAllInvoices, deleteInvoice } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function HomeScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  // تحميل الفواتير عند فتح الشاشة
  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const allInvoices = await getAllInvoices();
      setInvoices(allInvoices.reverse()); // عرض الأحدث أولاً
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = (id: string) => {
    Alert.alert('حذف الفاتورة', 'هل أنت متأكد من حذف هذه الفاتورة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteInvoice(id);
            loadInvoices();
            Alert.alert('نجح', 'تم حذف الفاتورة بنجاح');
          } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء حذف الفاتورة');
            console.error('Error deleting invoice:', error);
          }
        },
      },
    ]);
  };

  const handleCreateInvoice = () => {
    router.push('/create-invoice');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    router.push({
      pathname: '/invoice-detail',
      params: { invoiceId: invoice.id },
    });
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      onPress={() => handleViewInvoice(item)}
      className="bg-surface border border-border rounded-lg p-4 mb-3 active:opacity-70"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">
            {item.customer.name || 'عميل بدون اسم'}
          </Text>
          <Text className="text-sm text-muted mt-1">
            {new Date(item.createdAt).toLocaleDateString('ar-SA')}
          </Text>
        </View>
        <Text className="text-lg font-bold text-primary">
          {item.total.toFixed(2)} ر.س
        </Text>
      </View>

      {item.customer.phone && (
        <Text className="text-sm text-muted mb-2">{item.customer.phone}</Text>
      )}

      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={() => handleDeleteInvoice(item.id)}
          className="flex-1 bg-error rounded-lg py-2 items-center"
        >
          <Text className="text-white font-semibold text-sm">حذف</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleViewInvoice(item)}
          className="flex-1 bg-primary rounded-lg py-2 items-center"
        >
          <Text className="text-white font-semibold text-sm">عرض</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4 flex-1">
      <View className="flex-1">
        {/* العنوان */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">الفواتير</Text>
          <Text className="text-base text-muted mt-1">
            {invoices.length} فاتورة محفوظة
          </Text>
        </View>

        {/* قائمة الفواتير */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        ) : invoices.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-6xl">📋</Text>
            <Text className="text-lg font-semibold text-foreground text-center">
              لا توجد فواتير بعد
            </Text>
            <Text className="text-sm text-muted text-center">
              اضغط على الزر أدناه لإنشاء فاتورة جديدة
            </Text>
          </View>
        ) : (
          <FlatList
            data={invoices}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}

        {/* زر إنشاء فاتورة جديدة */}
        <TouchableOpacity
          onPress={handleCreateInvoice}
          className="bg-primary rounded-lg py-4 items-center justify-center mt-auto"
        >
          <Text className="text-white font-semibold text-base">+ إنشاء فاتورة جديدة</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
