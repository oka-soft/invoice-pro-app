/**
 * خدمة البحث والتصفية والفرز للفواتير
 */

import { Invoice } from './types';

export interface SearchFilters {
  searchQuery?: string; // البحث عن اسم العميل أو رقم الفاتورة
  startDate?: Date; // تاريخ البداية
  endDate?: Date; // تاريخ النهاية
  sortBy?: 'date' | 'total' | 'customer'; // طريقة الفرز
  sortOrder?: 'asc' | 'desc'; // ترتيب الفرز
}

/**
 * البحث والتصفية في قائمة الفواتير
 */
export function searchAndFilterInvoices(
  invoices: Invoice[],
  filters: SearchFilters
): Invoice[] {
  let filtered = [...invoices];

  // البحث عن اسم العميل أو رقم الفاتورة
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (invoice) =>
        invoice.customer.name?.toLowerCase().includes(query) ||
        invoice.id.toLowerCase().includes(query) ||
        invoice.customer.phone?.toLowerCase().includes(query) ||
        invoice.customer.email?.toLowerCase().includes(query)
    );
  }

  // التصفية حسب التاريخ
  if (filters.startDate) {
    const startTime = new Date(filters.startDate).setHours(0, 0, 0, 0);
    filtered = filtered.filter((invoice) => new Date(invoice.createdAt).getTime() >= startTime);
  }

  if (filters.endDate) {
    const endTime = new Date(filters.endDate).setHours(23, 59, 59, 999);
    filtered = filtered.filter((invoice) => new Date(invoice.createdAt).getTime() <= endTime);
  }

  // الفرز
  const sortBy = filters.sortBy || 'date';
  const sortOrder = filters.sortOrder || 'desc';

  filtered.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'date':
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'total':
        compareValue = a.total - b.total;
        break;
      case 'customer':
        compareValue = (a.customer.name || '').localeCompare(b.customer.name || '', 'ar');
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return filtered;
}

/**
 * الحصول على إحصائيات الفواتير
 */
export function getInvoiceStatistics(invoices: Invoice[]) {
  const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const count = invoices.length;
  const averageInvoice = count > 0 ? total / count : 0;

  return {
    totalCount: count,
    totalAmount: total,
    averageInvoice,
  };
}

/**
 * تجميع الفواتير حسب التاريخ
 */
export function groupInvoicesByDate(invoices: Invoice[]): Record<string, Invoice[]> {
  const grouped: Record<string, Invoice[]> = {};

  invoices.forEach((invoice) => {
    const date = new Date(invoice.createdAt).toLocaleDateString('ar-SA');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(invoice);
  });

  return grouped;
}

/**
 * تجميع الفواتير حسب العميل
 */
export function groupInvoicesByCustomer(invoices: Invoice[]): Record<string, Invoice[]> {
  const grouped: Record<string, Invoice[]> = {};

  invoices.forEach((invoice) => {
    const customerName = invoice.customer.name || 'بدون اسم';
    if (!grouped[customerName]) {
      grouped[customerName] = [];
    }
    grouped[customerName].push(invoice);
  });

  return grouped;
}

/**
 * الحصول على الفواتير الحديثة
 */
export function getRecentInvoices(invoices: Invoice[], limit: number = 10): Invoice[] {
  return invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

/**
 * البحث عن فاتورة محددة
 */
export function findInvoiceById(invoices: Invoice[], id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id);
}

/**
 * الحصول على الفواتير ذات الإجمالي الأعلى
 */
export function getTopInvoices(invoices: Invoice[], limit: number = 5): Invoice[] {
  return invoices.sort((a, b) => b.total - a.total).slice(0, limit);
}

/**
 * الحصول على الفواتير ذات الإجمالي الأقل
 */
export function getLowestInvoices(invoices: Invoice[], limit: number = 5): Invoice[] {
  return invoices.sort((a, b) => a.total - b.total).slice(0, limit);
}
