# Visitor Analytics Setup

Vercel Analytics has been installed and configured to track visitors to your Claude Code Autonomy Tracker.

## ✅ What's Already Done

1. Installed `@vercel/analytics` package
2. Added Analytics component to the root layout
3. Deployed to production

Analytics is now tracking:
- Unique visitors
- Page views
- Top pages
- Referrers
- Devices (desktop/mobile)
- Browsers
- Countries/regions

## 📊 How to View Your Analytics

### Option 1: Vercel Dashboard (Recommended)

1. Go to your Vercel Dashboard: https://vercel.com/krell/claude-autonomy-tracker

2. Click on the **Analytics** tab in the left sidebar

3. If Analytics is not enabled yet:
   - You'll see a prompt to enable it
   - Click **Enable Analytics**
   - Choose the plan:
     - **Hobby (Free)**: 2,500 events/month
     - **Pro**: 100,000 events/month
     - For your use case, the free tier should be sufficient to start

4. Once enabled, you'll see:
   - **Visitors**: Unique visitors over time
   - **Page Views**: Total page views
   - **Top Pages**: Most visited pages
   - **Top Referrers**: Where traffic is coming from
   - **Devices**: Desktop vs mobile breakdown
   - **Locations**: Geographic distribution

### Option 2: Command Line

You can also check analytics from the CLI:

```bash
vercel analytics
```

## 📈 Understanding Your Data

### Key Metrics

1. **Unique Visitors**: Number of individual people who visited
   - Counted once per visitor per day
   - Privacy-friendly (no cookies or personal data)

2. **Page Views**: Total number of page loads
   - A visitor can have multiple page views

3. **Bounce Rate**: Percentage who leave after viewing one page

4. **Top Pages**: Which pages are most popular
   - `/` (homepage with leaderboard)
   - `/user/[username]` (user profiles)

### Time Ranges

You can view data for:
- Last 24 hours
- Last 7 days
- Last 30 days
- All time

## 🔒 Privacy

Vercel Analytics is privacy-focused:
- No cookies
- No personal data collection
- GDPR compliant
- CCPA compliant
- Aggregated data only

## 💡 Additional Features (Pro Plan)

If you upgrade to Vercel Pro, you get:
- Web Vitals tracking (performance metrics)
- Audience insights
- Custom events
- Funnel analysis
- Real-time data

## 🎯 What to Track

For your Claude Code Autonomy Tracker, key metrics to watch:

1. **Total Unique Visitors**: How many people discovered your tracker
2. **Returning Visitors**: How engaged your community is
3. **Top Referrers**: Where your traffic comes from (GitHub, Twitter, etc.)
4. **User Profile Views**: Which users are most popular
5. **Geographic Distribution**: Where your users are located

## 📝 Export Data

To export analytics data:

1. Go to Vercel Dashboard > Analytics
2. Click the **Export** button in the top right
3. Choose date range and format (CSV or JSON)

## 🔗 Quick Links

- **Your Analytics Dashboard**: https://vercel.com/krell/claude-autonomy-tracker/analytics
- **Vercel Analytics Docs**: https://vercel.com/docs/analytics
- **Pricing**: https://vercel.com/pricing

## 🚀 Next Steps

1. Visit the analytics dashboard to enable it (if not already enabled)
2. Wait a few hours for data to populate
3. Check back daily to see visitor trends
4. Share your leaderboard URL to grow your community!

Your analytics will start collecting data immediately now that it's deployed.
