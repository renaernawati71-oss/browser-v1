const crypto = require('crypto');

class FingerprintEngine {
  constructor(database) {
    this.database = database;
  }

  async generateFingerprint(options = {}) {
    const fingerprintId = crypto.randomUUID();

    // Generate realistic fingerprint based on options
    const fingerprint = {
      id: fingerprintId,
      name: options.name || `Fingerprint ${fingerprintId.slice(0, 8)}`,
      user_agent_id: options.user_agent_id || null,
      viewport_width: options.viewport_width || this.getRandomViewport().width,
      viewport_height: options.viewport_height || this.getRandomViewport().height,
      timezone: options.timezone || this.getRandomTimezone(),
      locale: options.locale || this.getRandomLocale(),
      language: options.language || this.getRandomLanguage(),
      webbrtc_mode: options.webbrtc_mode || 'default',
      canvas_mode: options.canvas_mode || 'noise',
      webgl_vendor: options.webgl_vendor || this.getRandomWebGLVendor(),
      webgl_renderer: options.webgl_renderer || this.getRandomWebGLRenderer(),
      fonts: options.fonts ? JSON.stringify(options.fonts) : JSON.stringify(this.getRandomFonts()),
      hardware_concurrency: options.hardware_concurrency || this.getRandomHardwareConcurrency(),
      device_memory: options.device_memory || this.getRandomDeviceMemory(),
      platform: options.platform || this.getRandomPlatform(),
      is_template: options.is_template || false,
    };

    try {
      this.database.db.prepare(`
        INSERT INTO fingerprints (
          id, name, user_agent_id, viewport_width, viewport_height, timezone, locale, language,
          webbrtc_mode, canvas_mode, webgl_vendor, webgl_renderer, fonts, hardware_concurrency,
          device_memory, platform, is_template
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fingerprint.id,
        fingerprint.name,
        fingerprint.user_agent_id,
        fingerprint.viewport_width,
        fingerprint.viewport_height,
        fingerprint.timezone,
        fingerprint.locale,
        fingerprint.language,
        fingerprint.webbrtc_mode,
        fingerprint.canvas_mode,
        fingerprint.webgl_vendor,
        fingerprint.webgl_renderer,
        fingerprint.fonts,
        fingerprint.hardware_concurrency,
        fingerprint.device_memory,
        fingerprint.platform,
        fingerprint.is_template
      );

      return { success: true, fingerprint };
    } catch (error) {
      console.error('Failed to generate fingerprint:', error);
      return { success: false, error: error.message };
    }
  }

  async validateFingerprint(fingerprint) {
    const issues = [];

    // Validate viewport dimensions
    if (fingerprint.viewport_width < 320 || fingerprint.viewport_width > 7680) {
      issues.push('Invalid viewport width');
    }
    if (fingerprint.viewport_height < 240 || fingerprint.viewport_height > 4320) {
      issues.push('Invalid viewport height');
    }

    // Validate timezone
    if (!this.isValidTimezone(fingerprint.timezone)) {
      issues.push('Invalid timezone');
    }

    // Validate hardware concurrency
    if (fingerprint.hardware_concurrency < 1 || fingerprint.hardware_concurrency > 128) {
      issues.push('Invalid hardware concurrency');
    }

    // Validate device memory
    if (fingerprint.device_memory < 2 || fingerprint.device_memory > 32) {
      issues.push('Invalid device memory');
    }

    // Validate locale
    if (!this.isValidLocale(fingerprint.locale)) {
      issues.push('Invalid locale');
    }

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, valid: true };
  }

  getRandomViewport() {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1536, height: 864 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 2560, height: 1440 },
      { width: 3840, height: 2160 },
    ];
    return viewports[Math.floor(Math.random() * viewports.length)];
  }

  getRandomTimezone() {
    const timezones = [
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Singapore',
      'Australia/Sydney',
    ];
    return timezones[Math.floor(Math.random() * timezones.length)];
  }

  getRandomLocale() {
    const locales = [
      'en-US',
      'en-GB',
      'en-CA',
      'en-AU',
      'de-DE',
      'fr-FR',
      'es-ES',
      'it-IT',
      'ja-JP',
      'zh-CN',
    ];
    return locales[Math.floor(Math.random() * locales.length)];
  }

  getRandomLanguage() {
    const languages = ['en', 'de', 'fr', 'es', 'it', 'ja', 'zh', 'ko', 'pt', 'ru'];
    return languages[Math.floor(Math.random() * languages.length)];
  }

  getRandomWebGLVendor() {
    const vendors = [
      'Intel Inc.',
      'NVIDIA Corporation',
      'AMD',
      'Qualcomm',
      'Apple Inc.',
    ];
    return vendors[Math.floor(Math.random() * vendors.length)];
  }

  getRandomWebGLRenderer() {
    const renderers = [
      'Intel Iris OpenGL Engine',
      'NVIDIA GeForce RTX 3080',
      'AMD Radeon RX 6800',
      'Qualcomm Adreno 650',
      'Apple M1 Pro',
    ];
    return renderers[Math.floor(Math.random() * renderers.length)];
  }

  getRandomFonts() {
    const allFonts = [
      'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Cambria', 'Cambria Math',
      'Comic Sans MS', 'Consolas', 'Courier', 'Courier New', 'Georgia', 'Helvetica',
      'Impact', 'Lucida Console', 'Microsoft Sans Serif', 'Palatino Linotype',
      'Segoe UI', 'Tahoma', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana',
    ];
    
    // Select random subset of fonts
    const numFonts = Math.floor(Math.random() * 15) + 10;
    const shuffled = allFonts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFonts);
  }

  getRandomHardwareConcurrency() {
    const options = [2, 4, 6, 8, 12, 16, 24, 32, 64];
    return options[Math.floor(Math.random() * options.length)];
  }

  getRandomDeviceMemory() {
    const options = [2, 4, 8, 16, 32];
    return options[Math.floor(Math.random() * options.length)];
  }

  getRandomPlatform() {
    const platforms = [
      'Win32',
      'Win64',
      'MacIntel',
      'MacARM',
      'Linux x86_64',
      'Linux armv7l',
    ];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }

  isValidTimezone(timezone) {
    try {
      Intl.DateTimeFormat.prototype.resolvedOptions().timeZone = timezone;
      return true;
    } catch (e) {
      return false;
    }
  }

  isValidLocale(locale) {
    try {
      Intl.NumberFormat(locale);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getFingerprintById(fingerprintId) {
    try {
      const fingerprint = this.database.db.prepare('SELECT * FROM fingerprints WHERE id = ?').get(fingerprintId);
      if (fingerprint) {
        return {
          ...fingerprint,
          fonts: JSON.parse(fingerprint.fonts),
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get fingerprint:', error);
      return null;
    }
  }

  async getAllFingerprints() {
    try {
      const fingerprints = this.database.db.prepare('SELECT * FROM fingerprints ORDER BY created_at DESC').all();
      return fingerprints.map(fp => ({
        ...fp,
        fonts: JSON.parse(fp.fonts),
      }));
    } catch (error) {
      console.error('Failed to get fingerprints:', error);
      return [];
    }
  }

  async createTemplate(templateData) {
    return await this.generateFingerprint({
      ...templateData,
      is_template: true,
    });
  }

  async getTemplates() {
    try {
      const templates = this.database.db.prepare('SELECT * FROM fingerprints WHERE is_template = 1 ORDER BY name ASC').all();
      return templates.map(fp => ({
        ...fp,
        fonts: JSON.parse(fp.fonts),
      }));
    } catch (error) {
      console.error('Failed to get templates:', error);
      return [];
    }
  }
}

module.exports = FingerprintEngine;
