# Phase 5C Implementation Report: Trust & Risk Management Engine

## Overview
Phase 5C establishes a comprehensive Trust and Risk Management Engine for the Two Threads Studio ecommerce platform. The primary goal of this phase is to mitigate RTO (Return to Origin) risks, prevent fraudulent orders, and dynamically adjust payment availability based on the customer's risk profile and trust score.

## Architecture & Components

The engine is built on a highly modular architecture that hooks directly into the checkout and order lifecycle. 

### 1. Core Engines
Located in `backend/src/engines/`, these modules operate independently of the API layer to provide pure risk calculation logic:
*   **`RiskEngine`**: The central orchestrator that combines fraud flags and COD rules to return a final `RiskDecision` (`APPROVED`, `REQUIRES_OTP`, `MANUAL_REVIEW`, `PREPAID_ONLY`, `BLOCKED`).
*   **`CodEligibilityEngine`**: Evaluates cart contents, customer history (RTOs, cancellations), and thresholds to dynamically enable or disable Cash on Delivery.
*   **`TrustScoreEngine`**: A metric-based calculator that adjusts a customer's trust score based on successful deliveries, prepaid order history, and negative events (RTOs, chargebacks).
*   **`FraudDetector`**: Analyzes real-time metrics (e.g., velocity of orders, failed payments, shared IP/phone) to generate severity-based `FraudFlag` instances.

### 2. Service Layer Integration
*   **`risk.service.ts`**: Exposes the engine capabilities to the controllers and the order service. Responsible for fetching necessary DB context before running the engines.
*   **`order.service.ts`**: Heavily modified to integrate `riskService.evaluateCheckout()` *prior* to executing the order transaction. It acts as an un-bypassable gatekeeper. If a decision is `REQUIRES_OTP` or `BLOCKED`, it throws an exception (HTTP 428 or 403) to halt the checkout.
*   **`otp.service.ts`**: Provides an abstraction layer for OTP sending and verification. It currently utilizes a `MockOtpProvider` for development but is structured to accept MSG91 or Twilio providers seamlessly.

### 3. Event-Driven Feedback Loop
To ensure trust scores evolve naturally, a suite of event listeners was added to `backend/src/events/risk.listeners.ts`. 
These listeners hook into existing system events (e.g., `OrderEvents.DELIVERED`, `ShipmentEvents.RTO`) to asynchronously adjust the `CustomerRisk` record.

### 4. Frontend Integration (`Checkout.tsx`)
The React frontend was updated to dynamically react to the risk engine's decisions:
*   **Dynamic COD Verification:** Upon entering the payment step, the frontend queries `/api/v1/risk/cod-eligibility`. If ineligible, the COD button is grayed out with a clear explanatory message.
*   **Prepaid Incentives:** The UI displays a dynamic discount badge (e.g., "5% OFF") on the online payment option based on the backend configuration.
*   **OTP Modal Overlay:** If the backend halts the order with an `OTP_REQUIRED` error, the UI intercepts it, displays a secure OTP verification modal, and automatically resumes the checkout flow upon successful verification.

## Database Schema Changes
The Prisma schema was expanded to support the new domain:
*   `CustomerRisk`: Tracks trust scores, RTO counts, and order velocities per user.
*   `OtpVerification`: Logs OTP requests, expiry times, and verification statuses.
*   `FraudFlag`: Stores detailed metadata about suspicious behavior.
*   `ManualReviewQueue`: Holds flagged orders awaiting admin approval.

## Environment Variables
The system behavior is highly configurable via `.env`:
*   `PREPAID_DISCOUNT_PERCENT`: Server-side configuration for prepaid incentives.
*   `MANUAL_REVIEW_THRESHOLD_INR`: Order value threshold that triggers an automatic admin review queue.
*   `MANUAL_REVIEW_TRUST_THRESHOLD`: Trust score threshold for flagging.

## Next Steps & Future Enhancements
*   **Admin Dashboard:** Build the UI components for administrators to view and resolve items in the `ManualReviewQueue`.
*   **Provider Integration:** Swap the `MockOtpProvider` with a production SMS gateway prior to public launch.
*   **Machine Learning (V2):** Expand the `FraudDetector` to support ML-based anomaly detection as data volume grows.
