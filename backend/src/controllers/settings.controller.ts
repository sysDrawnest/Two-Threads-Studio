/**
 * Settings Controller — Phase 6A/6B
 * Business settings stored in the database — never exposes .env secrets.
 * Uses singleton pattern: one StudioSettings row, always upserted.
 * Maps between flat database schema and frontend nested structure.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';

const SINGLETON_WHERE = { singleton: true };

const mapSettingsToFrontend = (settings: any) => {
  return {
    company: {
      name: settings.companyName,
      legalName: settings.companyName,
      supportEmail: settings.supportEmail || settings.companyEmail,
      supportPhone: settings.supportPhone || settings.companyPhone,
      address: settings.companyAddress,
    },
    gst: {
      enabled: settings.gstEnabled,
      gstin: settings.gstNumber,
      defaultRate: settings.gstPercent ? Number(settings.gstPercent) : 18,
    },
    shipping: {
      freeShippingThreshold: settings.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0,
      standardCost: settings.standardShippingCharge ? Number(settings.standardShippingCharge) : 0,
      estimatedDays: settings.shippingNote || '5-7',
    },
    invoice: {
      prefix: settings.invoicePrefix,
      footerNote: settings.invoiceFooter,
    }
  };
};

export const settingsController = {
  // ── Get settings ──────────────────────────────────────────────────────────
  getSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({ where: SINGLETON_WHERE });

      // Auto-create with defaults if not yet seeded
      if (!settings) {
        settings = await prisma.studioSettings.create({ data: {} });
      }

      return successResponse(res, mapSettingsToFrontend(settings));
    } catch (err) {
      next(err);
    }
  },

  // ── Update company details ────────────────────────────────────────────────
  updateCompany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, legalName, supportEmail, supportPhone, address } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: {
          companyName: name || 'Two Threads Studio',
          supportEmail,
          supportPhone,
          companyAddress: address,
        },
        update: {
          companyName: name,
          supportEmail,
          supportPhone,
          companyAddress: address,
        },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Company details updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update GST settings ───────────────────────────────────────────────────
  updateGst: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { enabled, gstin, defaultRate } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: {
          gstEnabled: enabled ?? true,
          gstNumber: gstin,
          gstPercent: defaultRate ?? 0,
        },
        update: {
          gstEnabled: enabled,
          gstNumber: gstin,
          gstPercent: defaultRate,
        },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'GST settings updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update shipping configuration ─────────────────────────────────────────
  updateShipping: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { freeShippingThreshold, standardCost, estimatedDays } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: {
          freeShippingThreshold: freeShippingThreshold ?? 0,
          standardShippingCharge: standardCost ?? 0,
          shippingNote: estimatedDays,
        },
        update: {
          freeShippingThreshold: freeShippingThreshold ?? 0,
          standardShippingCharge: standardCost ?? 0,
          shippingNote: estimatedDays,
        },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Shipping settings updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update COD rules ──────────────────────────────────────────────────────
  updateCod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { codEnabled, codMaxOrderValue, codExtraCharge, prepaidDiscountPercent } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { codEnabled, codMaxOrderValue, codExtraCharge, prepaidDiscountPercent },
        update: { codEnabled, codMaxOrderValue, codExtraCharge, prepaidDiscountPercent },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'COD rules updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update return policy ──────────────────────────────────────────────────
  updateReturnPolicy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { returnWindowDays, exchangeWindowDays, returnPolicy } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { returnWindowDays, exchangeWindowDays, returnPolicy },
        update: { returnWindowDays, exchangeWindowDays, returnPolicy },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Return policy updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update invoice settings ───────────────────────────────────────────────
  updateInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prefix, footerNote } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: {
          invoicePrefix: prefix || 'INV',
          invoiceFooter: footerNote,
        },
        update: {
          invoicePrefix: prefix,
          invoiceFooter: footerNote,
        },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Invoice settings updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update support contact ────────────────────────────────────────────────
  updateContact: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { supportEmail, supportPhone, supportHours } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { supportEmail, supportPhone, supportHours },
        update: { supportEmail, supportPhone, supportHours },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Support contact updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update email templates ────────────────────────────────────────────────
  updateEmailTemplates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderConfirmationNote, shippingUpdateNote } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { orderConfirmationNote, shippingUpdateNote },
        update: { orderConfirmationNote, shippingUpdateNote },
      });

      return successResponse(res, mapSettingsToFrontend(settings), 'Email templates updated');
    } catch (err) {
      next(err);
    }
  },
};
