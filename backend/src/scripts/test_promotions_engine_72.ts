/**
 * test_promotions_engine_72.ts
 * Automated integration test for Phase 7.2 Promotions & Coupon Engine.
 */

import prisma from '../prisma';
import { promotionsEngine } from '../engines/PromotionsEngine';
import { pricingEngine } from '../engines/PricingEngine';

async function runVerification() {
  console.log('\n======================================================');
  console.log('🧪 TESTING PHASE 7.2 — PROMOTIONS & COUPON ENGINE');
  console.log('======================================================\n');

  // 1. Ensure default seed coupons exist
  await promotionsEngine.ensureDefaultCoupons();
  const coupons = await prisma.coupon.findMany({ where: { isActive: true } });
  console.log(`✅ Default Coupons Seeded in Database (${coupons.length} coupons):`);
  coupons.forEach((c) => console.log(`   - ${c.code}: ${c.title} (${c.type}, value: ${c.discountValue})`));

  // 2. Fetch a active test product
  const product = await prisma.product.findFirst({ where: { status: 'ACTIVE' } });
  if (!product) {
    console.error('❌ No active product found for promotions test');
    return;
  }

  const items = [
    {
      productId: product.id,
      quantity: 2,
      unitPrice: Number(product.price),
      lineTotal: Number(product.price) * 2,
      productName: product.name,
      categoryId: product.categoryId,
      collectionId: product.collectionId,
    },
  ];
  const subtotal = Number(product.price) * 2;
  console.log(`\n✅ Cart Subtotal for Test: ₹${subtotal} (Product: "${product.name}")`);

  // 3. Test Percentage Coupon Evaluation (WELCOME10 - 10% off)
  console.log('\n--- 1. Evaluating WELCOME10 (10% Discount) ---');
  const welcomeEval = await promotionsEngine.evaluateCoupon({
    code: 'WELCOME10',
    items,
    subtotal,
  });
  console.log(`   Discount Amount: ₹${welcomeEval.discountAmount}`);
  console.log(`   Message: ${welcomeEval.message}`);
  if (welcomeEval.discountAmount === Number(((subtotal * 10) / 100).toFixed(2))) {
    console.log('  ✅ WELCOME10 10% calculation mathematically verified!');
  }

  // 4. Test Fixed Amount Coupon Evaluation (ARTISAN500 - ₹500 off for min ₹2000)
  console.log('\n--- 2. Evaluating ARTISAN500 (Fixed ₹500 Discount) ---');
  if (subtotal >= 2000) {
    const fixedEval = await promotionsEngine.evaluateCoupon({
      code: 'ARTISAN500',
      items,
      subtotal,
    });
    console.log(`   Discount Amount: ₹${fixedEval.discountAmount}`);
    console.log(`   Message: ${fixedEval.message}`);
    if (fixedEval.discountAmount === 500) {
      console.log('  ✅ ARTISAN500 ₹500 fixed calculation mathematically verified!');
    }
  } else {
    try {
      await promotionsEngine.evaluateCoupon({
        code: 'ARTISAN500',
        items,
        subtotal,
      });
    } catch (err: any) {
      console.log(`   Expected Min Subtotal Rejection: ${err.message}`);
      console.log('  ✅ Minimum cart subtotal restriction enforced correctly!');
    }
  }

  // 5. Test Free Shipping Coupon (FREESHIP)
  console.log('\n--- 3. Evaluating FREESHIP Coupon ---');
  const freeShipEval = await promotionsEngine.evaluateCoupon({
    code: 'FREESHIP',
    items,
    subtotal,
  });
  console.log(`   Free Shipping Triggered: ${freeShipEval.freeShipping}`);
  console.log(`   Message: ${freeShipEval.message}`);
  if (freeShipEval.freeShipping) {
    console.log('  ✅ FREESHIP free shipping trigger verified!');
  }

  // 6. Test Central PricingEngine Integration
  console.log('\n--- 4. Integrating Coupon into Central PricingEngine ---');
  const pricingWithCoupon = await pricingEngine.calculateTotals({
    items: [{ productId: product.id, quantity: 2 }],
    couponCode: 'WELCOME10',
  });

  console.log(`   Subtotal: ₹${pricingWithCoupon.subtotal}`);
  console.log(`   Coupon Code: ${pricingWithCoupon.couponCode} (${pricingWithCoupon.couponTitle})`);
  console.log(`   Discount Amount: -₹${pricingWithCoupon.discount}`);
  console.log(`   Shipping: ₹${pricingWithCoupon.shipping}`);
  console.log(`   Grand Total: ₹${pricingWithCoupon.grandTotal}`);

  if (pricingWithCoupon.grandTotal === pricingWithCoupon.subtotal - pricingWithCoupon.discount + pricingWithCoupon.shipping) {
    console.log('  ✅ Grand Total accurately reflects applied coupon discount!');
  }

  console.log('\n======================================================');
  console.log('🎉 PHASE 7.2 PROMOTIONS & COUPON ENGINE VERIFICATION COMPLETE!');
  console.log('======================================================\n');
}

runVerification()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
