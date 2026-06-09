const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class DatabaseManager {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(process.env.HOME || process.env.USERPROFILE, '.browser-workspace', 'app.sqlite');
    this.db = null;
    this.queries = {};
  }

  async initialize() {
    // Ensure database directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database connection
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    // Create tables
    this.createTables();

    // Prepare queries
    this.prepareQueries();

    console.log('Database initialized successfully');
  }

  createTables() {
    // Workspaces table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT DEFAULT '#3b82f6',
        icon TEXT DEFAULT 'folder',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Proxies table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS proxies (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('http', 'https', 'socks5')),
        host TEXT NOT NULL,
        port INTEGER NOT NULL,
        username TEXT,
        password TEXT,
        country TEXT,
        city TEXT,
        is_active BOOLEAN DEFAULT 1,
        last_tested DATETIME,
        test_result TEXT,
        latency INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User Agents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_agents (
        id TEXT PRIMARY KEY,
        string TEXT NOT NULL UNIQUE,
        browser_type TEXT,
        os_type TEXT,
        device_type TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fingerprints table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fingerprints (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_agent_id TEXT,
        viewport_width INTEGER,
        viewport_height INTEGER,
        timezone TEXT,
        locale TEXT,
        language TEXT,
        webbrtc_mode TEXT DEFAULT 'default',
        canvas_mode TEXT DEFAULT 'noise',
        webgl_vendor TEXT,
        webgl_renderer TEXT,
        fonts TEXT,
        hardware_concurrency INTEGER,
        device_memory INTEGER,
        platform TEXT,
        is_template BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_agent_id) REFERENCES user_agents(id)
      )
    `);

    // Extensions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS extensions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT,
        path TEXT,
        type TEXT CHECK(type IN ('crx', 'zip', 'unpackaged')),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Profiles table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        workspace_id TEXT,
        notes TEXT,
        tags TEXT,
        browser_engine TEXT DEFAULT 'chromium',
        startup_url TEXT,
        batch_url_list TEXT,
        proxy_id TEXT,
        user_agent_id TEXT,
        fingerprint_id TEXT,
        extension_list TEXT,
        window_width INTEGER DEFAULT 1280,
        window_height INTEGER DEFAULT 720,
        window_position_x INTEGER DEFAULT 0,
        window_position_y INTEGER DEFAULT 0,
        last_login DATETIME,
        last_ip TEXT,
        status TEXT DEFAULT 'stopped',
        health_status TEXT DEFAULT 'healthy',
        user_data_dir TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
        FOREIGN KEY (proxy_id) REFERENCES proxies(id),
        FOREIGN KEY (user_agent_id) REFERENCES user_agents(id),
        FOREIGN KEY (fingerprint_id) REFERENCES fingerprints(id)
      )
    `);

    // Sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        duration_seconds INTEGER,
        success BOOLEAN,
        error_message TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id)
      )
    `);

    // Logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        level TEXT NOT NULL CHECK(level IN ('debug', 'info', 'warn', 'error')),
        source TEXT NOT NULL,
        message TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Backup snapshots table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS snapshots (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        snapshot_path TEXT NOT NULL,
        size_bytes INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id)
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_profiles_workspace ON profiles(workspace_id);
      CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
      CREATE INDEX IF NOT EXISTS idx_profiles_proxy ON profiles(proxy_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_profile ON sessions(profile_id);
      CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
      CREATE INDEX IF NOT EXISTS idx_logs_source ON logs(source);
      CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at);
    `);

    // Insert default settings
    this.insertDefaultSettings();
  }

  insertDefaultSettings() {
    const defaultSettings = [
      { key: 'max_concurrent_browsers', value: '50' },
      { key: 'browser_timeout', value: '30000' },
      { key: 'auto_backup_enabled', value: 'true' },
      { key: 'backup_interval_hours', value: '24' },
      { key: 'log_retention_days', value: '30' },
      { key: 'theme_mode', value: 'dark' },
      { key: 'language', value: 'en' },
      { key: 'startup_behavior', value: 'restore_last' },
    ];

    const insertSetting = this.db.prepare(`
      INSERT OR IGNORE INTO settings (key, value)
      VALUES (@key, @value)
    `);

    const insertMany = this.db.transaction((settings) => {
      for (const setting of settings) {
        insertSetting.run(setting);
      }
    });

    insertMany(defaultSettings);
  }

  prepareQueries() {
    // Profile queries
    this.queries.profile.insert = this.db.prepare(`
      INSERT INTO profiles (id, name, workspace_id, notes, tags, browser_engine, startup_url, batch_url_list, proxy_id, user_agent_id, fingerprint_id, extension_list, window_width, window_height, window_position_x, window_position_y, user_data_dir)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.queries.profile.update = this.db.prepare(`
      UPDATE profiles
      SET name = ?, workspace_id = ?, notes = ?, tags = ?, browser_engine = ?, startup_url = ?, batch_url_list = ?, proxy_id = ?, user_agent_id = ?, fingerprint_id = ?, extension_list = ?, window_width = ?, window_height = ?, window_position_x = ?, window_position_y = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    this.queries.profile.delete = this.db.prepare(`
      DELETE FROM profiles WHERE id = ?
    `);

    this.queries.profile.getById = this.db.prepare(`
      SELECT * FROM profiles WHERE id = ?
    `);

    this.queries.profile.getAll = this.db.prepare(`
      SELECT p.*, 
             w.name as workspace_name,
             pr.host as proxy_host,
             pr.port as proxy_port,
             ua.string as user_agent_string,
             f.name as fingerprint_name
      FROM profiles p
      LEFT JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN proxies pr ON p.proxy_id = pr.id
      LEFT JOIN user_agents ua ON p.user_agent_id = ua.id
      LEFT JOIN fingerprints f ON p.fingerprint_id = f.id
      ORDER BY p.created_at DESC
    `);

    // Proxy queries
    this.queries.proxy.insert = this.db.prepare(`
      INSERT INTO proxies (id, type, host, port, username, password, country, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.queries.proxy.update = this.db.prepare(`
      UPDATE proxies
      SET type = ?, host = ?, port = ?, username = ?, password = ?, country = ?, city = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    this.queries.proxy.getAll = this.db.prepare(`
      SELECT * FROM proxies ORDER BY created_at DESC
    `);

    // Workspace queries
    this.queries.workspace.insert = this.db.prepare(`
      INSERT INTO workspaces (id, name, description, color, icon)
      VALUES (?, ?, ?, ?, ?)
    `);

    this.queries.workspace.getAll = this.db.prepare(`
      SELECT w.*, COUNT(p.id) as profile_count
      FROM workspaces w
      LEFT JOIN profiles p ON w.id = p.workspace_id
      GROUP BY w.id
      ORDER BY w.name ASC
    `);

    // Settings queries
    this.queries.settings.get = this.db.prepare(`
      SELECT * FROM settings
    `);

    this.queries.settings.upsert = this.db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);

    // Log queries
    this.queries.log.insert = this.db.prepare(`
      INSERT INTO logs (id, level, source, message, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);

    this.queries.log.getRecent = this.db.prepare(`
      SELECT * FROM logs
      ORDER BY created_at DESC
      LIMIT ?
    `);
  }

  // Helper method to generate UUID
  generateId() {
    return crypto.randomUUID();
  }

  // Close database connection
  async close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
    }
  }
}

module.exports = DatabaseManager;
