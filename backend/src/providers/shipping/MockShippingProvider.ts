/**
 * MockShippingProvider
 *
 * Development/staging implementation of ShippingProvider.
 * Generates realistic mock tracking data without calling any external API.
 *
 * Replace this with ShiprocketProvider or DelhiveryProvider in production
 * by updating the factory (index.ts) — no business logic changes required.
 */

import { randomBytes } from 'crypto';
import type {
  ShippingProvider,
  CreateShipmentParams,
  ShipmentDetails,
  TrackingStatus,
} from './ShippingProvider.interface';

const MOCK_CARRIERS = ['BlueDart', 'DTDC', 'Delhivery', 'Ecom Express'];

function generateTrackingNumber(): string {
  const prefix = 'TTS';
  const suffix = randomBytes(5).toString('hex').toUpperCase();
  return `${prefix}${suffix}`;
}

export const mockShippingProvider: ShippingProvider = {
  async createShipment(params: CreateShipmentParams): Promise<ShipmentDetails> {
    // Simulate minor network latency
    await new Promise((resolve) => setTimeout(resolve, 50));

    const trackingNumber = generateTrackingNumber();
    const carrier = MOCK_CARRIERS[Math.floor(Math.random() * MOCK_CARRIERS.length)];

    // Estimated delivery: 5 business days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return {
      trackingNumber,
      carrier,
      shippingMethod: 'STANDARD',
      estimatedDelivery,
      labelUrl: `https://mock-shipping.example.com/labels/${trackingNumber}.pdf`,
      raw: {
        provider: 'MOCK',
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        trackingNumber,
        carrier,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const now = new Date();
    return {
      status: 'IN_TRANSIT',
      location: 'Mumbai Sorting Hub',
      timestamp: now,
      events: [
        {
          status: 'SHIPPED',
          location: 'Bengaluru Warehouse',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          description: 'Package picked up from artisan workshop',
        },
        {
          status: 'IN_TRANSIT',
          location: 'Mumbai Sorting Hub',
          timestamp: now,
          description: 'Package arrived at sorting facility',
        },
      ],
    };
  },
};
