import { invoiceService } from '../src/services/invoice.service';
import fs from 'fs';

const dummyOrder = {
  orderNumber: 'TTS260713-000001',
  createdAt: new Date(),
  paymentStatus: 'PAID',
  subtotal: 7000,
  discount: 0,
  shipping: 0,
  tax: 0,
  grandTotal: 7000,
  shippingAddress: {
    fullName: 'Jane Doe',
    line1: '123, Craft Lane',
    line2: 'Artisan Square',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    phone: '9876543210'
  },
  billingAddress: {
    fullName: 'Jane Doe',
    line1: '123, Craft Lane',
    line2: 'Artisan Square',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    phone: '9876543210'
  },
  items: [
    {
      productName: 'Meadow Floral Hoop Kit',
      variantName: 'Natural Bamboo',
      quantity: 2,
      unitPrice: 3500,
      lineTotal: 7000
    }
  ]
};

async function main() {
  try {
    const pdfBytes = await invoiceService.generateInvoicePdf(dummyOrder);
    fs.writeFileSync('test_invoice.pdf', pdfBytes);
    console.log('PDF generated successfully!');
  } catch (err) {
    console.error('PDF generation failed:', err);
  }
}

main();
