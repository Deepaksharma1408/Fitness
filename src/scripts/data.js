/* ==========================================================================
   DYNAMIC DATA ADAPTER CONNECTED TO CMS STORE
   ========================================================================== */

import { getSiteConfig } from './store.js';

export function getCoachesData() {
  return getSiteConfig().coaches || [];
}

export function getServicesData() {
  return getSiteConfig().services || [];
}

export function getComparisonData() {
  return getSiteConfig().comparison || [];
}

export function getFaqsData() {
  return getSiteConfig().faqs || [];
}

export function getPillarsData() {
  return getSiteConfig().pillars || [];
}

export function getPricingData() {
  return getSiteConfig().pricing || [];
}

// Backward-compatibility exports
export const COACHES_DATA = getSiteConfig().coaches;
export const SERVICES_DATA = getSiteConfig().services;
export const COMPARISON_DATA = getSiteConfig().comparison;
export const FAQS_DATA = getSiteConfig().faqs;
