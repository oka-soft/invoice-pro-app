/**
 * خدمة الطباعة المباشرة للفواتير
 */

import * as Print from 'expo-print';
import { Invoice } from './types';
import { generateInvoiceHTML, TemplateType } from './pdf-templates';

/**
 * طباعة الفاتورة مباشرة
 */
export async function printInvoice(invoice: Invoice, templateType: TemplateType = 'classic'): Promise<void> {
  try {
    const html = generateInvoiceHTML(invoice, templateType);
    
    await Print.printAsync({
      html,
      printerUrl: undefined, // استخدام الطابعة الافتراضية
    });
  } catch (error) {
    console.error('Error printing invoice:', error);
    throw new Error('فشل في طباعة الفاتورة');
  }
}

/**
 * الحصول على قائمة الطابعات المتاحة
 */
export async function getAvailablePrinters(): Promise<any[]> {
  try {
    const printers = await (Print as any).getAvailablePrintersAsync();
    return printers;
  } catch (error) {
    console.error('Error getting printers:', error);
    return [];
  }
}

/**
 * طباعة الفاتورة على طابعة محددة
 */
export async function printInvoiceToSpecificPrinter(
  invoice: Invoice,
  printerUrl: string,
  templateType: TemplateType = 'classic'
): Promise<void> {
  try {
    const html = generateInvoiceHTML(invoice, templateType);
    
    await Print.printAsync({
      html,
      printerUrl,
    });
  } catch (error) {
    console.error('Error printing to specific printer:', error);
    throw new Error('فشل في الطباعة على الطابعة المحددة');
  }
}

/**
 * معاينة الفاتورة قبل الطباعة
 */
export async function previewInvoice(invoice: Invoice, templateType: TemplateType = 'classic'): Promise<void> {
  try {
    const html = generateInvoiceHTML(invoice, templateType);
    
    await Print.printAsync({
      html,
      printerUrl: undefined,
    });
  } catch (error) {
    console.error('Error previewing invoice:', error);
    throw new Error('فشل في معاينة الفاتورة');
  }
}
