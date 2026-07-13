import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { Order } from '@prisma/client';

export const invoiceService = {
  /**
   * Generates a beautifully formatted PDF invoice using pdf-lib.
   */
  generateInvoicePdf: async (order: any): Promise<Uint8Array> => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.27, 841.89]); // A4 Size
      const { width, height } = page.getSize();

      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

      // Colors
      const primaryColor = rgb(0.12, 0.12, 0.12); // Dark charcoal
      const greyColor = rgb(0.4, 0.4, 0.4);
      const lightGreyColor = rgb(0.95, 0.95, 0.95);
      const borderGreyColor = rgb(0.85, 0.85, 0.85);

      // --- Header Branding ---
      page.drawText('TWO THREADS STUDIO', {
        x: 40,
        y: height - 60,
        size: 20,
        font: fontBold,
        color: primaryColor,
      });

      page.drawText('Premium Artisanal Craft & Kits', {
        x: 40,
        y: height - 75,
        size: 9,
        font: fontRegular,
        color: greyColor,
      });

      // --- Invoice Details (Top Right) ---
      page.drawText('INVOICE', {
        x: width - 180,
        y: height - 60,
        size: 22,
        font: fontBold,
        color: primaryColor,
      });

      page.drawText(`Invoice No: ${order.orderNumber}`, {
        x: width - 180,
        y: height - 80,
        size: 10,
        font: fontBold,
        color: primaryColor,
      });

      const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      page.drawText(`Date: ${dateStr}`, {
        x: width - 180,
        y: height - 95,
        size: 10,
        font: fontRegular,
        color: greyColor,
      });

      page.drawText(`Payment: ${order.paymentStatus}`, {
        x: width - 180,
        y: height - 110,
        size: 10,
        font: fontBold,
        color: order.paymentStatus === 'PAID' ? rgb(0.1, 0.6, 0.1) : rgb(0.7, 0.5, 0.0),
      });

      // Divider Line
      page.drawLine({
        start: { x: 40, y: height - 130 },
        end: { x: width - 40, y: height - 130 },
        thickness: 1,
        color: borderGreyColor,
      });

      // --- Addresses ---
      // Shipping Address (Left)
      page.drawText('SHIPPING TO:', {
        x: 40,
        y: height - 160,
        size: 9,
        font: fontBold,
        color: greyColor,
      });

      const sa = order.shippingAddress;
      let saY = height - 175;
      page.drawText(sa.fullName, { x: 40, y: saY, size: 10, font: fontBold, color: primaryColor });
      saY -= 15;
      page.drawText(sa.line1, { x: 40, y: saY, size: 9, font: fontRegular, color: primaryColor });
      if (sa.line2) {
        saY -= 15;
        page.drawText(sa.line2, { x: 40, y: saY, size: 9, font: fontRegular, color: primaryColor });
      }
      saY -= 15;
      page.drawText(`${sa.city}, ${sa.state} - ${sa.postalCode}`, { x: 40, y: saY, size: 9, font: fontRegular, color: primaryColor });
      saY -= 15;
      page.drawText(`Phone: ${sa.phone}`, { x: 40, y: saY, size: 9, font: fontRegular, color: primaryColor });

      // Billing Address (Right)
      page.drawText('BILLING TO:', {
        x: width / 2 + 20,
        y: height - 160,
        size: 9,
        font: fontBold,
        color: greyColor,
      });

      const ba = order.billingAddress;
      let baY = height - 175;
      page.drawText(ba.fullName, { x: width / 2 + 20, y: baY, size: 10, font: fontBold, color: primaryColor });
      baY -= 15;
      page.drawText(ba.line1, { x: width / 2 + 20, y: baY, size: 9, font: fontRegular, color: primaryColor });
      if (ba.line2) {
        baY -= 15;
        page.drawText(ba.line2, { x: width / 2 + 20, y: baY, size: 9, font: fontRegular, color: primaryColor });
      }
      baY -= 15;
      page.drawText(`${ba.city}, ${ba.state} - ${ba.postalCode}`, { x: width / 2 + 20, y: baY, size: 9, font: fontRegular, color: primaryColor });
      baY -= 15;
      page.drawText(`Phone: ${ba.phone}`, { x: width / 2 + 20, y: baY, size: 9, font: fontRegular, color: primaryColor });

      // Divider Line
      page.drawLine({
        start: { x: 40, y: height - 265 },
        end: { x: width - 40, y: height - 265 },
        thickness: 1,
        color: borderGreyColor,
      });

      // --- Items Table Headers ---
      const tableTopY = height - 290;
      page.drawRectangle({
        x: 40,
        y: tableTopY - 10,
        width: width - 80,
        height: 20,
        color: lightGreyColor,
      });

      page.drawText('PRODUCT DETAIL', { x: 50, y: tableTopY - 4, size: 9, font: fontBold, color: primaryColor });
      page.drawText('QTY', { x: width - 210, y: tableTopY - 4, size: 9, font: fontBold, color: primaryColor });
      page.drawText('PRICE', { x: width - 150, y: tableTopY - 4, size: 9, font: fontBold, color: primaryColor });
      page.drawText('TOTAL', { x: width - 90, y: tableTopY - 4, size: 9, font: fontBold, color: primaryColor });

      // --- Items Table Rows ---
      let currentY = tableTopY - 30;
      for (const item of order.items) {
        page.drawText(item.productName, {
          x: 50,
          y: currentY,
          size: 9,
          font: fontBold,
          color: primaryColor,
        });

        // If variant name exists, draw it underneath
        if (item.variantName) {
          page.drawText(item.variantName, {
            x: 50,
            y: currentY - 12,
            size: 8,
            font: fontRegular,
            color: greyColor,
          });
        }

        page.drawText(String(item.quantity), {
          x: width - 210,
          y: currentY,
          size: 9,
          font: fontRegular,
          color: primaryColor,
        });

        page.drawText(`Rs. ${Number(item.unitPrice).toFixed(2)}`, {
          x: width - 150,
          y: currentY,
          size: 9,
          font: fontRegular,
          color: primaryColor,
        });

        page.drawText(`Rs. ${Number(item.lineTotal).toFixed(2)}`, {
          x: width - 90,
          y: currentY,
          size: 9,
          font: fontBold,
          color: primaryColor,
        });

        // Row Divider
        page.drawLine({
          start: { x: 40, y: currentY - (item.variantName ? 22 : 12) },
          end: { x: width - 40, y: currentY - (item.variantName ? 22 : 12) },
          thickness: 0.5,
          color: borderGreyColor,
        });

        currentY -= item.variantName ? 35 : 25;
      }

      // --- Totals Box ---
      let totalsY = currentY - 10;
      page.drawText('Subtotal:', { x: width - 200, y: totalsY, size: 9, font: fontRegular, color: greyColor });
      page.drawText(`Rs. ${Number(order.subtotal).toFixed(2)}`, { x: width - 90, y: totalsY, size: 9, font: fontRegular, color: primaryColor });

      totalsY -= 15;
      page.drawText('Discount:', { x: width - 200, y: totalsY, size: 9, font: fontRegular, color: greyColor });
      page.drawText(`Rs. ${Number(order.discount).toFixed(2)}`, { x: width - 90, y: totalsY, size: 9, font: fontRegular, color: primaryColor });

      totalsY -= 15;
      page.drawText('Shipping:', { x: width - 200, y: totalsY, size: 9, font: fontRegular, color: greyColor });
      page.drawText(`Rs. ${Number(order.shipping).toFixed(2)}`, { x: width - 90, y: totalsY, size: 9, font: fontRegular, color: primaryColor });

      totalsY -= 15;
      page.drawText('Tax (GST 0%):', { x: width - 200, y: totalsY, size: 9, font: fontRegular, color: greyColor });
      page.drawText(`Rs. ${Number(order.tax).toFixed(2)}`, { x: width - 90, y: totalsY, size: 9, font: fontRegular, color: primaryColor });

      // Total Divider
      totalsY -= 10;
      page.drawLine({
        start: { x: width - 210, y: totalsY },
        end: { x: width - 40, y: totalsY },
        thickness: 1,
        color: primaryColor,
      });

      totalsY -= 15;
      page.drawText('Grand Total:', { x: width - 200, y: totalsY, size: 10, font: fontBold, color: primaryColor });
      page.drawText(`Rs. ${Number(order.grandTotal).toFixed(2)}`, { x: width - 90, y: totalsY, size: 11, font: fontBold, color: primaryColor });

      // --- Footer ---
      page.drawLine({
        start: { x: 40, y: 70 },
        end: { x: width - 40, y: 70 },
        thickness: 1,
        color: borderGreyColor,
      });

      page.drawText('Thank you for supporting handcrafting and slow craft.', {
        x: width / 2,
        y: 50,
        size: 9,
        font: fontRegular,
        color: greyColor,
        // center align helper
      });

      const sysText = 'A Brand of SYS Pvt. Ltd.';
      const sysWidth = fontBold.widthOfTextAtSize(sysText, 10);
      page.drawText(sysText, {
        x: (width - sysWidth) / 2,
        y: 35,
        size: 10,
        font: fontBold,
        color: primaryColor,
      });

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (err: any) {
      throw new AppError(`Failed to generate invoice PDF: ${err.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },
};
