/**
 * خدمة التخزين المحلي باستخدام AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompanySettings, Invoice } from './types';

const COMPANY_SETTINGS_KEY = 'invoice_pro_company_settings';
const INVOICES_KEY = 'invoice_pro_invoices';

/**
 * حفظ إعدادات الشركة
 */
export async function saveCompanySettings(settings: CompanySettings): Promise<void> {
  try {
    await AsyncStorage.setItem(COMPANY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving company settings:', error);
    throw error;
  }
}

/**
 * استرجاع إعدادات الشركة
 */
export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const data = await AsyncStorage.getItem(COMPANY_SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving company settings:', error);
    return null;
  }
}

/**
 * حفظ فاتورة
 */
export async function saveInvoice(invoice: Invoice): Promise<void> {
  try {
    const invoices = await getAllInvoices();
    invoices.push(invoice);
    await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}

/**
 * استرجاع جميع الفواتير
 */
export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const data = await AsyncStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return [];
  }
}

/**
 * استرجاع فاتورة محددة
 */
export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const invoices = await getAllInvoices();
    return invoices.find(inv => inv.id === id) || null;
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    return null;
  }
}

/**
 * حذف فاتورة
 */
export async function deleteInvoice(id: string): Promise<void> {
  try {
    const invoices = await getAllInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

/**
 * مسح جميع البيانات (للاختبار فقط)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([COMPANY_SETTINGS_KEY, INVOICES_KEY]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
