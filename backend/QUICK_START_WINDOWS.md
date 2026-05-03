# 🚀 AIRN Backend - Quick Start (Windows)

## 🎯 What to Do Right Now

### Option 1: Windows Batch Files (Easiest - Click & Run)

**Step 1: Install Dependencies**
- Navigate to: `c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend\`
- Double-click: **`install.bat`**
- Wait for it to finish ✓

**Step 2: Start Backend**
- In same folder
- Double-click: **`start.bat`**
- You should see: "🚀 AIRN Backend running on http://localhost:5000"

**Step 3: Test It**
- Open browser and visit: `http://localhost:5000/health`
- You should see: `{"status":"OK","message":"AIRN Backend is running"}`

---

### Option 2: PowerShell Scripts

**Step 1: Install**
```powershell
# Right-click install.ps1 → Run with PowerShell
# OR in PowerShell:
cd "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"
.\install.ps1
```

**Step 2: Start**
```powershell
.\start.ps1
```

---

### Option 3: Manual Terminal Commands

**Step 1: Open PowerShell**
- Press `Windows Key`
- Type: `PowerShell`
- Press `Enter`

**Step 2: Navigate to Backend**
```powershell
cd "c:\Users\Sivasish\OneDrive\Desktop\Airn2\backend"
```

**Step 3: Install**
```bash
npm install
```
Wait for "added XXX packages" message

**Step 4: Start**
```bash
npm run dev
```

You should see:
```
🚀 AIRN Backend running on http://localhost:5000
Environment: development
```

---

## ✅ Verify It Works

Open a new PowerShell window and run:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","message":"AIRN Backend is running"}
```

---

## 📊 What Gets Installed

When you run `npm install`, it downloads:
- Express.js - Web framework
- Supabase SDK - Database
- JWT - Authentication
- bcryptjs - Password hashing
- And 10+ other packages

Total size: ~200MB

---

## 🆘 Troubleshooting

### "command not found" or "not recognized"
**Fix:** Restart your computer, then try again

### Port 5000 already in use
**Fix:** 
1. Edit `.env` file
2. Change `PORT=5000` to `PORT=5001`
3. Start again

### Installation hangs
**Fix:**
1. Press `Ctrl+C` to stop
2. Delete `node_modules` folder
3. Run: `npm cache clean --force`
4. Run: `npm install` again

### "npm: command not found" in PowerShell
**Fix:**
1. Press `Windows Key + X`
2. Click "Windows PowerShell (Admin)"
3. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`
4. Close and reopen PowerShell

---

## 📂 Files in Backend Folder

After installation:

```
backend/
├── 📜 install.bat           ← Click to install
├── 📜 start.bat             ← Click to start
├── 📜 install.ps1           ← PowerShell install
├── 📜 start.ps1             ← PowerShell start
├── 📂 node_modules/         ← ALL PACKAGES (created)
├── 📜 package.json
├── 📜 .env
├── 📜 server.js
├── 📂 routes/
├── 📂 middleware/
├── 📂 utils/
└── 📚 docs/ (README, API_DOCS, etc)
```

---

## 🎯 Next Steps After Starting

Once your backend is running (`npm run dev`):

1. **Test endpoints** - Use Postman or curl
2. **Check API** - Visit `http://localhost:5000/health`
3. **Read docs** - Open `API_DOCS.md`
4. **Connect frontend** - Copy `FRONTEND_INTEGRATION.js`

---

## 💡 Pro Tips

- Keep terminal window open while developing (shows errors)
- Use `Ctrl+C` to stop the server
- Use `npm run dev` for development (auto-reloads)
- Use `npm start` for production

---

## 🚨 Still Having Issues?

1. Make sure you're in the backend folder
2. Check that `package.json` exists
3. Try deleting `node_modules` and reinstalling
4. Restart your computer
5. Check your internet connection

---

**Ready? Start with `install.bat`! 🚀**
