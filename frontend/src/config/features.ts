/**
 * Feature Flags Configuration
 * Centralized feature flags for Two Threads Studio launch control.
 *
 * Default safe state is OFF (false) for launch.
 */

export interface FeatureFlags {
  LEARNING_HUB: boolean;
}

export const DEFAULT_FEATURES: FeatureFlags = {
  LEARNING_HUB: false,
};
