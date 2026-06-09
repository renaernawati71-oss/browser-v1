const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

class ProfileManager {
  constructor(database) {
    this.database = database;
    this.profilesPath = path.join(process.env.HOME || process.env.USERPROFILE, '.browser-workspace', 'profiles');
    this.ensureProfilesDirectory();
  }

  ensureProfilesDirectory() {
    if (!fs.existsSync(this.profilesPath)) {
      fs.mkdirSync(this.profilesPath, { recursive: true });
    }
  }

  async createProfile(profileData) {
    const profileId = crypto.randomUUID();
    const userDataDir = path.join(this.profilesPath, profileId);

    // Create user data directory
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    const profile = {
      id: profileId,
      name: profileData.name || `Profile ${profileId.slice(0, 8)}`,
      workspace_id: profileData.workspace_id || null,
      notes: profileData.notes || '',
      tags: profileData.tags ? JSON.stringify(profileData.tags) : '[]',
      browser_engine: profileData.browser_engine || 'chromium',
      startup_url: profileData.startup_url || 'https://google.com',
      batch_url_list: profileData.batch_url_list ? JSON.stringify(profileData.batch_url_list) : '[]',
      proxy_id: profileData.proxy_id || null,
      user_agent_id: profileData.user_agent_id || null,
      fingerprint_id: profileData.fingerprint_id || null,
      extension_list: profileData.extension_list ? JSON.stringify(profileData.extension_list) : '[]',
      window_width: profileData.window_width || 1280,
      window_height: profileData.window_height || 720,
      window_position_x: profileData.window_position_x || 0,
      window_position_y: profileData.window_position_y || 0,
      user_data_dir: userDataDir,
      status: 'stopped',
      health_status: 'healthy',
    };

    try {
      this.database.queries.profile.insert.run(
        profile.id,
        profile.name,
        profile.workspace_id,
        profile.notes,
        profile.tags,
        profile.browser_engine,
        profile.startup_url,
        profile.batch_url_list,
        profile.proxy_id,
        profile.user_agent_id,
        profile.fingerprint_id,
        profile.extension_list,
        profile.window_width,
        profile.window_height,
        profile.window_position_x,
        profile.window_position_y,
        profile.user_data_dir
      );

      // Log the creation
      this.logProfileAction(profileId, 'create', 'Profile created successfully');

      return { success: true, profile: await this.getProfileById(profileId) };
    } catch (error) {
      console.error('Failed to create profile:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(profileId, profileData) {
    try {
      const existingProfile = await this.getProfileById(profileId);
      if (!existingProfile) {
        return { success: false, error: 'Profile not found' };
      }

      this.database.queries.profile.update.run(
        profileData.name || existingProfile.name,
        profileData.workspace_id !== undefined ? profileData.workspace_id : existingProfile.workspace_id,
        profileData.notes !== undefined ? profileData.notes : existingProfile.notes,
        profileData.tags !== undefined ? JSON.stringify(profileData.tags) : existingProfile.tags,
        profileData.browser_engine || existingProfile.browser_engine,
        profileData.startup_url !== undefined ? profileData.startup_url : existingProfile.startup_url,
        profileData.batch_url_list !== undefined ? JSON.stringify(profileData.batch_url_list) : existingProfile.batch_url_list,
        profileData.proxy_id !== undefined ? profileData.proxy_id : existingProfile.proxy_id,
        profileData.user_agent_id !== undefined ? profileData.user_agent_id : existingProfile.user_agent_id,
        profileData.fingerprint_id !== undefined ? profileData.fingerprint_id : existingProfile.fingerprint_id,
        profileData.extension_list !== undefined ? JSON.stringify(profileData.extension_list) : existingProfile.extension_list,
        profileData.window_width || existingProfile.window_width,
        profileData.window_height || existingProfile.window_height,
        profileData.window_position_x !== undefined ? profileData.window_position_x : existingProfile.window_position_x,
        profileData.window_position_y !== undefined ? profileData.window_position_y : existingProfile.window_position_y,
        profileId
      );

      this.logProfileAction(profileId, 'update', 'Profile updated successfully');

      return { success: true, profile: await this.getProfileById(profileId) };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProfile(profileId) {
    try {
      const profile = await this.getProfileById(profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      // Stop profile if running
      if (profile.status === 'running') {
        // TODO: Stop the browser
      }

      // Delete from database
      this.database.queries.profile.delete.run(profileId);

      // Delete user data directory
      if (profile.user_data_dir && fs.existsSync(profile.user_data_dir)) {
        fs.rmSync(profile.user_data_dir, { recursive: true, force: true });
      }

      this.logProfileAction(profileId, 'delete', 'Profile deleted successfully');

      return { success: true };
    } catch (error) {
      console.error('Failed to delete profile:', error);
      return { success: false, error: error.message };
    }
  }

  async getProfileById(profileId) {
    try {
      const profile = this.database.queries.profile.getById.get(profileId);
      if (profile) {
        return this.parseProfile(profile);
      }
      return null;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  async getAllProfiles() {
    try {
      const profiles = this.database.queries.profile.getAll.all();
      return profiles.map(profile => this.parseProfile(profile));
    } catch (error) {
      console.error('Failed to get profiles:', error);
      return [];
    }
  }

  async cloneProfile(profileId, cloneOptions = {}) {
    try {
      const sourceProfile = await this.getProfileById(profileId);
      if (!sourceProfile) {
        return { success: false, error: 'Source profile not found' };
      }

      const newProfileData = {
        name: cloneOptions.name || `${sourceProfile.name} (Clone)`,
        workspace_id: cloneOptions.workspace_id || sourceProfile.workspace_id,
        notes: cloneOptions.notes || sourceProfile.notes,
        tags: cloneOptions.tags || sourceProfile.tags,
        browser_engine: sourceProfile.browser_engine,
        startup_url: sourceProfile.startup_url,
        batch_url_list: sourceProfile.batch_url_list,
        proxy_id: sourceProfile.proxy_id,
        user_agent_id: sourceProfile.user_agent_id,
        fingerprint_id: sourceProfile.fingerprint_id,
        extension_list: sourceProfile.extension_list,
        window_width: sourceProfile.window_width,
        window_height: sourceProfile.window_height,
        window_position_x: sourceProfile.window_position_x + 50,
        window_position_y: sourceProfile.window_position_y + 50,
      };

      const result = await this.createProfile(newProfileData);

      if (result.success && cloneOptions.cloneCookies) {
        // Clone cookies if requested
        await this.cloneCookies(profileId, result.profile.id);
      }

      return result;
    } catch (error) {
      console.error('Failed to clone profile:', error);
      return { success: false, error: error.message };
    }
  }

  async cloneCookies(sourceProfileId, targetProfileId) {
    try {
      const sourceProfile = await this.getProfileById(sourceProfileId);
      const targetProfile = await this.getProfileById(targetProfileId);

      if (!sourceProfile || !targetProfile) {
        return { success: false, error: 'Profile not found' };
      }

      const sourceCookiesPath = path.join(sourceProfile.user_data_dir, 'Default', 'Cookies');
      const targetCookiesPath = path.join(targetProfile.user_data_dir, 'Default', 'Cookies');

      if (fs.existsSync(sourceCookiesPath)) {
        fs.copyFileSync(sourceCookiesPath, targetCookiesPath);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to clone cookies:', error);
      return { success: false, error: error.message };
    }
  }

  parseProfile(profile) {
    return {
      ...profile,
      tags: JSON.parse(profile.tags || '[]'),
      batch_url_list: JSON.parse(profile.batch_url_list || '[]'),
      extension_list: JSON.parse(profile.extension_list || '[]'),
    };
  }

  logProfileAction(profileId, action, message) {
    const logId = crypto.randomUUID();
    this.database.queries.log.insert.run(
      logId,
      'info',
      'profile_manager',
      `${action.toUpperCase()}: ${message}`,
      JSON.stringify({ profileId, action })
    );
  }

  async healthCheck(profileId) {
    try {
      const profile = await this.getProfileById(profileId);
      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      const healthIssues = [];

      // Check user data directory
      if (!fs.existsSync(profile.user_data_dir)) {
        healthIssues.push('User data directory missing');
      }

      // Check profile status
      if (profile.status === 'crashed') {
        healthIssues.push('Profile in crashed state');
      }

      // Check for corrupted data
      if (healthIssues.length === 0) {
        await this.updateProfile(profileId, { health_status: 'healthy' });
        return { success: true, healthy: true, issues: [] };
      } else {
        await this.updateProfile(profileId, { health_status: 'unhealthy' });
        return { success: true, healthy: false, issues: healthIssues };
      }
    } catch (error) {
      console.error('Failed to check profile health:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = ProfileManager;
