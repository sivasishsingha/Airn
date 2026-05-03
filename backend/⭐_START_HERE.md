# 🚀 AIRN Backend - SUPER EASY Setup

## ⚡ Two-Step Installation

### Step 1️⃣ - Install Dependencies
1. Find and double-click: **`INSTALL_NOW.bat`**
2. Wait for "✓ Installation Complete!" message (takes 3-5 minutes)
3. Close the window when it says to

### Step 2️⃣ - Start Backend Server  
1. Find and double-click: **`START_SERVER.bat`**
2. Wait for "AIRN Backend running on http://localhost:5000"
3. Leave this window open while you work

---

## ✅ Verify It Works

Open your web browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{"status":"OK","message":"AIRN Backend is running"}
```

If you see this, **you're all set!** ✓

---

## 📁 File Locations

| File | Purpose | Action |
|------|---------|--------|
| `INSTALL_NOW.bat` | Install dependencies | Double-click |
| `START_SERVER.bat` | Start backend | Double-click |
| `server.js` | Backend application | Don't touch |
| `package.json` | Dependencies list | Don't touch |
| `.env` | Configuration | Keep secret |

---

## ⚠️ If Something Goes Wrong

### Error: "npm not found"
- Restart your computer
- Then try again

### Error: "node_modules not found"
- Run `INSTALL_NOW.bat` first
- Then run `START_SERVER.bat`

### Port 5000 already in use
- Edit `.env` file
- Change: `PORT=5000` to `PORT=5001`
- Restart server

### Can't find these .bat files?
- Open File Explorer
- Navigate to: `Desktop → Airn2 → backend`
- You'll see the .bat files there

---

## 🎯 Common Commands (if you prefer terminal)

```powershell
# Go to backend folder
cd "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check if server is running
curl http://localhost:5000/health
```

---

## 🎉 You're Ready!

**That's it!** Your backend is now ready to:
- Accept API requests
- Connect to Supabase database
- Handle user authentication
- Serve your frontend

---

## 📞 Next Steps

1. ✅ Run `INSTALL_NOW.bat`
2. ✅ Run `START_SERVER.bat`
3. ✅ Verify at `http://localhost:5000/health`
4. 📍 Then connect your frontend to the API

**Everything else is already set up for you!**
