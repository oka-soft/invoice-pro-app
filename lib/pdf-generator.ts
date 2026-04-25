/**
 * خدمة توليد ملفات PDF للفواتير
 * استخدام html2pdf.js لتوليد PDF من HTML
 */

import { Invoice } from './types';
import { formatCurrency } from './invoice-calculator';

/**
 * توليد محتوى HTML للفاتورة
 */
export function generateInvoiceHTML(invoice: Invoice, templateId: string): string {
  const baseStyles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        direction: rtl;
        background: white;
        padding: 20px;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #0a7ea4;
        padding-bottom: 20px;
      }
      
      .header h1 {
        color: #0a7ea4;
        font-size: 28px;
        margin-bottom: 10px;
      }
      
      .company-info, .customer-info {
        margin-bottom: 20px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 5px;
      }
      
      .company-info h3, .customer-info h3 {
        color: #0a7ea4;
        margin-bottom: 10px;
        font-size: 14px;
      }
      
      .company-info p, .customer-info p {
        color: #333;
        font-size: 12px;
        line-height: 1.6;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      th {
        background: #0a7ea4;
        color: white;
        padding: 12px;
        text-align: right;
        font-size: 12px;
      }
      
      td {
        padding: 10px 12px;
        border-bottom: 1px solid #ddd;
        font-size: 12px;
      }
      
      tr:nth-child(even) {
        background: #f9f9f9;
      }
      
      .summary {
        margin-top: 20px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 5px;
      }
      
      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 12px;
      }
      
      .summary-row.total {
        border-top: 2px solid #0a7ea4;
        padding-top: 10px;
        font-weight: bold;
        font-size: 14px;
        color: #0a7ea4;
      }
      
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 11px;
        color: #666;
      }
    </style>
  `;

  const itemsHTML = invoice.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.discountType === 'percentage' ? item.discountValue + '%' : formatCurrency(item.discountValue)}</td>
      <td>${formatCurrency(
        item.price * item.quantity -
          (item.discountType === 'percentage'
            ? (item.price * item.quantity * item.discountValue) / 100
            : item.discountValue)
      )}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>فاتورة</h1>
          <p>رقم: ${invoice.id}</p>
          <p>التاريخ: ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
        </div>
        
        ${
          invoice.companySettings.name
            ? `
          <div class="company-info">
            <h3>بيانات الشركة</h3>
            <p><strong>${invoice.companySettings.name}</strong></p>
            ${invoice.companySettings.address ? `<p>${invoice.companySettings.address}</p>` : ''}
            ${invoice.companySettings.phone ? `<p>${invoice.companySettings.phone}</p>` : ''}
          </div>
        `
            : ''
        }
        
        ${
          invoice.customer.name
            ? `
          <div class="customer-info">
            <h3>بيانات العميل</h3>
            <p><strong>${invoice.customer.name}</strong></p>
            ${invoice.customer.phone ? `<p>الهاتف: ${invoice.customer.phone}</p>` : ''}
            ${invoice.customer.email ? `<p>البريد: ${invoice.customer.email}</p>` : ''}
            ${invoice.customer.address ? `<p>العنوان: ${invoice.customer.address}</p>` : ''}
          </div>
        `
            : ''
        }
        
        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الخصم</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>الإجمالي قبل الخصم:</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>إجمالي الخصم:</span>
            <span>-${formatCurrency(invoice.totalDiscount)}</span>
          </div>
          <div class="summary-row total">
            <span>الإجمالي النهائي:</span>
            <span>${formatCurrency(invoice.total)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>شكراً لك على تعاملك معنا</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * توليد ملف PDF من HTML (للويب فقط)
 */
export async function generatePDFFromHTML(html: string, fileName: string): Promise<Blob | null> {
  try {
    // هذه الدالة تعمل فقط على الويب
    // على الأجهزة الحقيقية، سنستخدم طريقة مختلفة
    if (typeof window === 'undefined') {
      console.warn('PDF generation is not available on native platforms');
      return null;
    }

    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.display = 'none';
    document.body.appendChild(element);

    // استخدام html2pdf إذا كان متاحاً
    if ((window as any).html2pdf) {
      const pdf = (window as any).html2pdf();
      pdf.set({
        margin: 10,
        filename: fileName,
        image: { type: 'PNG', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      });
      pdf.from(element).save();
    }

    document.body.removeChild(element);
    return null;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}
