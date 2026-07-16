# Operations Notification System - Bug Report

## Bug ID: BUG-EMAIL-001
**Severity:** Major  
**Category:** Email Compatibility / Layout  
**Steps to Reproduce:**  
1. Trigger the Admin New Order email.  
2. Open the email in Microsoft Outlook (Desktop) or older native mail apps.  
**Expected Result:** Product images and text align perfectly side-by-side.  
**Actual Result:** The layout breaks and elements stack chaotically.  
**Root Cause:** The `admin-new-order.ts` template uses `<div style="display: flex; gap: 16px;">` for the product rows. The `flex` and `gap` properties have notoriously poor support across major email clients.  
**Suggested Fix:** Refactor the product item row into a classic HTML `<table>` with `<td>` padding instead of relying on modern CSS flexbox.  
**Status:** Resolved  

---

## Bug ID: BUG-EMAIL-002
**Severity:** Minor  
**Category:** Missing Data / UI  
**Steps to Reproduce:**  
1. Look at the `Products` section of the Admin Notification email.  
**Expected Result:** The individual "Unit Price" of the product is displayed next to the line total.  
**Actual Result:** Only the total price (`formatCurrency(item.lineTotal)`) is shown.  
**Root Cause:** The `unitPrice` field from `item.unitPrice` was omitted from the template string.  
**Suggested Fix:** Update the item row template to include `${formatCurrency(item.unitPrice)} x ${item.quantity}`.  
**Status:** Resolved  

---

## Bug ID: BUG-SEC-001
**Severity:** Minor  
**Category:** Security / Memory Footprint  
**Steps to Reproduce:**  
1. Trigger an order creation in `order.service.ts`.  
2. Inspect the raw `resultOrder` object loaded into the Node.js memory heap before event dispatch.  
**Expected Result:** The system only loads the necessary user fields for notifications (Name, Phone, Email).  
**Actual Result:** The Prisma query `include: { user: { include: { customerRisk: true } } }` performs a `SELECT *` on the `User` table, loading `passwordHash` and authentication tokens into the order event object.  
**Root Cause:** Over-fetching in the Prisma `include` statement.  
**Suggested Fix:** In `order.service.ts`, explicitly select only safe fields:
```ts
user: { 
  select: { 
    firstName: true, 
    lastName: true, 
    email: true, 
    phone: true, 
    customerRisk: true 
  } 
}
```  
**Status:** Resolved  
