/**
 * خدمة حساب الفاتورة والتفقيط بالعربية
 */

import { InvoiceItem, InvoiceCalculation } from './types';

/**
 * حساب إجمالي الخصم لصنف واحد
 */
function calculateItemDiscount(item: InvoiceItem): number {
  const itemTotal = item.price * item.quantity;
  if (item.discountType === 'percentage') {
    return (itemTotal * item.discountValue) / 100;
  } else {
    return item.discountValue;
  }
}

/**
 * حساب الفاتورة الكاملة
 */
export function calculateInvoice(items: InvoiceItem[]): InvoiceCalculation {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => sum + calculateItemDiscount(item), 0);
  const total = subtotal - totalDiscount;

  return {
    subtotal,
    totalDiscount,
    total,
    totalInWords: numberToArabicWords(Math.round(total)),
  };
}

/**
 * تحويل الأرقام إلى كلمات بالعربية (التفقيط)
 */
export function numberToArabicWords(num: number): string {
  const ones = [
    '',
    'واحد',
    'اثنان',
    'ثلاثة',
    'أربعة',
    'خمسة',
    'ستة',
    'سبعة',
    'ثمانية',
    'تسعة',
  ];

  const teens = [
    'عشرة',
    'احدى عشر',
    'اثنا عشر',
    'ثلاثة عشر',
    'أربعة عشر',
    'خمسة عشر',
    'ستة عشر',
    'سبعة عشر',
    'ثمانية عشر',
    'تسعة عشر',
  ];

  const tens = [
    '',
    '',
    'عشرون',
    'ثلاثون',
    'أربعون',
    'خمسون',
    'ستون',
    'سبعون',
    'ثمانون',
    'تسعون',
  ];

  const scales = [
    { value: 1000000000, name: 'مليار' },
    { value: 1000000, name: 'مليون' },
    { value: 1000, name: 'ألف' },
    { value: 100, name: 'مائة' },
  ];

  if (num === 0) return 'صفر';

  let result = '';

  for (const scale of scales) {
    const count = Math.floor(num / scale.value);
    if (count > 0) {
      if (count === 1 && scale.value === 100) {
        result += 'مائة ';
      } else if (count === 1 && scale.value === 1000) {
        result += 'ألف ';
      } else if (count === 2 && scale.value === 1000) {
        result += 'ألفان ';
      } else if (count >= 3 && count <= 9 && scale.value === 1000) {
        result += convertHundreds(count) + ' آلاف ';
      } else if (count >= 10 && scale.value === 1000) {
        result += convertHundreds(count) + ' ألف ';
      } else {
        result += convertHundreds(count) + ' ' + scale.name + ' ';
      }
      num %= scale.value;
    }
  }

  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    if (hundreds === 1) {
      result += 'مائة ';
    } else {
      result += ones[hundreds] + ' مائة ';
    }
    num %= 100;
  }

  if (num >= 20) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (one === 0) {
      result += tens[ten];
    } else {
      result += ones[one] + ' و' + tens[ten];
    }
  } else if (num >= 10) {
    result += teens[num - 10];
  } else if (num > 0) {
    result += ones[num];
  }

  return result.trim();
}

/**
 * دالة مساعدة لتحويل الأرقام من 1 إلى 999
 */
function convertHundreds(num: number): string {
  const ones = [
    '',
    'واحد',
    'اثنان',
    'ثلاثة',
    'أربعة',
    'خمسة',
    'ستة',
    'سبعة',
    'ثمانية',
    'تسعة',
  ];

  const teens = [
    'عشرة',
    'احدى عشر',
    'اثنا عشر',
    'ثلاثة عشر',
    'أربعة عشر',
    'خمسة عشر',
    'ستة عشر',
    'سبعة عشر',
    'ثمانية عشر',
    'تسعة عشر',
  ];

  const tens = [
    '',
    '',
    'عشرون',
    'ثلاثون',
    'أربعون',
    'خمسون',
    'ستون',
    'سبعون',
    'ثمانون',
    'تسعون',
  ];

  if (num === 0) return '';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];

  const ten = Math.floor(num / 10);
  const one = num % 10;

  if (one === 0) return tens[ten];
  return ones[one] + ' و' + tens[ten];
}

/**
 * تنسيق الرقم كعملة
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
}
