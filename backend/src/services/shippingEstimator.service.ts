/**
 * ShippingEstimator Service
 *
 * Single entry point for all shipping cost/ETA estimation across the application.
 * Used by: Checkout, Admin order view, Returns, Analytics.
 *
 * Courier Selection Strategies:
 *  CHEAPEST     — Lowest price
 *  FASTEST      — Lowest ETA days
 *  BEST_RATED   — Highest rating
 *  LOWEST_RTO   — Lowest RTO rate (approximated by high rating)
 *  CUSTOM       — Score-weighted composite (uses ShippingSettings weights)
 */

import prisma from '../prisma';
import { shippingProvider } from '../providers/shipping';
import type { CourierOption, EstimateShippingRequest, ServiceabilityRequest } from '../providers/shipping';
import logger from '../lib/logger';

export type CourierSelectionStrategy = 'CHEAPEST' | 'FASTEST' | 'BEST_RATED' | 'LOWEST_RTO' | 'CUSTOM';

// ─────────────────────────────────────────────────────────────────────────────
// Scoring engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a numeric value into 0–1 range (higher is better).
 * For "lower is better" dimensions (price, ETA), invert with 1/x normalization.
 */
function normalize(values: number[], value: number, lowerIsBetter = false): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 1; // All the same — equal score
  const normalized = (value - min) / (max - min);
  return lowerIsBetter ? 1 - normalized : normalized;
}

/** Score a courier option based on strategy */
function scoreCourier(
  courier: CourierOption,
  allCouriers: CourierOption[],
  strategy: CourierSelectionStrategy
): number {
  const prices = allCouriers.map((c) => c.price);
  const etas = allCouriers.map((c) => c.etaDays);
  const ratings = allCouriers.map((c) => c.rating);

  switch (strategy) {
    case 'CHEAPEST':
      return normalize(prices, courier.price, true);
    case 'FASTEST':
      return normalize(etas, courier.etaDays, true);
    case 'BEST_RATED':
      return normalize(ratings, courier.rating, false);
    case 'LOWEST_RTO':
      // Approximated as: high rating = low RTO tendency
      return normalize(ratings, courier.rating, false);
    case 'CUSTOM':
    default: {
      // Composite score: Price 35% + ETA 35% + Rating 20% + COD bonus 10%
      const priceScore = normalize(prices, courier.price, true);
      const etaScore = normalize(etas, courier.etaDays, true);
      const ratingScore = normalize(ratings, courier.rating, false);
      const codBonus = courier.codAvailable ? 1 : 0;
      return priceScore * 0.35 + etaScore * 0.35 + ratingScore * 0.2 + codBonus * 0.1;
    }
  }
}

/** Sort couriers by strategy and return the ranked list */
function rankCouriers(
  couriers: CourierOption[],
  strategy: CourierSelectionStrategy
): CourierOption[] {
  if (couriers.length <= 1) return couriers;
  return [...couriers].sort(
    (a, b) => scoreCourier(b, couriers, strategy) - scoreCourier(a, couriers, strategy)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Estimator Service
// ─────────────────────────────────────────────────────────────────────────────

export const shippingEstimator = {
  /**
   * Get ranked shipping estimates for a destination.
   * Returns couriers sorted by the active selection strategy from ShippingSettings.
   */
  async estimate(req: EstimateShippingRequest): Promise<CourierOption[]> {
    if (!shippingProvider.capabilities.supportsRateEstimation) {
      logger.debug('[ShippingEstimator] Provider does not support rate estimation');
      return [];
    }

    try {
      const result = await shippingProvider.estimateShipping(req);
      const strategy = await shippingEstimator.getActiveStrategy();
      return rankCouriers(result.couriers, strategy);
    } catch (err) {
      logger.error({ err }, '[ShippingEstimator] estimate() failed');
      return [];
    }
  },

  /**
   * Quick boolean check: is the destination pincode serviceable?
   */
  async checkServiceability(req: ServiceabilityRequest): Promise<boolean> {
    if (!shippingProvider.capabilities.supportsServiceabilityCheck) return true; // assume yes for mock
    try {
      const result = await shippingProvider.checkServiceability(req);
      return result.available;
    } catch (err) {
      logger.error({ err }, '[ShippingEstimator] checkServiceability() failed');
      return true; // non-fatal — don't block checkout on estimator errors
    }
  },

  /**
   * Pick the best courier from a list using the active strategy.
   * Returns the first (highest-scored) courier, or null if the list is empty.
   */
  async getBestCourier(couriers: CourierOption[]): Promise<CourierOption | null> {
    if (couriers.length === 0) return null;
    const strategy = await shippingEstimator.getActiveStrategy();
    const ranked = rankCouriers(couriers, strategy);
    return ranked[0] ?? null;
  },

  /**
   * Reads the active courier selection strategy from ShippingSettings.
   * Falls back to CHEAPEST if the settings row doesn't exist.
   */
  async getActiveStrategy(): Promise<CourierSelectionStrategy> {
    try {
      const settings = await prisma.shippingSettings.findUnique({ where: { id: 'singleton' } });
      return (settings?.selectionStrategy as CourierSelectionStrategy) ?? 'CHEAPEST';
    } catch {
      return 'CHEAPEST';
    }
  },
};
