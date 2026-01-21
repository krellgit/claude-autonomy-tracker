# Deployment Instructions

## ✅ Completed

Your project has been successfully deployed to Vercel!

1. **Production URL**: https://claude-autonomy-tracker.vercel.app
2. **GitHub Repository**: https://github.com/krellgit/claude-autonomy-tracker
3. **Vercel Project**: claude-autonomy-tracker

## 🔧 Manual Steps Required

### 1. Set Up Vercel Postgres Database

1. Go to your Vercel Dashboard: https://vercel.com/krell/claude-autonomy-tracker
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., "claude-tracker-db")
6. Select a region (recommend: US East for low latency)
7. Click **Create**
8. Once created, click **Connect** to link it to your project
9. The environment variables will be automatically added

### 2. Run Database Schema

After the database is connected, run the schema:

1. In your Vercel dashboard, go to the database you just created
2. Click on the **Query** tab or **Data** tab
3. Copy the contents of `sql/schema.sql` from your repository
4. Paste and execute the SQL commands

Or use the Vercel CLI from your project directory:

```bash
cat sql/schema.sql | vercel env pull
```

### 3. Configure Custom Domain (longCC.the-ppc-geek.org)

Since your domain uses third-party nameservers, you need to add DNS records manually:

#### Option A: Add CNAME Record (Recommended)

Add this record in your DNS provider (wherever the-ppc-geek.org DNS is managed):

```
Type: CNAME
Name: longCC
Value: cname.vercel-dns.com
TTL: 3600 (or automatic)
```

#### Option B: Add A Record

If CNAME doesn't work, use A records pointing to Vercel's IP addresses:

```
Type: A
Name: longCC
Value: 76.76.21.21
```

#### After DNS Configuration

1. Wait for DNS propagation (can take up to 48 hours, usually much faster)
2. In Vercel Dashboard, go to your project settings
3. Navigate to **Domains** section
4. Click **Add Domain**
5. Enter: `longCC.the-ppc-geek.org`
6. Click **Add**
7. Vercel will automatically provision an SSL certificate

Or use CLI once DNS is configured:

```bash
vercel domains add longCC.the-ppc-geek.org
```

### 4. Update Hook Script Configuration

Once deployed, users will need to update the hook script:

1. Edit `scripts/claude-timer-hook.sh`
2. Update the API_URL:

```bash
API_URL="https://longCC.the-ppc-geek.org/api/sessions"
# or initially use:
# API_URL="https://claude-autonomy-tracker.vercel.app/api/sessions"
```

## 🧪 Testing After Setup

1. **Test Manual Submission**:
   - Visit https://claude-autonomy-tracker.vercel.app/submit
   - Fill out the form and submit a test session
   - Check if it appears on the homepage leaderboard

2. **Test API Endpoints**:
   ```bash
   # Test POST /api/sessions
   curl -X POST https://claude-autonomy-tracker.vercel.app/api/sessions \
     -H "Content-Type: application/json" \
     -d '{
       "username": "test-user",
       "task_description": "Test session",
       "autonomous_duration": 300,
       "action_count": 10
     }'

   # Test GET /api/sessions
   curl https://claude-autonomy-tracker.vercel.app/api/sessions

   # Test GET /api/stats
   curl https://claude-autonomy-tracker.vercel.app/api/stats
   ```

3. **Verify Database**:
   - Check Vercel dashboard database query interface
   - Run: `SELECT * FROM sessions;`
   - Verify test data appears

## 📊 Monitoring

1. **Logs**: View real-time logs in Vercel Dashboard > Deployments > [Latest] > Function Logs
2. **Analytics**: Check Vercel Dashboard > Analytics
3. **Error Tracking**: Monitor the Function Logs for any errors

## 🚀 Future Deployments

Any push to the `master` branch on GitHub will automatically trigger a new deployment to production.

To deploy manually:

```bash
vercel --prod
```

## 📝 Current Status

1. ✅ Application deployed to Vercel
2. ⏳ Postgres database needs to be created via dashboard
3. ⏳ Database schema needs to be run
4. ⏳ Custom domain DNS configuration required
5. ⏳ Custom domain needs to be added in Vercel after DNS propagation
