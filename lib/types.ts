/**
 * أنواع البيانات الأساسية للتطبيق
 */

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  logo?: string; // URI للشعار
}

export interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountType: 'percentage' | 'fixed'; // نسبة مئوية أو مبلغ ثابت
  discountValue: number;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Invoice {
  id: string;
  createdAt: string;
  customer: Customer;
  items: InvoiceItem[];
  companySettings: CompanySettings;
  templateId: 'template1' | 'template2' | 'template3';
  subtotal: number;
  totalDiscount: number;
  total: number;
}

export interface InvoiceCalculation {
  subtotal: number;
  totalDiscount: number;
  total: number;
  totalInWords: string; // التفقيط بالعربية
}
