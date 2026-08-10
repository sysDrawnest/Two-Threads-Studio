/**
 * FeatureRoute — Route Guard Component for Feature Flags
 *
 * Protects customer-facing routes when a feature flag is disabled.
 * Gracefully redirects to homepage ('/') if feature is OFF.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFeatures } from '../../context/FeatureContext';
import { FeatureFlags } from '../../config/features';

interface FeatureRouteProps {
  feature: keyof FeatureFlags;
  children: React.ReactNode;
}

export const FeatureRoute: React.FC<FeatureRouteProps> = ({ feature, children }) => {
  const { features } = useFeatures();

  if (!features[feature]) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
