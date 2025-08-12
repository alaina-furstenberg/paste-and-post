# Paste & Post Development Checklist

## 💸 Ultra-Lean MVP Tech Stack (~$5-15/month)
- **Frontend**: Next.js on Vercel (FREE)
- **Database**: Supabase free tier (FREE)
- **Scraping**: Cheerio + fetch for meta tags + Puppeteer on Vercel functions (FREE)
- **AI**: Groq (Llama 3.1 70B) or Claude 3.5 Haiku (~$5-15/month)
- **Social Posting**: Direct Meta Business API free tier (FREE)
- **Auth**: NextAuth.js (FREE)

## 🚀 MVP - Simple Thing That Works

### Phase 1: Core Infrastructure
- [ ] Set up Next.js project structure
- [ ] Initialize Supabase (free tier)
- [ ] Set up NextAuth.js authentication
- [ ] Deploy to Vercel (free tier)

### Phase 2: Link Input & Scraping (FREE approach)
- [ ] Create link input form component
- [ ] Implement basic meta tag scraping with Cheerio + fetch
- [ ] Add Puppeteer fallback for dynamic content (Vercel functions)
- [ ] Test scraping with major sites:
  - [ ] Basic meta tags (title, description, og:image)
  - [ ] Zillow listings
  - [ ] Yelp business pages
  - [ ] Shopify product pages
- [ ] Implement manual image upload fallback
- [ ] Handle scraping failures gracefully

### Phase 3: Goal Selection
- [ ] Create goal selection UI component
- [ ] Implement goal options:
  - [ ] Sell something
  - [ ] Maintain consistency
  - [ ] Promote an event
  - [ ] Educate/inform
- [ ] Store user goal selection

### Phase 4: AI Caption Generation (Budget-friendly)
- [ ] Set up Groq API (Llama 3.1 70B) or Claude 3.5 Haiku
- [ ] Create humanized caption prompts optimized for cost
- [ ] Implement prompt engineering for:
  - [ ] Business category context
  - [ ] Brand voice adaptation
  - [ ] Natural, imperfect tone
  - [ ] Avoiding AI clichés
- [ ] Single-pass generation (skip expensive rewrite initially)
- [ ] Test caption quality across different industries

### Phase 5: Preview & Approval
- [ ] Create preview component (image + caption)
- [ ] Implement caption editing functionality
- [ ] Add image selection (if multiple scraped)
- [ ] Validation before posting

### Phase 6: Social Media Integration (FREE APIs)
- [ ] Set up Meta Business API (free tier)
- [ ] Implement Facebook Pages API integration
- [ ] Add Instagram Basic Display API (limited but free)
- [ ] Create simple posting interface (immediate posts only initially)
- [ ] Add basic scheduling using database + cron jobs
- [ ] Send confirmation via email (using Resend free tier)

### Phase 7: Testing & Polish
- [ ] End-to-end testing of complete flow
- [ ] Error handling and user feedback
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Security audit

## 📈 Future Features (Post-MVP)

### Batch Processing
- [ ] Multiple link upload interface
- [ ] Bulk scheduling system
- [ ] Queue management

### Enhanced AI Features
- [ ] Bilingual caption generation
- [ ] Persistent brand voice memory
- [ ] Local context injection (weather, events)
- [ ] Industry-specific goal templates

### Content Enhancement
- [ ] Branded image templates
- [ ] Image editing tools
- [ ] Video content support

### Additional Platforms
- [ ] TikTok integration
- [ ] Pinterest integration
- [ ] YouTube Shorts
- [ ] Twitter/X

### Analytics & Optimization
- [ ] Post performance tracking
- [ ] Caption edit rate analytics
- [ ] User engagement metrics
- [ ] A/B testing for captions

## 💰 Monetization Setup

### Payment Integration
- [ ] Stripe/payment processor setup
- [ ] Subscription tier implementation:
  - [ ] Starter ($49/mo - 8 posts)
  - [ ] Pro ($99/mo - 20 posts + batching)
  - [ ] VIP ($199/mo - unlimited + extras)
- [ ] Usage tracking and limits
- [ ] Billing dashboard

### Admin Features
- [ ] User management dashboard
- [ ] Usage analytics
- [ ] Customer support tools

## 📊 Success Metrics Tracking

### Implementation
- [ ] User activation tracking (48h signup to first post)
- [ ] Retention metrics (4+ posts/month)
- [ ] Caption edit rate monitoring
- [ ] User feedback collection system
- [ ] Performance dashboards

---

## 🎯 Current Sprint Focus
**Goal**: Get the simplest working version deployed
**Target**: Link → Scrape → Generate Caption → Preview → Post

### Next Immediate Steps (Ultra-lean approach):
1. [ ] Initialize Next.js project with TypeScript
2. [ ] Set up Supabase database and auth
3. [ ] Create basic form for link input
4. [ ] Implement Cheerio-based meta tag scraping
5. [ ] Connect to Groq API for caption generation
6. [ ] Create simple preview interface
7. [ ] Set up Meta Business API for Facebook posting

**Estimated monthly cost**: $5-15 (AI only)
**Time to MVP**: 1-2 weeks

---

*Last Updated: August 12, 2025*