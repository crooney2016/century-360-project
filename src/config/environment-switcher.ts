/**
 * Environment Switcher
 *
 * Manages virtual configurations for dual-environment setup:
 * - Stable: Chakra UI v3 + Custom components
 * - Beta: Chakra UI v3 + SaaS UI v3 beta
 */

import { stableConfig } from "./environments/stable.config";
import { betaConfig } from "./environments/beta.config";

export type Environment = "stable" | "beta";

export class EnvironmentSwitcher {
  private static _currentEnv: Environment = "stable";
  private static _config: typeof stableConfig | typeof betaConfig = stableConfig;

  /**
   * Get the current environment
   */
  static get currentEnv(): Environment {
    return this._currentEnv;
  }

  /**
   * Get the current configuration
   */
  static get config() {
    return this._config;
  }

  /**
   * Switch to a different environment
   */
  static switchTo(env: Environment) {
    this._currentEnv = env;
    this._config = env === "stable" ? stableConfig : betaConfig;
    this.updateVirtualConfigs();
  }

  /**
   * Check if we're in stable environment
   */
  static isStable(): boolean {
    return this._currentEnv === "stable";
  }

  /**
   * Check if we're in beta environment
   */
  static isBeta(): boolean {
    return this._currentEnv === "beta";
  }

  /**
   * Get environment-specific package
   */
  static getPackage(packageType: keyof typeof stableConfig.packages) {
    return this._config.packages[packageType];
  }

  /**
   * Check if a feature is enabled
   */
  static isFeatureEnabled(feature: keyof typeof stableConfig.features): boolean {
    return this._config.features[feature];
  }

  /**
   * Update virtual configurations (runtime only, no file changes)
   */
  private static updateVirtualConfigs() {
    // Virtual configuration updates
    // This is purely runtime - no actual file changes
    console.log(`Switched to ${this._currentEnv} environment`);

    // Update global configuration for tests
    if (typeof global !== "undefined") {
      (
        global as {
          currentEnvironment?: Environment;
          currentConfig?: typeof stableConfig | typeof betaConfig;
        }
      ).currentEnvironment = this._currentEnv;
      (
        global as {
          currentEnvironment?: Environment;
          currentConfig?: typeof stableConfig | typeof betaConfig;
        }
      ).currentConfig = this._config;
    }
  }

  /**
   * Initialize environment from process.env
   */
  static initialize() {
    const envFromProcess = process.env.ENV as Environment;
    if (envFromProcess && (envFromProcess === "stable" || envFromProcess === "beta")) {
      this.switchTo(envFromProcess);
    }
  }
}

// Initialize on module load
EnvironmentSwitcher.initialize();

// Export convenience functions
export const isStable = () => EnvironmentSwitcher.isStable();
export const isBeta = () => EnvironmentSwitcher.isBeta();
export const getConfig = () => EnvironmentSwitcher.config;
export const switchTo = (env: Environment) => EnvironmentSwitcher.switchTo(env);
