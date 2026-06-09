# QUICK START GUIDE - Step by Step

## 🚀 3 Cara Memulai (Pilih Salah Satu)

### CARA 1: Paling Sederhana (RECOMMENDED)

1. **Buka Command Prompt di folder project**
   - Buka File Explorer
   - Navigate ke: `C:\Users\basis\Documents\APP BUATAN\browser-v1-main`
   - Ketik `cmd` di address bar dan tekan Enter

2. **Test environment dulu**
   ```
   test_env.bat
   ```
   - Lihat apakah semua test OK
   - Jika ada FAIL, fix issue tersebut dulu

3. **Jika semua test OK, jalankan setup sederhana**
   ```
   setup_simple.bat
   ```

4. **Setelah setup selesai, jalankan aplikasi**
   ```
   run.bat
   ```

### CARA 2: Manual Install (Jika Batch Files Gagal)

1. **Buka Command Prompt di folder project**

2. **Test Node.js dan npm**
   ```
   node --version
   npm --version
   ```
   - Harus menampilkan versi (contoh: v18.x.x)
   - Jika error, install Node.js dari https://nodejs.org/

3. **Install dependencies manual**
   ```
   npm install
   ```
   - Tunggu sampai selesai (2-5 menit)
   - Jika error, coba: `npm cache clean --force` lalu ulang

4. **Buat .env file**
   ```
   copy .env.example .env
   ```

5. **Buat directories**
   ```
   mkdir profiles
   mkdir database  
   mkdir logs
   mkdir extensions
   mkdir backups
   ```

6. **Jalankan aplikasi**
   ```
   npm run dev
   ```

### CARA 3: Install Dependencies Saja

Jika directories sudah ada tapi npm install gagal:

1. **Buka Command Prompt di folder project**

2. **Jalankan install only**
   ```
   install_only.bat
   ```

3. **Lihat output error** jika ada

## 🔧 Cara Mengatasi Error Spesifik

### Error: "package.json not found"
**Solusi:**
- Pastikan berada di folder yang benar
- Folder harus berisi file package.json
- Buka File Explorer dan cek file tersebut

### Error: "Node.js not found"  
**Solusi:**
- Install Node.js dari https://nodejs.org/
- Pilih LTS version
- Restart komputer setelah install
- Cek dengan: `node --version`

### Error: "npm install fails"
**Solusi:**
```cmd
npm cache clean --force
npm install
```

Jika masih gagal:
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Error: "Port 3000 already in use"
**Solusi:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📋 Checklist Sebelum Mulai

Sebelum menjalankan setup, pastikan:

- [ ] Node.js v18+ sudah terinstall
- [ ] npm sudah terinstall
- [ ] Berada di folder project yang benar (ada package.json)
- [ ] Ada koneksi internet
- [ ] Punya akses write di folder tersebut

## 🎯 Workflow yang Direkomendasikan

### STEP 1: Test Environment
```
test_env.bat
```
Lihat apakah semua test OK. Jika ada FAIL, fix dulu.

### STEP 2: Setup Sederhana
```
setup_simple.bat  
```
Versi ini tanpa kompleksitas logging, lebih stabil.

### STEP 3: Jika Setup Gagal
```
install_only.bat
```
Cuma npm install saja untuk melihat error sebenarnya.

### STEP 4: Jalankan Aplikasi
```
run.bat
```
Atau manual:
```
npm run dev
```

## 🆘 Jika Masih Gagal

### Kumpulkan Informasi Ini:

1. **Output dari test_env.bat**
   - Apa saja yang FAIL
   - Error message lengkap

2. **Output dari install_only.bat** 
   - Error message dari npm install
   - Error code jika ada

3. **System Info:**
   ```
   node --version
   npm --version
   ```

4. **Directory:**
   - Pastikan di folder yang benar
   - Ada file package.json

### Cara Share Error yang Berguna:

**Format:**
```
Saya menjalankan: [nama script yang dijalankan]
Error yang muncul: [copy paste error message]
System info:
- Node.js: [versi]
- npm: [versi]
- Windows: [versi]
- Directory: [path lengkap]
```

## 💡 Tips

1. **Selalu gunakan Command Prompt** daripada double-click
   - Bisa lihat error lebih jelas
   - Window tidak akan close tiba-tiba

2. **Run sebagai Administrator** jika masih gagal
   - Right-click Command Prompt
   - "Run as administrator"

3. **Check internet** sebelum npm install
   - npm perlu download package dari internet

4. **Antivirus** mungkin blokir script
   - Tambah exception untuk folder project

5. **Pastikan cukup disk space**
   - Butuh ~500MB untuk node_modules

## 📞 Quick Commands Reference

```cmd
# Test environment
test_env.bat

# Setup sederhana  
setup_simple.bat

# Install only
install_only.bat

# Manual npm install
npm install

# Clear npm cache
npm cache clean --force

# Run application
npm run dev
# atau
run.bat

# Build
npm run build
```

## 🎯 Mulai dari Sini

**Langkah paling cepat:**

1. Buka Command Prompt di folder project
2. Jalankan: `test_env.bat`
3. Jika semua OK, jalankan: `setup_simple.bat`
4. Jalankan: `run.bat`

**Jika ada error di langkah manapun, share output error-nya dan saya akan bantu!**
