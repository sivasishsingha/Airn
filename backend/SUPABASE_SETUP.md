# SUPABASE SETUP INSTRUCTIONS

This guide walks through setting up your Supabase database for the AIRN backend.

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Complete verification

## Step 2: Create New Project

1. In Supabase dashboard, click "New Project"
2. Fill in:
   - **Name**: `airn-backend` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
3. Click "Create new project"
4. Wait 2-5 minutes for project to initialize

## Step 3: Get Your API Credentials

1. Once project is created, go to **Settings** → **API**
2. Under **Project API keys**, you'll see:
   - **Project URL**: Copy this → `SUPABASE_URL`
   - **anon public**: Copy this → `SUPABASE_KEY`
   - **service_role**: Keep private for backend-only operations

Example credentials look like:
```
Project URL: https://abc123def456.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents from `schema.sql` file
4. Paste into the SQL editor
5. Click **Run** button
6. You should see: "Execution successful"

### Verify Tables Created

1. Go to **Table Editor**
2. You should see these tables:
   - `users`
   - `inventions`
   - `reviews`
   - `community_posts`
   - `transactions`

If tables don't appear, click refresh or try running schema.sql again.

## Step 5: Add Environment Variables to Backend

1. Create `.env` file in `/backend` folder:

```env
# Supabase Configuration
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=the_password_you_created

# JWT Configuration
JWT_SECRET=your-super-secret-key-12345

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

2. Save the file as `.env` (not `.env.example`)

## Step 6: Enable Additional Features (Optional)

### Enable Real-time Subscriptions
1. Go to **Settings** → **Realtime**
2. Enable for tables you want real-time updates:
   - `inventions`
   - `community_posts`
   - `reviews`

### Configure Authentication (Optional)
1. Go to **Authentication** → **Providers**
2. For Google OAuth:
   - Enable Google provider
   - Add your Google credentials from Google Cloud Console
3. For email authentication:
   - Already enabled by default

### Enable Storage (Optional - for image uploads)
1. Go to **Storage**
2. Create new bucket: `inventions` (make it public)
3. Bucket policies will allow uploads

## Step 7: Test Connection

Run this command in your backend folder:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
supabase.from('users').select('count').then(r => console.log(r));
"
```

Or just start the backend and check the logs:
```bash
npm run dev
```

## Step 8: Start Backend

```bash
npm install
npm run dev
```

You should see:
```
🚀 AIRN Backend running on http://localhost:5000
Environment: development
```

## Testing Your Setup

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","message":"AIRN Backend is running"}
```

### Test 2: Sign Up User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Expected response:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Test User",
    "email": "test@example.com",
    "picture": null
  }
}
```

### Test 3: Verify in Supabase Dashboard
1. Go to **Table Editor**
2. Click on `users` table
3. You should see your test user in the table

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Issue: "SUPABASE_URL is not defined"
- Make sure `.env` file exists in `/backend` folder
- Restart the development server
- Check spelling: `SUPABASE_URL` (all caps)

### Issue: "Invalid API key"
- Go back to Settings → API
- Copy the entire `anon public` key (including "eyJ...")
- Make sure you're not copying the service_role key

### Issue: "Connection refused to database"
- Verify SUPABASE_URL is correct
- Check your Supabase project is active
- Try: Go to Supabase dashboard → Overview → Check Status

### Issue: "Tables don't exist"
1. Make sure schema.sql was fully executed
2. Check **Table Editor** in Supabase dashboard
3. If tables not there, try running schema.sql again
4. Ensure you clicked **Run** button

### Issue: "Port 5000 already in use"
```bash
# Change PORT in .env to 5001 or:
lsof -ti:5000 | xargs kill -9
```

## Backup & Recovery

### Backup your database
1. In Supabase, go to **Settings** → **Backups**
2. Click "Create backup"
3. Can restore from previous backups

### Export data
```bash
# From backend folder:
npm run export-data  # (requires custom script)
```

## Security Best Practices

1. ✅ **Keep `.env` private** - Add to `.gitignore`
2. ✅ **Use strong JWT_SECRET** - At least 32 characters
3. ✅ **Enable Row Level Security** - Already in schema.sql
4. ✅ **Use environment-specific credentials** - Different keys for dev/prod
5. ✅ **Rotate credentials regularly** - Generate new keys periodically
6. ✅ **Monitor usage** - Check Supabase billing page

## Next Steps

1. ✅ Backend is running and connected to Supabase
2. 📱 [Integrate with Frontend](./FRONTEND_INTEGRATION.js)
3. 🚀 [Deploy to Production](./SETUP_GUIDE.md#-deployment)
4. 💳 [Add Payment Processing](./routes/payments.js)

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Community**: https://supabase.com/community
- **Status Page**: https://status.supabase.com

---

**Questions?** Check the [API_DOCS.md](./API_DOCS.md) for complete endpoint reference.
