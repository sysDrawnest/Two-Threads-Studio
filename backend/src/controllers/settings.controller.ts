/**
 * Settings Controller — Phase 6A
 * Business settings stored in the database — never exposes .env secrets.
 * Uses singleton pattern: one StudioSettings row, always upserted.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { successResponse } from '../utils/response';

const SINGLETON_WHERE = { singleton: true };

export const settingsController = {
  // ── Get settings ──────────────────────────────────────────────────────────
  getSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await prisma.studioSettings.findUnique({ where: SINGLETON_WHERE });

      // Auto-create with defaults if not yet seeded
      if (!settings) {
        settings = await prisma.studioSettings.create({ data: {} });
      }

      return successResponse(res, settings);
    } catch (err) {
      next(err);
    }
  },

  // ── Update company details ────────────────────────────────────────────────
  updateCompany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        companyName, companyTagline, companyEmail, companyPhone,
        companyAddress, companyCity, companyState, companyCountry,
        companyPincode, companyWebsite,
      } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { ...req.body },
        update: {
          companyName, companyTagline, companyEmail, companyPhone,
          companyAddress, companyCity, companyState, companyCountry,
          companyPincode, companyWebsite,
        },
      });

      return successResponse(res, settings, 'Company details updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update GST settings ───────────────────────────────────────────────────
  updateGst: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gstNumber, gstEnabled, gstPercent, gstMode, hsnCode } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { gstNumber, gstEnabled, gstPercent, gstMode, hsnCode },
        update: { gstNumber, gstEnabled, gstPercent, gstMode, hsnCode },
      });

      return successResponse(res, settings, 'GST settings updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update shipping configuration ─────────────────────────────────────────
  updateShipping: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        freeShippingThreshold, standardShippingCharge,
        expressShippingCharge, shippingEnabled, shippingNote,
      } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { freeShippingThreshold, standardShippingCharge, expressShippingCharge, shippingEnabled, shippingNote },
        update: { freeShippingThreshold, standardShippingCharge, expressShippingCharge, shippingEnabled, shippingNote },
      });

      return successResponse(res, settings, 'Shipping settings updated');
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

      return successResponse(res, settings, 'COD rules updated');
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

      return successResponse(res, settings, 'Return policy updated');
    } catch (err) {
      next(err);
    }
  },

  // ── Update invoice settings ───────────────────────────────────────────────
  updateInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { invoicePrefix, invoiceFooter, invoiceLogo } = req.body;

      const settings = await prisma.studioSettings.upsert({
        where: SINGLETON_WHERE,
        create: { invoicePrefix, invoiceFooter, invoiceLogo },
        update: { invoicePrefix, invoiceFooter, invoiceLogo },
      });

      return successResponse(res, settings, 'Invoice settings updated');
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

      return successResponse(res, settings, 'Support contact updated');
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

      return successResponse(res, settings, 'Email templates updated');
    } catch (err) {
      next(err);
    }
  },
};
