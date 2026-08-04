/**
 * IThinkMapper
 *
 * Translates raw IThink Logistics response structures into normalized internal DTOs.
 */

import type {
  CourierOption,
  CreateShipmentResponse,
  LabelResponse,
  ServiceabilityResponse,
  TrackingEvent,
  TrackingResponse,
} from '../interfaces/ShippingDto';
import type {
  IThinkCourierOption,
  IThinkCreateOrderResponse,
  IThinkLabelResponse,
  IThinkServiceabilityResponse,
  IThinkTrackResponse,
} from './Api';
import { mapProviderStatus } from '../interfaces/ShipmentStatusMapper';

export class IThinkMapper {
  static toCreateShipmentResponse(
    res: IThinkCreateOrderResponse,
    requestedOrderNo: string
  ): CreateShipmentResponse {
    // Extract data object for the order
    const orderDataKey = res.data ? Object.keys(res.data)[0] : undefined;
    const orderData = orderDataKey && res.data ? res.data[orderDataKey] : undefined;

    const awb = orderData?.waybill_number || `ITK-${requestedOrderNo}`;
    const externalOrderId = orderData?.order_id || `ITK-ORD-${requestedOrderNo}`;
    const courierName = orderData?.courier_name || 'IThink Logistics Partner';

    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + 4);

    return {
      externalShipmentId: externalOrderId,
      externalOrderId,
      externalAwbNumber: awb,
      courierCode: 'ITHINK',
      courierName,
      trackingUrl: `https://ithinklogistics.com/track/${awb}`,
      estimatedDelivery: estDelivery,
      shippingCost: 99,
      labelUrl: orderData?.label_url || `https://ithinklogistics.com/label/${awb}.pdf`,
      raw: res as any,
    };
  }

  static toTrackingResponse(
    res: IThinkTrackResponse,
    awbNumber: string
  ): TrackingResponse {
    const dataKey = res.data ? Object.keys(res.data)[0] : undefined;
    const trackingData = dataKey && res.data ? res.data[dataKey]?.tracking_data : undefined;

    const rawStatus = trackingData?.current_status || 'In Transit';
    const internalStatus = mapProviderStatus('ithink' as any, rawStatus);

    const rawActivities = trackingData?.shipment_track_activities || [];

    const events: TrackingEvent[] = rawActivities.map((act) => ({
      status: mapProviderStatus('ithink' as any, act.status || 'In Transit'),
      location: act.location || 'Hub',
      timestamp: act.date_time ? new Date(act.date_time) : new Date(),
      description: act.remark || act.status,
    }));

    return {
      status: internalStatus,
      location: rawActivities[0]?.location || 'Hub',
      timestamp: new Date(),
      events,
      raw: res as any,
    };
  }

  static toServiceabilityResponse(
    res: IThinkServiceabilityResponse
  ): ServiceabilityResponse {
    const couriers: CourierOption[] = (
      res.data?.available_courier_companies || []
    ).map((c: IThinkCourierOption) => ({
      code: String(c.courier_id),
      name: c.courier_name,
      price: c.rate,
      etaDays: c.expected_delivery_days || 3,
      rating: 4.2,
      codAvailable: true,
    }));

    return {
      available: couriers.length > 0,
      couriers,
    };
  }

  static toLabelResponse(res: IThinkLabelResponse, awbNumber: string): LabelResponse {
    return {
      labelUrl: res.data?.label_url || `https://ithinklogistics.com/label/${awbNumber}.pdf`,
    };
  }
}
