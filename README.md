# Multi Browser Workspace Platform

A professional, enterprise-grade desktop application for managing hundreds of browser profiles and accounts efficiently. Built with Electron, React, and Node.js.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

## 🚀 Features

### Core Functionality
- **Profile Management**: Create, clone, and manage hundreds of browser profiles
- **Session Isolation**: Complete cookie, cache, and local storage separation
- **Proxy Support**: HTTP, HTTPS, and SOCKS5 proxy management with testing
- **Fingerprint Engine**: Advanced browser fingerprinting for profile uniqueness
- **Batch Operations**: Launch multiple profiles simultaneously with staggered delays
- **Resource Optimization**: Smart resource management for stability at scale

### Advanced Features
- **Workspace Organization**: Group profiles into logical workspaces
- **Extension Management**: Install and manage browser extensions per profile
- **Smart Launch Engine**: Queue-based launching with resource awareness
- **Health Monitoring**: Profile health checks and auto-recovery
- **Session Snapshots**: Backup and restore profile sessions
- **Diagnostics**: Comprehensive system health monitoring

### Platform Support
- Facebook
- YouTube
- TikTok
- Instagram
- Twitter/X
- Gmail
- Marketplace platforms
- Custom web applications

## 📋 Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Operating System**: Windows 10/11
- **RAM**: 8GB minimum (16GB recommended for 50+ profiles)
- **Storage**: 500MB for application + additional space for profiles

## 🛠️ Installation

### Windows Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/renaernawati71-oss/browser-v1.git
   cd browser-v1
   ```

2. **Run the setup script**:
   ```bash
   setup.bat
   ```

   This will automatically:
   - Check Node.js and npm installation
   - Install all dependencies
   - Create .env configuration file

3. **Configure environment variables** (optional):
   Edit the `.env` file to customize settings:
   ```env
   MAX_CONCURRENT_BROWSERS=50
   MAX_RAM_USAGE_GB=16
   MAX_CPU_USAGE_PERCENT=80
   ```

### Manual Installation

If the setup script fails, install manually:

```bash
# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your settings
notepad .env
```

## 🎯 Usage

### Development Mode

Start the application in development mode:

```bash
# Windows
run.bat

# Or manually
npm run dev
```

This starts both the React development server and Electron app.

### Production Build

Build the application for distribution:

```bash
# Windows
build.bat

# Or manually
npm run build
```

The built application will be in the `dist` folder.

### Running the Built App

After building, you can find the installer in:
- `dist/` folder (portable executable)
- `dist/installers/` (NSIS installer)

## 📖 Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Application Settings
APP_NAME=Multi Browser Workspace Platform
APP_ENV=development

# Browser Settings
DEFAULT_BROWSER_ENGINE=chromium
MAX_CONCURRENT_BROWSERS=50
BROWSER_TIMEOUT=30000

# Resource Limits
MAX_RAM_USAGE_GB=16
MAX_CPU_USAGE_PERCENT=80

# Security
APP_PIN_ENABLED=true
SESSION_TIMEOUT=3600000

# Backup Settings
BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=24
BACKUP_RETENTION_DAYS=7
```

### Profile Configuration

Each profile supports:
- **User Data Directory**: Isolated storage for cookies, cache, etc.
- **Proxy Configuration**: HTTP/HTTPS/SOCKS5 support
- **User Agent**: Custom or randomized browser signatures
- **Fingerprint**: Complete browser fingerprinting
- **Extensions**: Per-profile extension management
- **Window Settings**: Size, position, and startup behavior

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18, TailwindCSS, Zustand, React Query
- **Backend**: Electron, Node.js
- **Browser Automation**: Playwright
- **Database**: SQLite with better-sqlite3
- **Task Queue**: BullMQ with Redis
- **Security**: IPC encryption, sandboxed processes

### Project Structure

```
browser-v1/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.js         # Entry point
│   │   ├── preload.js       # Preload script
│   │   ├── database/        # SQLite database
│   │   ├── services/        # Core services
│   │   ├── fingerprint/     # Fingerprint engine
│   │   ├── proxy/          # Proxy manager
│   │   ├── launcher/       # Browser launcher
│   │   └── extensions/     # Extension manager
│   └── renderer/           # React frontend
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── store/       # State management
│       │   └── utils/       # Utilities
│       └── index.html
├── profiles/               # Browser profile storage
├── database/              # SQLite database files
├── logs/                   # Application logs
├── extensions/             # Extension files
├── backups/               # Profile backups
├── setup.bat              # Windows setup script
├── run.bat                # Windows run script
├── build.bat              # Windows build script
└── package.json
```

## 🔧 Modules

### Dashboard
- System resource monitoring
- Active browser count
- Profile statistics
- Quick actions

### Profile Manager
- Create/edit/delete profiles
- Clone profiles with options
- Profile health monitoring
- Batch operations

### Proxy Manager
- Add/test proxies
- Import bulk proxies
- Auto-assignment to profiles
- Geo-detection

### Fingerprint Manager
- Generate realistic fingerprints
- Fingerprint templates
- Validation and testing
- Custom fingerprint creation

### Workspace Manager
- Organize profiles into groups
- Workspace-level settings
- Batch operations by workspace

### Extension Manager
- Install CRX/ZIP extensions
- Per-profile assignment
- Extension updates
- Batch installation

### Batch Manager
- Launch multiple profiles
- Batch URL opening
- Staggered launching
- Queue management

### Diagnostics
- System health checks
- Browser crash detection
- Proxy leak detection
- Performance analysis

## 🛡️ Security

- **Encrypted Storage**: SQLite database encryption
- **Secure IPC**: Encrypted inter-process communication
- **Sandboxing**: Sandboxed browser processes
- **App Lock**: Optional PIN protection
- **Credential Vault**: Secure credential storage

## 📊 Performance

### Scalability
- **100-500+ profiles**: Optimized for large-scale operations
- **Low resource usage**: Efficient memory management
- **Smart queuing**: Adaptive concurrency control
- **Resource awareness**: CPU/RAM monitoring

### Optimization
- Browser pooling for reduced memory
- Lazy loading of profiles
- Efficient database indexing
- Optimized fingerprint injection

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
- Ensure Node.js is installed (v18+)
- Run `setup.bat` to reinstall dependencies
- Check `.env` file configuration

**Profiles won't launch**
- Check system resources (RAM/CPU)
- Verify proxy configuration
- Review logs in the Logs section

**High memory usage**
- Reduce MAX_CONCURRENT_BROWSERS in `.env`
- Enable browser suspension
- Close unused profiles

**Database errors**
- Ensure `database/` directory exists
- Check file permissions
- Restore from backup if needed

### Getting Logs

Application logs are stored in:
- `logs/` directory
- Dashboard > Logs page
- Diagnostic Center

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Browser automation powered by [Playwright](https://playwright.dev/)
- UI styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/renaernawati71-oss/browser-v1/issues)
- Documentation: [Full Docs](https://github.com/renaernawati71-oss/browser-v1/wiki)

## 🔮 Roadmap

### Version 1.1 (Planned)
- [ ] Mac and Linux support
- [ ] Cloud sync for profiles
- [ ] Advanced automation rules
- [ ] Plugin system
- [ ] Performance improvements

### Version 2.0 (Future)
- [ ] Team collaboration features
- [ ] API for external integration
- [ ] Mobile app companion
- [ ] AI-powered optimization
- [ ] Enterprise SSO integration

---

**Made with ❤️ by Rena Ernawati**

*Enterprise Multi Browser Workspace Platform - Professional browser profile management*
