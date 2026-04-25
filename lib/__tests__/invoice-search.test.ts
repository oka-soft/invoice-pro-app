import { describe, it, expect } from 'vitest';
import {
  searchAndFilterInvoices,
  getInvoiceStatistics,
  groupInvoicesByDate,
  groupInvoicesByCustomer,
  getRecentInvoices,
  findInvoiceById,
  getTopInvoices,
  getLowestInvoices,
} from '../invoice-search';
import { Invoice } from '../types';

const mockInvoices: Invoice[] = [
  {
    id: '1',
    templateId: 'template1',
    customer: { name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@example.com', address: '' },
    items: [],
    companySettings: { name: 'شركة الفواتير', address: '', phone: '', logo: '' },
    subtotal: 1000,
    totalDiscount: 100,
    total: 900,
    createdAt: new Date('2026-04-20').toISOString(),
  },
  {
    id: '2',
    templateId: 'template1',
    customer: { name: 'فاطمة علي', phone: '0509876543', email: 'fatima@example.com', address: '' },
    items: [],
    companySettings: { name: 'شركة الفواتير', address: '', phone: '', logo: '' },
    subtotal: 2000,
    totalDiscount: 200,
    total: 1800,
    createdAt: new Date('2026-04-22').toISOString(),
  },
  {
    id: '3',
    templateId: 'template1',
    customer: { name: 'محمود سالم', phone: '0505555555', email: 'mahmoud@example.com', address: '' },
    items: [],
    companySettings: { name: 'شركة الفواتير', address: '', phone: '', logo: '' },
    subtotal: 500,
    totalDiscount: 50,
    total: 450,
    createdAt: new Date('2026-04-25').toISOString(),
  },
];

describe('Invoice Search and Filter', () => {
  describe('searchAndFilterInvoices', () => {
    it('should search by customer name', () => {
      const result = searchAndFilterInvoices(mockInvoices, { searchQuery: 'أحمد' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should search by invoice id', () => {
      const result = searchAndFilterInvoices(mockInvoices, { searchQuery: 'فاطمة' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should filter by date range', () => {
      const startDate = new Date('2026-04-21');
      const endDate = new Date('2026-04-24');
      const result = searchAndFilterInvoices(mockInvoices, { startDate, endDate });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should sort by total descending', () => {
      const result = searchAndFilterInvoices(mockInvoices, { sortBy: 'total', sortOrder: 'desc' });
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('3');
    });

    it('should sort by total ascending', () => {
      const result = searchAndFilterInvoices(mockInvoices, { sortBy: 'total', sortOrder: 'asc' });
      expect(result[0].id).toBe('3');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('2');
    });

    it('should sort by date descending', () => {
      const result = searchAndFilterInvoices(mockInvoices, { sortBy: 'date', sortOrder: 'desc' });
      expect(result[0].id).toBe('3');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('1');
    });
  });

  describe('getInvoiceStatistics', () => {
    it('should calculate correct statistics', () => {
      const stats = getInvoiceStatistics(mockInvoices);
      expect(stats.totalCount).toBe(3);
      expect(stats.totalAmount).toBe(3150);
      expect(stats.averageInvoice).toBe(1050);
    });

    it('should handle empty invoices', () => {
      const stats = getInvoiceStatistics([]);
      expect(stats.totalCount).toBe(0);
      expect(stats.totalAmount).toBe(0);
      expect(stats.averageInvoice).toBe(0);
    });
  });

  describe('groupInvoicesByDate', () => {
    it('should group invoices by date', () => {
      const grouped = groupInvoicesByDate(mockInvoices);
      expect(Object.keys(grouped).length).toBe(3);
    });
  });

  describe('groupInvoicesByCustomer', () => {
    it('should group invoices by customer', () => {
      const grouped = groupInvoicesByCustomer(mockInvoices);
      expect(Object.keys(grouped).length).toBe(3);
      expect(grouped['أحمد محمد']).toHaveLength(1);
    });
  });

  describe('getRecentInvoices', () => {
    it('should return recent invoices', () => {
      const recent = getRecentInvoices(mockInvoices, 2);
      expect(recent).toHaveLength(2);
      expect(recent[0].id).toBe('3');
    });
  });

  describe('findInvoiceById', () => {
    it('should find invoice by id', () => {
      const invoice = findInvoiceById(mockInvoices, '2');
      expect(invoice?.id).toBe('2');
    });

    it('should return undefined if not found', () => {
      const invoice = findInvoiceById(mockInvoices, 'nonexistent');
      expect(invoice).toBeUndefined();
    });
  });

  describe('getTopInvoices', () => {
    it('should return top invoices by total', () => {
      const top = getTopInvoices(mockInvoices, 2);
      expect(top).toHaveLength(2);
      expect(top[0].id).toBe('2');
      expect(top[1].id).toBe('1');
    });
  });

  describe('getLowestInvoices', () => {
    it('should return lowest invoices by total', () => {
      const lowest = getLowestInvoices(mockInvoices, 2);
      expect(lowest).toHaveLength(2);
      expect(lowest[0].id).toBe('3');
      expect(lowest[1].id).toBe('1');
    });
  });
});
