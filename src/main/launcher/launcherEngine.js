const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

class LauncherEngine {
  constructor(profileManager, proxyManager, fingerprintEngine) {
    this.profileManager = profileManager;
    this.proxyManager = proxyManager;
    this.fingerprintEngine = fingerprintEngine;
    this.activeBrowsers = new Map();
    this.launchQueue = [];
    this.maxConcurrentBrowsers = 50;
    this.isProcessingQueue = false;
  }

  async launchProfile(profileId) {
    try {
      const profile = await this.profileManager.getProfileById(profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      // Check if already running
      if (this.activeBrowsers.has(profileId)) {
        return { success: false, error: 'Profile already running' };
      }

      // Add to queue
      return new Promise((resolve, reject) => {
        this.launchQueue.push({
          profileId,
          resolve,
          reject,
        });
        this.processQueue();
      });
    } catch (error) {
      console.error('Failed to launch profile:', error);
      return { success: false, error: error.message };
    }
  }

  async processQueue() {
    if (this.isProcessingQueue || this.launchQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.launchQueue.length > 0 && this.activeBrowsers.size < this.maxConcurrentBrowsers) {
      const task = this.launchQueue.shift();
      this.launchProfileInternal(task);
    }

    this.isProcessingQueue = false;
  }

  async launchProfileInternal(task) {
    const { profileId, resolve, reject } = task;

    try {
      const profile = await this.profileManager.getProfileById(profileId);
      if (!profile) {
        reject(new Error('Profile not found'));
        return;
      }

      // Get proxy if assigned
      let proxyConfig = null;
      if (profile.proxy_id) {
        const proxy = await this.proxyManager.getProxyById(profile.proxy_id);
        if (proxy && proxy.is_active) {
          proxyConfig = {
            server: `${proxy.type}://${proxy.host}:${proxy.port}`,
            username: proxy.username,
            password: proxy.password,
          };
        }
      }

      // Get fingerprint if assigned
      let fingerprint = null;
      if (profile.fingerprint_id) {
        fingerprint = await this.fingerprintEngine.getFingerprintById(profile.fingerprint_id);
      }

      // Launch browser with Playwright
      const browser = await chromium.launchPersistentContext(profile.user_data_dir, {
        headless: false,
        viewport: fingerprint ? { width: fingerprint.viewport_width, height: fingerprint.viewport_height } : null,
        proxy: proxyConfig,
        args: this.buildBrowserArgs(fingerprint),
        ignoreDefaultArgs: ['--enable-automation'],
        locale: fingerprint ? fingerprint.locale : 'en-US',
        timezoneId: fingerprint ? fingerprint.timezone : 'America/New_York',
        permissions: ['geolocation', 'notifications'],
      });

      // Create new page or get existing one
      const pages = browser.pages();
      let page;
      if (pages.length > 0) {
        page = pages[0];
      } else {
        page = await browser.newPage();
      }

      // Set user agent if assigned
      if (profile.user_agent_id) {
        // TODO: Get user agent from database
      }

      // Navigate to startup URL
      if (profile.startup_url) {
        await page.goto(profile.startup_url);
      }

      // Store active browser
      this.activeBrowsers.set(profileId, {
        browser,
        page,
        profile,
        launchedAt: Date.now(),
      });

      // Update profile status
      await this.profileManager.updateProfile(profileId, { status: 'running' });

      resolve({ success: true, profileId, browser });
    } catch (error) {
      console.error('Failed to launch profile:', error);
      
      // Update profile status to crashed
      await this.profileManager.updateProfile(profileId, { status: 'crashed' });
      
      reject(error);
    }
  }

  buildBrowserArgs(fingerprint) {
    const args = [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-webgl',
    ];

    if (fingerprint) {
      // Add fingerprint-specific args
      if (fingerprint.language) {
        args.push(`--lang=${fingerprint.language}`);
      }
    }

    return args;
  }

  async stopProfile(profileId) {
    try {
      const browserData = this.activeBrowsers.get(profileId);
      if (!browserData) {
        return { success: false, error: 'Profile not running' };
      }

      const { browser } = browserData;

      // Close browser
      await browser.close();

      // Remove from active browsers
      this.activeBrowsers.delete(profileId);

      // Update profile status
      await this.profileManager.updateProfile(profileId, { status: 'stopped' });

      return { success: true };
    } catch (error) {
      console.error('Failed to stop profile:', error);
      return { success: false, error: error.message };
    }
  }

  async launchBatch(profileIds) {
    const results = [];

    for (const profileId of profileIds) {
      try {
        const result = await this.launchProfile(profileId);
        results.push({ profileId, ...result });
        
        // Add staggered delay to avoid resource spikes
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ profileId, success: false, error: error.message });
      }
    }

    return { success: true, results };
  }

  async stopAll() {
    const results = [];

    for (const [profileId] of this.activeBrowsers) {
      try {
        const result = await this.stopProfile(profileId);
        results.push({ profileId, ...result });
      } catch (error) {
        results.push({ profileId, success: false, error: error.message });
      }
    }

    return { success: true, results };
  }

  async getActiveProfiles() {
    const activeProfiles = [];

    for (const [profileId, browserData] of this.activeBrowsers) {
      activeProfiles.push({
        profileId,
        profile: browserData.profile,
        launchedAt: browserData.launchedAt,
        uptime: Date.now() - browserData.launchedAt,
      });
    }

    return activeProfiles;
  }

  async getQueueStatus() {
    return {
      queueLength: this.launchQueue.length,
      activeCount: this.activeBrowsers.size,
      maxConcurrent: this.maxConcurrentBrowsers,
    };
  }

  setMaxConcurrentBrowsers(max) {
    this.maxConcurrentBrowsers = Math.max(1, Math.min(100, max));
  }
}

module.exports = LauncherEngine;
