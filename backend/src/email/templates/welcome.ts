/**
 * Welcome Email Template — Two Threads Studio
 * Brand Voice: Artisan, Premium, Authentic, Warm, Minimal, Human
 */

import { baseLayout, colors } from './_base';

export interface WelcomeEmailParams {
  firstName: string;
  email: string;
  verificationUrl?: string;
  exploreUrl?: string;
}

export function generateWelcomeEmail(params: WelcomeEmailParams): { subject: string; html: string } {
  const name = params.firstName.trim() || 'Friend';
  const exploreLink = params.exploreUrl || process.env.FRONTEND_URL || 'https://twothreadsstudio.com';
  const verificationLink = params.verificationUrl;

  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div class="section-label">Slow Craft · Handmade with Intention</div>
      <h1 class="title" style="font-size: 26px; margin-top: 8px; margin-bottom: 24px;">Welcome to TwoThreads Studio</h1>
    </div>

    <p class="text" style="font-size: 15px; color: ${colors.primary}; margin-bottom: 20px;">
      Hello ${name},
    </p>

    <p class="text">
      Thank you for joining our community. We are honored to welcome you into our studio space—a dedicated home for slow craft, heritage textiles, and thoughtful design.
    </p>

    <p class="text">
      Every creation at TwoThreads Studio is handcrafted by skilled Indian artisans using age-old techniques passed down through generations. From hand-embroidered hoops and curated DIY craft kits to bespoke home decor, each piece carries a story of patience, beauty, and human touch.
    </p>

    <p class="text" style="margin-bottom: 28px;">
      Whether you are here to acquire an heirloom piece or embark on your own creative crafting journey, we invite you to explore our studio collections.
    </p>

    ${
      verificationLink
        ? `
      <div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="${verificationLink}" class="cta-btn" style="background-color: ${colors.accent}; border-radius: 4px; padding: 14px 36px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${exploreLink}" style="font-family: Arial, sans-serif; font-size: 11px; color: ${colors.primary}; text-decoration: underline; letter-spacing: 0.15em; text-transform: uppercase;">
          Or Explore the Collection &rarr;
        </a>
      </div>
    `
        : `
      <div style="text-align: center; margin: 36px 0;">
        <a href="${exploreLink}" class="cta-btn" style="border-radius: 4px; padding: 14px 36px; display: inline-block;">
          Explore the Collection
        </a>
      </div>
    `
    }

    <div class="divider"></div>

    <div style="font-family: Arial, sans-serif; font-size: 12px; color: ${colors.muted}; line-height: 1.6; text-align: center;">
      <p style="font-family: Georgia, serif; font-style: italic; color: ${colors.primary}; font-size: 14px; margin-bottom: 8px;">
        "Craft is not just about what hands can make, but what heart and heritage can preserve."
      </p>
      <p style="text-transform: uppercase; font-size: 9px; letter-spacing: 0.2em; color: ${colors.accent};">
        — TwoThreads Studio Artisans
      </p>
    </div>
  `;

  const html = baseLayout(`Welcome to TwoThreads Studio, ${name}`, content);
  const subject = `Welcome to TwoThreads Studio, ${name}`;

  return { subject, html };
}
