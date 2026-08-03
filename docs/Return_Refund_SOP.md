# Standard Operating Procedure: Returns & Refunds 
**System:** Two Threads Studio Admin Panel & Razorpay Dashboard  
**Audience:** Customer Support, Finance, and Operations Teams  
**Last Updated:** August 2026

---

## 1. Overview
At Two Threads Studio, customer returns and refunds are processed primarily through our custom Admin Dashboard. The Admin Dashboard is fully integrated with Razorpay's API. 

**Golden Rule:** You should *always* initiate refunds from the Two Threads Studio Admin Dashboard. The system will automatically communicate with Razorpay to process the transaction. You do **not** need to manually process refunds in the Razorpay Dashboard.

---

## 2. Processing a Refund (The Correct Way)

When a customer return is approved and the item has been inspected at the warehouse:
1. Log in to the **Two Threads Studio Admin Dashboard**.
2. Navigate to the **Returns/Orders** section and open the specific Return Request.
3. Click **Approve Return / Issue Refund**.
4. The system will calculate the eligible refund amount. *(Note: Shipping fees are generally non-refundable unless the return is due to a studio error).*
5. Confirm the action. 

The backend will automatically trigger the Razorpay API to process the refund. The customer will be notified, and the funds will be credited to their original payment method within 5-7 working days.

---

## 3. Understanding Partial vs. Full Refunds

It is crucial to understand the difference between a Partial and a Full refund, as it dictates how data is displayed in our systems.

- **Full Refund:** 100% of the customer's payment is returned. (e.g., The order total was ₹3,599, and you refunded ₹3,599).
- **Partial Refund:** Only a portion of the payment is returned. (e.g., The order total was ₹3,599, but you refunded ₹3,500 for the product and retained the ₹99 shipping fee).

**Standard returns are almost always Partial Refunds** because shipping fees are deducted.

---

## 4. Razorpay Dashboard: Common Confusions & FAQ

If you log into the Razorpay Dashboard to verify a transaction, you might encounter a few confusing UI elements. Please refer to this guide before raising an IT ticket.

### Confusion A: "Why does the Razorpay Dashboard still show an 'Issue Refund' button after I already refunded the order?"
**Scenario:** You refunded a ₹3,500 product from a ₹3,599 order via the Admin Dashboard. The Razorpay timeline shows a green checkmark saying "Refund (Processed) ₹3,500". However, there is still a big blue "Issue Refund" button for ₹99.

**Explanation:** 
Because you issued a **Partial Refund**, Razorpay keeps the "Issue Refund" button active just in case you ever want to refund the remaining balance (the ₹99 shipping fee). 
**Action:** Ignore this button. Do not click it unless you intentionally want to refund the shipping fee. Your initial refund was already successful.

### Confusion B: "Why isn't the payment showing up under the 'Refunded' tab?"
**Scenario:** You go to `Razorpay > Payments` and click the **"Refunded"** filter tab. It says "No payment in selected duration", even though you just processed a refund!

**Explanation:** 
In Razorpay's Payment list, a payment's status only changes to **"Refunded"** if 100% of the money was returned (a Full Refund). Because you only refunded the product cost and kept the shipping fee, the payment's status remains **"Captured"**. 
**Action:** 
- To find a partially refunded payment, check the **"Captured"** tab or the **"All"** tab.
- If you want to see a list of actual refund transactions, do not use the "Payments" tab. Instead, navigate to **Transactions > Refunds** in the left-hand sidebar.

---
*End of Document. For technical issues regarding refunds not processing, please escalate to the backend engineering team.*
