/**
 * Risk Event Listeners — Phase 5C
 *
 * Listens to order/payment/shipment events and updates CustomerRisk counters.
 * Trust score is recalculated after every relevant event via TrustScoreEngine.
 */

import { eventDispatcher } from '../LocalEventDispatcher';
import { OrderEvents, PaymentEvents, ShipmentEvents } from '../OrderEvents';
import { customerRiskRepository } from '../../repositories/customer-risk.repository';
import { riskService } from '../../services/risk.service';
import logger from '../../lib/logger';

// Order placed — increment ordersPlaced and payment method counter
eventDispatcher.on(OrderEvents.CREATED, async (data: { userId: string; paymentMethod: string }) => {
  try {
    await customerRiskRepository.incrementCounters(data.userId, {
      ordersPlaced: 1,
      prepaidOrders: data.paymentMethod === 'ONLINE' ? 1 : 0,
      codOrders: data.paymentMethod === 'COD' ? 1 : 0,
    });
    await riskService.recalculateTrustScore(data.userId);
    logger.info({ userId: data.userId, paymentMethod: data.paymentMethod }, '[RiskListener] Order placed');
  } catch (err) {
    logger.error({ err }, '[RiskListener] Failed to handle ORDER_CREATED');
  }
});

// Order cancelled — penalise
eventDispatcher.on(OrderEvents.CANCELLED, async (data: { userId: string }) => {
  try {
    await customerRiskRepository.incrementCounters(data.userId, { cancelledOrders: 1 });
    await riskService.recalculateTrustScore(data.userId);
    logger.info({ userId: data.userId }, '[RiskListener] Cancellation recorded');
  } catch (err) {
    logger.error({ err }, '[RiskListener] Failed to handle ORDER_CANCELLED');
  }
});

// Payment failed — penalise
eventDispatcher.on(PaymentEvents.FAILED, async (data: { userId: string }) => {
  try {
    await customerRiskRepository.incrementCounters(data.userId, { failedPayments: 1 });
    await riskService.recalculateTrustScore(data.userId);
    logger.info({ userId: data.userId }, '[RiskListener] Payment failure recorded');
  } catch (err) {
    logger.error({ err }, '[RiskListener] Failed to handle PAYMENT_FAILED');
  }
});

// Order delivered — reward
eventDispatcher.on(ShipmentEvents.DELIVERED, async (data: { userId: string }) => {
  try {
    await customerRiskRepository.incrementCounters(data.userId, { ordersDelivered: 1 });
    await riskService.recalculateTrustScore(data.userId);
    logger.info({ userId: data.userId }, '[RiskListener] Delivery confirmed — trust score updated');
  } catch (err) {
    logger.error({ err }, '[RiskListener] Failed to handle DELIVERED');
  }
});

// Order returned (RTO) — heavy penalty
eventDispatcher.on(ShipmentEvents.RETURNED, async (data: { userId: string }) => {
  try {
    await customerRiskRepository.incrementCounters(data.userId, { rtoCount: 1 });
    await riskService.recalculateTrustScore(data.userId);
    logger.warn({ userId: data.userId }, '[RiskListener] RTO recorded — trust penalised');
  } catch (err) {
    logger.error({ err }, '[RiskListener] Failed to handle RETURNED');
  }
});

logger.info('[RiskListeners] All risk event listeners registered');
