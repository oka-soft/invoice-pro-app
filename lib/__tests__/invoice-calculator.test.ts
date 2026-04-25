import { describe, it, expect } from 'vitest';
import { calculateInvoice, numberToArabicWords, formatCurrency } from '../invoice-calculator';
import { InvoiceItem } from '../types';

describe('Invoice Calculator', () => {
  describe('calculateInvoice', () => {
    it('should calculate invoice with no discount', () => {
      const items: InvoiceItem[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
          discountType: 'percentage',
          discountValue: 0,
        },
      ];

      const result = calculateInvoice(items);
      expect(result.subtotal).toBe(200);
      expect(result.totalDiscount).toBe(0);
      expect(result.total).toBe(200);
    });

    it('should calculate invoice with percentage discount', () => {
      const items: InvoiceItem[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
          discountType: 'percentage',
          discountValue: 10,
        },
      ];

      const result = calculateInvoice(items);
      expect(result.subtotal).toBe(200);
      expect(result.totalDiscount).toBe(20);
      expect(result.total).toBe(180);
    });

    it('should calculate invoice with fixed discount', () => {
      const items: InvoiceItem[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
          discountType: 'fixed',
          discountValue: 30,
        },
      ];

      const result = calculateInvoice(items);
      expect(result.subtotal).toBe(200);
      expect(result.totalDiscount).toBe(30);
      expect(result.total).toBe(170);
    });

    it('should calculate invoice with multiple items', () => {
      const items: InvoiceItem[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
          discountType: 'percentage',
          discountValue: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 50,
          quantity: 1,
          discountType: 'fixed',
          discountValue: 5,
        },
      ];

      const result = calculateInvoice(items);
      expect(result.subtotal).toBe(250);
      expect(result.totalDiscount).toBe(25);
      expect(result.total).toBe(225);
    });
  });

  describe('numberToArabicWords', () => {
    it('should convert zero to Arabic', () => {
      expect(numberToArabicWords(0)).toBe('صفر');
    });

    it('should convert single digits to Arabic', () => {
      expect(numberToArabicWords(1)).toBe('واحد');
      expect(numberToArabicWords(5)).toBe('خمسة');
      expect(numberToArabicWords(9)).toBe('تسعة');
    });

    it('should convert tens to Arabic', () => {
      expect(numberToArabicWords(10)).toBe('عشرة');
      expect(numberToArabicWords(20)).toBe('عشرون');
      expect(numberToArabicWords(50)).toBe('خمسون');
    });

    it('should convert hundreds to Arabic', () => {
      expect(numberToArabicWords(100)).toBe('مائة');
    });

    it('should convert thousands to Arabic', () => {
      expect(numberToArabicWords(1000)).toBe('ألف');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with Saudi Riyal', () => {
      const formatted = formatCurrency(100);
      expect(formatted).toContain('ر.س');
    });

    it('should handle decimal values', () => {
      const formatted = formatCurrency(100.5);
      expect(formatted).toContain('ر.س');
    });

    it('should handle zero', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('ر.س');
    });
  });
});
