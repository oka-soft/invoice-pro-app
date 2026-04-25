/**
 * خدمة توليد قوالب PDF الثلاثة للفواتير
 */

import { Invoice } from './types';
import { numberToArabicWords } from './invoice-calculator';
import { formatCurrency } from './invoice-calculator';

export type TemplateType = 'classic' | 'professional' | 'modern';

/**
 * القالب الأول: البسيط والكلاسيكي
 */
export function generateClassicTemplate(invoice: Invoice): string {
  const arabicTotal = numberToArabicWords(Math.floor(invoice.total));

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: white; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .company-info { font-size: 12px; color: #666; }
        .invoice-title { font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 14px; font-weight: bold; background: #f5f5f5; padding: 8px 12px; margin-bottom: 12px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .info-label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f5f5f5; padding: 10px; text-align: right; font-weight: bold; font-size: 13px; border-bottom: 1px solid #ddd; }
        td { padding: 10px; text-align: right; font-size: 12px; border-bottom: 1px solid #eee; }
        .totals { width: 100%; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; }
        .total-row.final { border-top: 2px solid #000; border-bottom: 2px solid #000; font-weight: bold; font-size: 16px; padding: 15px 0; }
        .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }
        .arabic-text { font-size: 12px; color: #666; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">${invoice.companySettings.name}</div>
          <div class="company-info">
            ${invoice.companySettings.address ? `<div>${invoice.companySettings.address}</div>` : ''}
            ${invoice.companySettings.phone ? `<div>الهاتف: ${invoice.companySettings.phone}</div>` : ''}
          </div>
        </div>

        <div class="invoice-title">فاتورة</div>

        <div class="section">
          <div class="section-title">بيانات الفاتورة</div>
          <div class="info-row">
            <span class="info-label">رقم الفاتورة:</span>
            <span>${invoice.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">التاريخ:</span>
            <span>${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">بيانات العميل</div>
          <div class="info-row">
            <span class="info-label">الاسم:</span>
            <span>${invoice.customer.name || '-'}</span>
          </div>
          ${invoice.customer.phone ? `
          <div class="info-row">
            <span class="info-label">الهاتف:</span>
            <span>${invoice.customer.phone}</span>
          </div>
          ` : ''}
          ${invoice.customer.email ? `
          <div class="info-row">
            <span class="info-label">البريد الإلكتروني:</span>
            <span>${invoice.customer.email}</span>
          </div>
          ` : ''}
          ${invoice.customer.address ? `
          <div class="info-row">
            <span class="info-label">العنوان:</span>
            <span>${invoice.customer.address}</span>
          </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>الإجمالي</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الصنف</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => {
              const discountAmount = item.discountType === 'percentage' ? (item.price * item.discountValue / 100) : item.discountValue;
              const itemTotal = item.quantity * (item.price - discountAmount);
              return `
              <tr>
                <td>${formatCurrency(itemTotal)}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${item.name}</td>
              </tr>
            `;
            }).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>المجموع الفرعي:</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          ${invoice.totalDiscount > 0 ? `
          <div class="total-row">
            <span>الخصم:</span>
            <span>-${formatCurrency(invoice.totalDiscount)}</span>
          </div>
          ` : ''}
          <div class="total-row final">
            <span>الإجمالي النهائي:</span>
            <span>${formatCurrency(invoice.total)}</span>
          </div>
        </div>

        <div class="arabic-text">
          <strong>المبلغ بالكلمات:</strong> ${arabicTotal}
        </div>

        <div class="footer">
          <p>شكراً لتعاملك معنا</p>
          <p>تم إنشاء هذه الفاتورة بواسطة Invoice Pro</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * القالب الثاني: الاحترافي مع الألوان
 */
export function generateProfessionalTemplate(invoice: Invoice): string {
  const arabicTotal = numberToArabicWords(Math.floor(invoice.total));

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; color: #333; }
        .container { max-width: 850px; margin: 0 auto; padding: 30px; }
        .header { background: linear-gradient(135deg, #0a7ea4 0%, #0d5a7a 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .company-name { font-size: 26px; font-weight: bold; }
        .invoice-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 4px; font-size: 12px; }
        .company-info { font-size: 13px; opacity: 0.9; }
        .header-divider { height: 2px; background: rgba(255,255,255,0.3); margin: 15px 0; }
        .invoice-title { font-size: 22px; font-weight: bold; margin-bottom: 5px; }
        .invoice-id { font-size: 13px; opacity: 0.9; }
        
        .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-box { background: #f8f9fa; padding: 15px; border-radius: 6px; border-right: 3px solid #0a7ea4; }
        .info-box-title { font-size: 12px; font-weight: bold; color: #0a7ea4; margin-bottom: 10px; text-transform: uppercase; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
        .info-label { font-weight: 600; color: #666; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #0a7ea4; color: white; padding: 12px; text-align: right; font-weight: 600; font-size: 13px; }
        td { padding: 12px; text-align: right; font-size: 13px; border-bottom: 1px solid #eee; }
        tr:hover { background: #f8f9fa; }
        
        .totals-section { background: #f8f9fa; padding: 20px; border-radius: 6px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
        .total-row.final { border-top: 2px solid #0a7ea4; border-bottom: 2px solid #0a7ea4; padding: 12px 0; margin: 10px 0; font-weight: bold; font-size: 16px; color: #0a7ea4; }
        
        .arabic-text { background: #e8f4f8; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 13px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-top">
            <div>
              <div class="invoice-title">فاتورة</div>
              <div class="invoice-id">رقم: ${invoice.id}</div>
            </div>
            <div class="invoice-badge">تاريخ: ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</div>
          </div>
          <div class="header-divider"></div>
          <div class="company-name">${invoice.companySettings.name}</div>
          <div class="company-info">
            ${invoice.companySettings.address ? `<div>${invoice.companySettings.address}</div>` : ''}
            ${invoice.companySettings.phone ? `<div>الهاتف: ${invoice.companySettings.phone}</div>` : ''}
          </div>
        </div>

        <div class="content">
          <div class="info-box">
            <div class="info-box-title">بيانات العميل</div>
            <div class="info-row">
              <span class="info-label">الاسم:</span>
              <span>${invoice.customer.name || '-'}</span>
            </div>
            ${invoice.customer.phone ? `
            <div class="info-row">
              <span class="info-label">الهاتف:</span>
              <span>${invoice.customer.phone}</span>
            </div>
            ` : ''}
            ${invoice.customer.email ? `
            <div class="info-row">
              <span class="info-label">البريد:</span>
              <span>${invoice.customer.email}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="info-box">
            <div class="info-box-title">ملخص الفاتورة</div>
            <div class="info-row">
              <span class="info-label">المجموع الفرعي:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            ${invoice.totalDiscount > 0 ? `
            <div class="info-row">
              <span class="info-label">الخصم:</span>
              <span style="color: #e74c3c;">-${formatCurrency(invoice.totalDiscount)}</span>
            </div>
            ` : ''}
            <div class="info-row" style="font-weight: bold; color: #0a7ea4; font-size: 14px;">
              <span>الإجمالي:</span>
              <span>${formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>الإجمالي</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الصنف</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => {
              const discountAmount = item.discountType === 'percentage' ? (item.price * item.discountValue / 100) : item.discountValue;
              const itemTotal = item.quantity * (item.price - discountAmount);
              return `
              <tr>
                <td>${formatCurrency(itemTotal)}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${item.name}</td>
              </tr>
            `;
            }).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>المجموع الفرعي:</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          ${invoice.totalDiscount > 0 ? `
          <div class="total-row">
            <span>الخصم:</span>
            <span>-${formatCurrency(invoice.totalDiscount)}</span>
          </div>
          ` : ''}
          <div class="total-row final">
            <span>الإجمالي النهائي:</span>
            <span>${formatCurrency(invoice.total)}</span>
          </div>
        </div>

        <div class="arabic-text">
          <strong>المبلغ بالكلمات:</strong><br>${arabicTotal}
        </div>

        <div class="footer">
          <p>شكراً لتعاملك معنا</p>
          <p>تم إنشاء هذه الفاتورة بواسطة Invoice Pro App</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * القالب الثالث: الحديث والعصري
 */
export function generateModernTemplate(invoice: Invoice): string {
  const arabicTotal = numberToArabicWords(Math.floor(invoice.total));

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; color: #2c3e50; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .page { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        .header-content { position: relative; z-index: 1; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .company-section h1 { font-size: 28px; margin-bottom: 8px; }
        .company-section p { font-size: 13px; opacity: 0.9; }
        .invoice-meta { text-align: right; }
        .invoice-number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
        .invoice-date { font-size: 12px; opacity: 0.9; }
        
        .main-content { padding: 40px; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-section h3 { font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 700; margin-bottom: 15px; letter-spacing: 0.5px; }
        .info-section p { font-size: 13px; margin-bottom: 8px; line-height: 1.6; }
        .info-section strong { color: #2c3e50; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8f9fa; padding: 14px; text-align: right; font-weight: 600; font-size: 12px; color: #667eea; text-transform: uppercase; border-bottom: 2px solid #e0e6ed; }
        td { padding: 14px; text-align: right; font-size: 13px; border-bottom: 1px solid #e0e6ed; }
        tr:hover { background: #f8f9fa; }
        
        .summary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .summary-row.total { border-top: 2px solid rgba(255,255,255,0.3); padding-top: 12px; margin-top: 12px; font-size: 18px; font-weight: bold; }
        
        .notes { background: #f8f9fa; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin-bottom: 30px; }
        .notes strong { color: #667eea; display: block; margin-bottom: 8px; }
        .notes p { font-size: 13px; line-height: 1.6; }
        
        .footer { background: #f8f9fa; padding: 20px 40px; text-align: center; font-size: 12px; color: #7f8c8d; border-top: 1px solid #e0e6ed; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="page">
          <div class="header">
            <div class="header-content">
              <div class="header-top">
                <div class="company-section">
                  <h1>${invoice.companySettings.name}</h1>
                  ${invoice.companySettings.address ? `<p>${invoice.companySettings.address}</p>` : ''}
                  ${invoice.companySettings.phone ? `<p>الهاتف: ${invoice.companySettings.phone}</p>` : ''}
                </div>
                <div class="invoice-meta">
                  <div class="invoice-number">${invoice.id}</div>
                  <div class="invoice-date">${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="main-content">
            <div class="info-grid">
              <div class="info-section">
                <h3>بيانات العميل</h3>
                <p><strong>الاسم:</strong> ${invoice.customer.name || '-'}</p>
                ${invoice.customer.phone ? `<p><strong>الهاتف:</strong> ${invoice.customer.phone}</p>` : ''}
                ${invoice.customer.email ? `<p><strong>البريد:</strong> ${invoice.customer.email}</p>` : ''}
                ${invoice.customer.address ? `<p><strong>العنوان:</strong> ${invoice.customer.address}</p>` : ''}
              </div>
              
              <div class="info-section">
                <h3>تفاصيل الفاتورة</h3>
                <p><strong>رقم الفاتورة:</strong> ${invoice.id}</p>
                <p><strong>التاريخ:</strong> ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
                <p><strong>عدد الأصناف:</strong> ${invoice.items.length}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>الإجمالي</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>الصنف</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => {
                  const discountAmount = item.discountType === 'percentage' ? (item.price * item.discountValue / 100) : item.discountValue;
                  const itemTotal = item.quantity * (item.price - discountAmount);
                  return `
                  <tr>
                    <td>${formatCurrency(itemTotal)}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${item.name}</td>
                  </tr>
                `;
                }).join('')}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span>المجموع الفرعي:</span>
                <span>${formatCurrency(invoice.subtotal)}</span>
              </div>
              ${invoice.totalDiscount > 0 ? `
              <div class="summary-row">
                <span>الخصم:</span>
                <span>-${formatCurrency(invoice.totalDiscount)}</span>
              </div>
              ` : ''}
              <div class="summary-row total">
                <span>الإجمالي النهائي:</span>
                <span>${formatCurrency(invoice.total)}</span>
              </div>
            </div>

            <div class="notes">
              <strong>المبلغ بالكلمات:</strong>
              <p>${arabicTotal}</p>
            </div>
          </div>

          <div class="footer">
            <p>شكراً لتعاملك معنا | تم إنشاء هذه الفاتورة بواسطة Invoice Pro App</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * دالة عامة لتوليد HTML بناءً على نوع القالب
 */
export function generateInvoiceHTML(invoice: Invoice, templateType: TemplateType = 'classic'): string {
  switch (templateType) {
    case 'professional':
      return generateProfessionalTemplate(invoice);
    case 'modern':
      return generateModernTemplate(invoice);
    case 'classic':
    default:
      return generateClassicTemplate(invoice);
  }
}
