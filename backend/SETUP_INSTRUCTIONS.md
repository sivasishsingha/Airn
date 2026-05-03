# 🚀 Quick Setup Guide - AIRN Backend

## Step 1: Install Dependencies

### Option A: Run Batch File (Easiest)
1. Go to: `c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend\`
2. Double-click **`install.bat`**
3. Wait for installation to complete
4. Press any key when done

### Option B: Use Command Line
```bash
cd c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend
npm install
```

**Time:** 2-5 minutes (first time only)

---

## Step 2: Start the Backend Server

### Option A: Run Batch File (Easiest)
1. In the backend folder
2. Double-click **`start.bat`**
3. You should see:
```
================================
 AIRN Backend Server
================================

Starting backend on port 5000...
URL: http://localhost:5000

Press Ctrl+C to stop the server
```

### Option B: Use Command Line
```bash
cd c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend
npm run dev
```

---

## Step 3: Test the Backend

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

You should get:
```json
{"status":"OK","message":"AIRN Backend is running"}
```

---

## 📁 Files Created for You

- **`install.bat`** - Click this to install dependencies
- **`start.bat`** - Click this to start your backend
- **`SETUP_INSTRUCTIONS.md`** - This file

---

## ⚠️ Common Issues

### Issue: "npm: command not found"
**Solution:** 
1. Restart your computer
2. Open PowerShell as Administrator
3. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`

### Issue: Port 5000 already in use
**Solution:**
1. Change PORT in `.env` file
2. Or close other applications using port 5000

### Issue: Installation hangs
**Solution:**
1. Press Ctrl+C to stop
2. Delete `node_modules` folder
3. Run `npm cache clean --force`
4. Run `npm install` again

---

## ✅ What's Next

After your backend is running:

1. **Test API endpoints** using Postman or curl
2. **Integrate with frontend** - Copy `FRONTEND_INTEGRATION.js` to your frontend
3. **Read documentation** - Check `API_DOCS.md` for all endpoints
4. **Deploy** - Push to GitHub and deploy to Vercel/Heroku

---

## 📞 Helpful Commands

```bash
# Check if npm is installed
npm --version

# Check if node is installed
node --version

# Install a new package
npm install package-name

# Update all packages
npm update

# View installed packages
npm list

# Clear npm cache
npm cache clean --force

# Stop the server
Ctrl + C
```

---

## 🎯 Your Backend Files

```
backend/
├── install.bat              ← Double-click to install
├── start.bat                ← Double-click to start
├── package.json             ← Dependencies list
├── server.js                ← Main app
├── .env                     ← Your configuration
├── node_modules/            ← Installed packages (created after npm install)
├── routes/                  ← API endpoints
├── middleware/              ← Authentication
├── utils/                   ← Helpers
└── ... other files
```

---

**Happy coding! 🚀**
