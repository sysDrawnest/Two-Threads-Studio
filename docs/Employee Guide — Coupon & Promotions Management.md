# Employee Guide — Coupon & Promotions Management

## Two Threads Studio Admin Commerce Platform

### Phase 7.1 – Coupon & Promotions Engine

**Version:** 1.0.0

---

# Purpose

The Coupon & Promotions Engine allows administrators to create promotional campaigns that automatically apply discounts during checkout based on configurable business rules.

Coupons can target:

* Entire Store
* Specific Categories
* Specific Collections
* Individual Products
* Future customer tiers (VIP, First Order, Referral, etc.)

The engine performs **all validation on the server**, ensuring customers cannot manipulate prices or bypass restrictions.

---

# Access

Admin Dashboard

```
Admin Dashboard
    ↓
Marketing
    ↓
Coupons & Promotions
    ↓
Create Promotion Coupon
```

---

# Understanding Every Field

---

## Campaign Identity

### Coupon Code

Unique code entered by the customer during checkout.

Examples

```
WELCOME20

SUMMER25

FIRSTORDER

FESTIVAL2026

VIP50
```

Rules

* Must be unique
* No spaces
* Prefer uppercase
* Easy to remember

---

### Campaign Title

Internal display name for administrators.

Examples

```
Welcome Offer

Summer Sale

Artisan Festival

Christmas Campaign

VIP Exclusive
```

---

### Description / Terms & Conditions

Optional.

Displayed to customers explaining the promotion.

Example

```
Get 20% off on your first purchase.
Minimum order ₹1,500.
Maximum discount ₹500.
Valid until 31 December 2026.
```

---

# Discount Mechanics

---

## Promotion Type

Select the discount method.

Available Types

### Percentage

Customer receives a percentage discount.

Example

```
20%
```

---

### Fixed Amount

Customer receives a fixed amount.

Example

```
₹300 Off
```

---

### Free Shipping

Only shipping charges become free.

---

### Buy X Get Y

Example

```
Buy 2 Kits

↓

Get 1 Pattern Free
```

---

### Category Discount

Applies only to selected categories.

---

### Collection Discount

Applies only to selected collections.

---

### Product Discount

Only selected products receive the discount.

---

### First Order

Available only to customers placing their first order.

---

### Referral Coupon

Issued after successful referrals.

---

### Birthday Coupon

Automatically available during customer's birthday period.

---

# Discount Value

Enter the discount amount.

Example

```
20
```

means

```
20%
```

or

```
₹20
```

depending on Promotion Type.

---

# Maximum Discount Cap

Limits the maximum discount.

Example

```
Coupon

20%

Cart

₹8,000

Without cap

Discount

₹1,600

Maximum Cap

₹500

Customer receives

₹500 only.
```

---

# Minimum Cart Value

Customer must reach this subtotal before using the coupon.

Example

```
Minimum Cart

₹2,000
```

Customer with

```
₹1,850
```

cannot apply the coupon.

---

# Global Usage Limit

Maximum number of redemptions across the entire store.

Example

```
500
```

After

```
500 successful uses
```

Coupon automatically expires.

---

# Per User Limit

Maximum uses per customer.

Example

```
1
```

Customer can redeem only once.

---

# Eligible Target Criteria

These fields determine **where the coupon is valid**.

> **Note:** The admin interface now uses **dynamic search and multi-select components**. You no longer need to type database IDs manually.

---

## Eligible Categories

Search and select one or more product categories.

Example

Click the field and select:

```
✓ Embroidery Kits
✓ Home Decor
```

The system automatically stores the underlying category IDs.

Leave empty to apply to **all categories**.

---

## Eligible Collections

Select one or more collections.

Example

```
✓ Summer Collection

✓ Premium Collection
```

Leave empty for all collections.

---

## Eligible Products

Search products by name.

Example

```
✓ Floral Embroidery Kit

✓ Botanical Starter Kit

✓ Linen Cushion Cover
```

The coupon applies only to those products.

Leave empty for all products.

---

# Configurations

---

## Status Active

Enabled

```
✓ Active
```

Coupon can be used immediately.

Disabled

```
□ Inactive
```

Coupon exists but cannot be redeemed.

---

## Stackable

If enabled

Customer may combine with another coupon.

Example

```
WELCOME20

+

FREESHIP
```

If disabled

Only one coupon can be used.

---

## Exclusive Campaign

When enabled

This coupon overrides every other promotion.

Customer cannot combine it with any discount.

---

# Schedule Timeline

---

## Start Date

Date and time the coupon becomes active.

Example

```
01 Aug 2026
10:00 AM
```

---

## End Date

Optional.

Coupon automatically expires after this date.

Example

```
31 Aug 2026
11:59 PM
```

---

# Complete Example

## Campaign Identity

Coupon Code

```
WELCOME20
```

Campaign Title

```
Welcome Offer – 20% Off First Purchase
```

Description

```
Enjoy 20% off your first order at Two Threads Studio.

Minimum order value: ₹1,500

Maximum discount: ₹500

Offer valid until 31 December 2026.

Cannot be combined with other promotional offers.
```

---

## Discount Mechanics

Promotion Type

```
Percentage
```

Discount Value

```
20
```

Maximum Discount

```
500
```

Minimum Cart

```
1500
```

Global Usage Limit

```
Unlimited
```

Per User Limit

```
1
```

---

## Eligible Categories

Select

```
✓ Embroidery Kits

✓ DIY Craft Kits
```

---

## Eligible Collections

Select

```
✓ New Arrivals

✓ Bestseller Collection
```

---

## Eligible Products

Select

```
✓ Floral Bloom Embroidery Kit

✓ Lavender Meadow Starter Kit

✓ Botanical Wall Hanging Kit
```

---

## Configuration

Status

```
✓ Active
```

Stackable

```
No
```

Exclusive

```
Yes
```

---

## Schedule

Start

```
01 August 2026

10:00 AM
```

End

```
31 December 2026

11:59 PM
```

---

# Customer Checkout Example

Customer cart contains:

| Product                     |  Price |
| --------------------------- | -----: |
| Floral Bloom Embroidery Kit | ₹1,250 |
| Botanical Wall Hanging Kit  |   ₹950 |

Subtotal

```
₹2,200
```

Coupon

```
WELCOME20
```

Calculation

```
20%

↓

₹440 Discount
```

Shipping

```
₹120
```

GST

```
Calculated automatically
```

Final Summary

| Item        |                       Amount |
| ----------- | ---------------------------: |
| Subtotal    |                       ₹2,200 |
| Discount    |                        -₹440 |
| Shipping    |                         ₹120 |
| GST         |     Calculated automatically |
| Grand Total | Based on server-side pricing |

---

# Best Practices

* Use clear, memorable coupon codes (e.g., `WELCOME20`, `FESTIVE15`).
* Always define a **maximum discount cap** for percentage-based promotions to control costs.
* Set a **minimum cart value** to encourage higher average order values.
* Use **per-user limits** to prevent repeated abuse.
* Prefer **date-based activation and expiry** for seasonal campaigns.
* Test every new coupon with a customer account before publishing it.
* Use **Category**, **Collection**, and **Product** targeting to create highly focused promotions rather than applying discounts storewide whenever possible.
* Review coupon analytics regularly to measure redemption rates, revenue impact, and overall campaign performance.

Following these practices will help maintain a secure, flexible, and effective promotions system while delivering a smooth checkout experience for customers.
