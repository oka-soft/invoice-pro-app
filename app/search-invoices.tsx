import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';
import { Invoice } from '@/lib/types';
import { getAllInvoices } from '@/lib/storage';
import { searchAndFilterInvoices, getInvoiceStatistics, SearchFilters } from '@/lib/invoice-search';
import { formatCurrency } from '@/lib/invoice-calculator';
import { cn } from '@/lib/utils';

export default function SearchInvoicesScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, startDate, endDate, sortBy, sortOrder, invoices]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const allInvoices = await getAllInvoices();
      setInvoices(allInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filters: SearchFilters = {
      searchQuery,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    };

    const filtered = searchAndFilterInvoices(invoices, filters);
    setFilteredInvoices(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleDateRangePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  const statistics = getInvoiceStatistics(filteredInvoices);

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/invoice-detail', params: { invoiceId: item.id } })}
      className="bg-surface border border-border rounded-lg p-4 mb-3 active:opacity-70"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.customer.name || 'بدون اسم'}
          </Text>
          <Text className="text-xs text-muted mt-1">
            {new Date(item.createdAt).toLocaleDateString('ar-SA')}
          </Text>
        </View>
        <Text className="text-lg font-bold text-primary">{formatCurrency(item.total)}</Text>
      </View>

      {item.customer.phone && (
        <Text className="text-xs text-muted">{item.customer.phone}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* العنوان */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">البحث والتصفية</Text>
            <Text className="text-sm text-muted">
              ابحث عن الفواتير حسب اسم العميل أو التاريخ
            </Text>
          </View>

          {/* حقل البحث */}
          <View className="bg-surface border border-border rounded-lg px-4 py-2">
            <TextInput
              placeholder="ابحث عن اسم العميل أو رقم الفاتورة..."
              placeholderTextColor="#9BA1A6"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-foreground text-base"
              textAlign="right"
            />
          </View>

          {/* فلاتر التاريخ السريعة */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">نطاق التاريخ</Text>
            <View className="flex-row gap-2 flex-wrap">
              <TouchableOpacity
                onPress={() => handleDateRangePreset(7)}
                className={cn(
                  'px-4 py-2 rounded-lg border',
                  startDate && startDate.getDate() === new Date().getDate() - 7
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    startDate && startDate.getDate() === new Date().getDate() - 7
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  آخر 7 أيام
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDateRangePreset(30)}
                className={cn(
                  'px-4 py-2 rounded-lg border',
                  startDate && startDate.getDate() === new Date().getDate() - 30
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    startDate && startDate.getDate() === new Date().getDate() - 30
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  آخر 30 يوم
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDateRangePreset(90)}
                className={cn(
                  'px-4 py-2 rounded-lg border',
                  startDate && startDate.getDate() === new Date().getDate() - 90
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    startDate && startDate.getDate() === new Date().getDate() - 90
                      ? 'text-white'
                      : 'text-foreground'
                  )}
                >
                  آخر 90 يوم
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* خيارات الفرز */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">الفرز</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSortBy('date')}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border',
                  sortBy === 'date' ? 'bg-primary border-primary' : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-center',
                    sortBy === 'date' ? 'text-white' : 'text-foreground'
                  )}
                >
                  التاريخ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortBy('total')}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border',
                  sortBy === 'total' ? 'bg-primary border-primary' : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-center',
                    sortBy === 'total' ? 'text-white' : 'text-foreground'
                  )}
                >
                  الإجمالي
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortBy('customer')}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border',
                  sortBy === 'customer' ? 'bg-primary border-primary' : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-center',
                    sortBy === 'customer' ? 'text-white' : 'text-foreground'
                  )}
                >
                  العميل
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ترتيب الفرز */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSortOrder('desc')}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg border',
                sortOrder === 'desc' ? 'bg-primary border-primary' : 'bg-surface border-border'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  sortOrder === 'desc' ? 'text-white' : 'text-foreground'
                )}
              >
                تنازلي
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortOrder('asc')}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg border',
                sortOrder === 'asc' ? 'bg-primary border-primary' : 'bg-surface border-border'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold text-center',
                  sortOrder === 'asc' ? 'text-white' : 'text-foreground'
                )}
              >
                تصاعدي
              </Text>
            </TouchableOpacity>
          </View>

          {/* الإحصائيات */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">عدد الفواتير:</Text>
              <Text className="text-base font-bold text-foreground">{statistics.totalCount}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">الإجمالي:</Text>
              <Text className="text-base font-bold text-primary">
                {formatCurrency(statistics.totalAmount)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">المتوسط:</Text>
              <Text className="text-base font-bold text-foreground">
                {formatCurrency(statistics.averageInvoice)}
              </Text>
            </View>
          </View>

          {/* زر مسح الفلاتر */}
          {(searchQuery || startDate || endDate) && (
            <TouchableOpacity
              onPress={handleClearFilters}
              className="bg-warning rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">مسح الفلاتر</Text>
            </TouchableOpacity>
          )}

          {/* قائمة الفواتير */}
          {loading ? (
            <View className="flex items-center justify-center py-8">
              <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
          ) : filteredInvoices.length > 0 ? (
            <View>
              <Text className="text-sm font-semibold text-muted mb-3">
                {filteredInvoices.length} فاتورة
              </Text>
              <FlatList
                data={filteredInvoices}
                renderItem={renderInvoiceItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View className="flex items-center justify-center py-8">
              <Text className="text-muted text-center">لا توجد فواتير مطابقة</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
