# Installation Guide - Windows

## 🚀 Quick Start Installation

### Prerequisites
- **Windows 10 or 11**
- **Node.js v18.0.0 or higher**
- **npm v9.0.0 or higher**
- **Internet connection** (for downloading dependencies)

### Step-by-Step Installation

#### 1. Install Node.js
1. Download Node.js from: https://nodejs.org/
2. Download the **LTS version** (recommended for stability)
3. Run the installer with default settings
4. **Restart your computer** after installation
5. Verify installation by opening Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

#### 2. Download or Clone the Project

**Option A: Download ZIP**
1. Go to: https://github.com/renaernawati71-oss/browser-v1
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder (e.g., `C:\browser-workspace`)

**Option B: Git Clone**
1. Install Git from: https://git-scm.com/download/win
2. Open Command Prompt
3. Navigate to your desired folder:
   ```cmd
   cd C:\Users\YourName\Documents
   ```
4. Clone the repository:
   ```cmd
   git clone https://github.com/renaernawati71-oss/browser-v1.git
   cd browser-v1
   ```

#### 3. Run Setup Script

**IMPORTANT:** Make sure you're in the project directory before running setup!

1. **Open Command Prompt** in the project folder:
   - Navigate to the folder in File Explorer
   - Type `cmd` in the address bar and press Enter
   - OR right-click in the folder and select "Open in Terminal"

2. **Double-click `setup.bat`** OR run from command line:
   ```cmd
   setup.bat
   ```

3. **Follow the prompts:**
   - The script will check for Node.js
   - Install dependencies (this takes 2-5 minutes)
   - Create configuration files
   - Create required directories

4. **If setup fails:**
   - Run `diagnose.bat` to check for issues
   - Make sure you're in the correct directory
   - Check Node.js installation
   - Try manual installation (see below)

#### 4. Run the Application

1. **Double-click `run.bat`** OR run from command line:
   ```cmd
   run.bat
   ```

2. The application window will open automatically
3. Keep the Command Prompt window open while using the app

#### 5. Troubleshooting

**Problem: setup.bat closes immediately**
- Run `diagnose.bat` to identify the issue
- Make sure you're in the correct directory (should contain package.json)
- Check if Node.js is properly installed
- Try running from Command Prompt instead of double-clicking

**Problem: "Node.js not found"**
- Install Node.js from https://nodejs.org/
- Restart Command Prompt after installation
- Verify with `node --version`

**Problem: npm install fails**
- Check internet connection
- Try: `npm cache clean --force`
- Try: `npm install --verbose`
- Delete node_modules folder and try again

**Problem: Port 3000 already in use**
- Close other applications using port 3000
- Or change the port in vite.config.js

## 🔧 Manual Installation

If batch files don't work, try manual installation:

1. **Open Command Prompt** in project directory
2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Create .env file:**
   ```cmd
   copy .env.example .env
   ```

4. **Create directories:**
   ```cmd
   mkdir profiles
   mkdir database
   mkdir logs
   mkdir extensions
   mkdir backups
   ```

5. **Run application:**
   ```cmd
   npm run dev
   ```

## 📝 Configuration

Edit the `.env` file to customize settings:

```env
# Application
APP_NAME=Multi Browser Workspace Platform
APP_ENV=development

# Browser Settings
MAX_CONCURRENT_BROWSERS=50
BROWSER_TIMEOUT=30000

# Resource Limits
MAX_RAM_USAGE_GB=16
MAX_CPU_USAGE_PERCENT=80

# Backup
BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=24
```

## 🏗️ Building for Production

To create a distributable executable:

1. **Run build script:**
   ```cmd
   build.bat
   ```

2. **Find the output:**
   - Check the `dist` folder
   - Look for `.exe` installer or portable executable

## 🆘 Getting Help

If you encounter issues:

1. **Run diagnostics:**
   ```cmd
   diagnose.bat
   ```

2. **Check the logs:**
   - Look in the `logs` folder
   - Check Command Prompt output

3. **Common fixes:**
   - Restart Command Prompt after Node.js installation
   - Make sure you're in the correct directory
   - Delete node_modules and reinstall
   - Check Windows Defender isn't blocking the script

4. **Get support:**
   - GitHub Issues: https://github.com/renaernawati71-oss/browser-v1/issues
   - Check the main README.md for more information

## ⚠️ Important Notes

- **Always run from project directory** containing package.json
- **Keep Command Prompt open** while using the application
- **Node.js 18+ is required** - older versions won't work
- **Windows 10/11 only** - not tested on older versions
- **Administrator rights** may be required for first-time setup

## 🎯 Quick Reference Commands

```cmd
# Check Node.js installation
node --version
npm --version

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Clean install
rmdir /s /q node_modules
npm install

# Clear npm cache
npm cache clean --force
```

## 📞 Additional Resources

- Node.js: https://nodejs.org/
- npm Documentation: https://docs.npmjs.com/
- Git: https://git-scm.com/
- Project Repository: https://github.com/renaernawati71-oss/browser-v1
