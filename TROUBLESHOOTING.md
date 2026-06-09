# Troubleshooting Guide

## 🔍 Quick Debug Steps

### If setup.bat closes immediately:

1. **Use the debug version** - Run `setup_debug.bat` instead
   - This version captures ALL errors to a log file
   - Window will NOT close automatically
   - Shows detailed error messages

2. **Check the log files** - Run `view_logs.bat`
   - This will show you all available log files
   - Open the most recent log file to see detailed errors
   - Log files are in the `logs/` folder

3. **Manual troubleshooting** - Follow the steps below

## 📋 Log Files Explained

### Log File Location
All log files are stored in: `logs/` directory

### Log File Format
- `setup_YYYYMMDD_HHMMSS.log` - Setup script logs
- `setup_debug_YYYYMMDD_HHMMSS.log` - Debug setup logs
- `run_YYYYMMDD_HHMMSS.log` - Run script logs (when implemented)

### Log File Contents
Each log file contains:
- Timestamp
- Current directory
- User and computer name
- PATH environment variable
- Step-by-step progress
- Error messages with exit codes
- Command output

## 🛠️ Common Issues and Solutions

### Issue 1: "setup.bat closes immediately"

**Symptoms:**
- Double-click setup.bat
- Window opens and closes immediately
- No error message visible

**Solutions:**

1. **Run setup_debug.bat**
   - This debug version will not close automatically
   - All errors are logged to file
   - Shows detailed information

2. **Check log file**
   - Run `view_logs.bat`
   - Open the most recent log file
   - Look for ERROR messages

3. **Run from Command Prompt**
   - Open Command Prompt in project directory
   - Type: `setup.bat`
   - Error will remain visible

### Issue 2: "Node.js not found"

**Symptoms:**
- Error message: Node.js is not installed or not in PATH

**Solutions:**

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Install LTS version (recommended)
   - Restart your computer after installation

2. **Verify installation**
   - Open Command Prompt
   - Type: `node --version`
   - Should show version number (e.g., v18.x.x)

3. **Check PATH**
   - If Node.js is installed but not found:
   - Add Node.js to PATH manually
   - Default location: `C:\Program Files\nodejs`
   - Or reinstall Node.js with "Add to PATH" option

### Issue 3: "npm install fails"

**Symptoms:**
- npm install command fails
- Error during dependency installation

**Solutions:**

1. **Check internet connection**
   - Ensure you have stable internet
   - Try accessing: https://registry.npmjs.org

2. **Clear npm cache**
   ```cmd
   npm cache clean --force
   ```

3. **Try verbose install**
   ```cmd
   npm install --verbose
   ```

4. **Delete and reinstall**
   ```cmd
   rmdir /s /q node_modules
   npm install
   ```

5. **Use different registry**
   ```cmd
   npm install --registry=https://registry.npmjs.org
   ```

### Issue 4: "package.json not found"

**Symptoms:**
- Error: package.json not found in current directory

**Solutions:**

1. **Check current directory**
   - Make sure you're in the project root
   - Should see package.json in the folder

2. **Navigate to correct directory**
   ```cmd
   cd path\to\browser-v1
   ```

3. **Verify file exists**
   - Open File Explorer
   - Navigate to project folder
   - Confirm package.json exists

### Issue 5: "Port 3000 already in use"

**Symptoms:**
- Cannot start application
- Port conflict error

**Solutions:**

1. **Find process using port 3000**
   ```cmd
   netstat -ano | findstr :3000
   ```

2. **Kill the process**
   ```cmd
   taskkill /PID <PID> /F
   ```

3. **Or change port**
   - Edit `vite.config.js`
   - Change port number in server config

### Issue 6: "Permission denied"

**Symptoms:**
- Cannot create files or directories
- Access denied errors

**Solutions:**

1. **Run as Administrator**
   - Right-click batch file
   - Select "Run as administrator"

2. **Check folder permissions**
   - Right-click project folder
   - Properties > Security
   - Ensure you have write permissions

3. **Try different location**
   - Move project to user folder
   - Avoid Program Files or system directories

## 🔧 Advanced Debugging

### Manual npm install

If batch files fail completely:

1. Open Command Prompt in project directory
2. Run commands manually:
   ```cmd
   node --version
   npm --version
   npm install
   npm run dev
   ```

### Check system environment

Run these commands to check your environment:

```cmd
echo %PATH%
node --version
npm --version
npm config get registry
npm config list
```

### Network diagnostics

Check if you can reach npm:

```cmd
ping registry.npmjs.org
curl https://registry.npmjs.org
```

### Clean slate installation

Start completely fresh:

```cmd
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

## 📞 Getting Help

### Information to collect when asking for help:

1. **Log file** - Most recent log from `logs/` folder
2. **System info**:
   - Windows version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
3. **Error messages** - Exact text of error messages
4. **Steps taken** - What you tried before the error

### Where to get help:

1. **GitHub Issues** - https://github.com/renaernawati71-oss/browser-v1/issues
2. **Check logs** - Run `view_logs.bat` and share the log file
3. **Follow this guide** - Ensure you've tried all solutions above

## 📝 Quick Reference Commands

```cmd
# Check versions
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Clean install
rmdir /s /q node_modules
del package-lock.json
npm install

# Debug setup
setup_debug.bat

# View logs
view_logs.bat

# Run diagnostics
diagnose.bat

# Manual start
npm run dev

# Build
npm run build
```

## 🎯 Debug Workflow

1. **Problem occurs** → Run `setup_debug.bat`
2. **Check log** → Run `view_logs.bat`
3. **Identify error** → Read error message in log
4. **Find solution** → Check this guide
5. **Apply fix** → Follow solution steps
6. **Retry** → Run setup again
7. **Still stuck** → Collect info and ask for help

## ⚠️ Important Notes

- **Always check log files** - They contain detailed error information
- **Run debug version first** - setup_debug.bat is more informative
- **Node.js 18+ required** - Older versions won't work
- **Administrator rights** - May be needed for some operations
- **Internet connection** - Required for npm install
- **Antivirus** - May block scripts - add exceptions if needed

## 🔄 Reset and Start Over

If everything is completely broken:

1. Delete the project folder
2. Re-download/clone from GitHub
3. Follow installation guide from scratch
4. Use setup_debug.bat for first setup

This ensures a clean state without any corrupted files or settings.
