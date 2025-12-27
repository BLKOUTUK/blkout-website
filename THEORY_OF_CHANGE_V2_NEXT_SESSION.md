# Theory of Change v2.0 - Next Session Handoff

**Date**: 2025-12-26
**Status**: Production assets complete, component integration pending

---

## ✅ COMPLETED THIS SESSION

### Assets Generated
- ✅ **33 hyper-real cards** → `/home/robbe/blkout-website/public/images/theory-of-change/card-*.png`
- ✅ **35 background images** → `/home/robbe/blkout-website/public/images/theory-backgrounds-resized/`
- ✅ **Disclaimer component** → `/home/robbe/blkout-website/src/components/movement/DisclaimerCard.tsx`
- ✅ **Production docs** → `/home/robbe/blkout-platform/apps/comms-blkout/scripts/` (10 files)

### Infrastructure Fixes
- ✅ **Archive accessibility** fixed - StoryArchivePage queries `legacy_articles` (281 published articles)
- ✅ **Archive integration** - Featured on Platform Homepage, Navigation, Discover page
- ✅ **Deployment** - blkoutuk.com properly configured (Coolify, not Vercel)
- ✅ **Architecture documented** - Single source of truth: blkout-website repo

### Wan 2.6 API Setup
- ✅ **API configured** - DashScope endpoint, WAN_API_KEY set
- ✅ **Service created** - `scripts/services/wan-direct.ts`
- ✅ **Tested working** - Generated 33 cards + 6 backgrounds successfully

---

## 📋 NEXT SESSION TASKS

### 1. Complete Component Integration

**File**: `/home/robbe/blkout-website/src/components/movement/TheoryOfChange.tsx`

**Updates Needed** (in order):

#### A. Add imageUrl to all cards (31 remaining)
Cards 3-17, 19, 21-26, 28, 30-33, 35-38 need:
```typescript
visualStyle: 'hyper-real',
imageUrl: '/images/theory-of-change/card-XX-[name].png',
```

**Reference**: `/home/robbe/blkout-website/public/images/theory-of-change/` has all filenames

#### B. Add disclaimer to allCards array
```typescript
const allCards = [disclaimerCard, ...act1Cards, ...act2Cards, ...act3Cards, ...act4Cards, ...act5Cards]
```

#### C. Update Card rendering to show background images
In `Card` component, add before content rendering:
```typescript
// Background image rendering
{card.imageUrl && (
  <div className="absolute inset-0 z-0">
    <img
      src={card.imageUrl}
      alt=""
      className="w-full h-full object-cover"
    />
    {/* Gradient overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
  </div>
)}
<div className="relative z-10">
  {/* Existing content rendering */}
</div>
```

#### D. Add disclaimer card rendering
```typescript
case 'disclaimer':
  return (
    <div className="text-center max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-black mb-8 text-white uppercase">
        {card.content.title}
      </h1>
      <p className="text-xl md:text-2xl text-amber-400 mb-12 font-bold">
        {card.content.body}
      </p>
      <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg p-6">
        <pre className="text-sm text-purple-400 whitespace-pre-line text-left">
          {card.content.subtext}
        </pre>
      </div>
    </div>
  )
```

#### E. Update aspect ratios
Change all `aspect-video` → `aspect-[4/5]` for standard cards
Keep `aspect-video` for Cards 18, 34, 39 (videos)

#### F. Add CTAs to cards
Per `THEORY_OF_CHANGE_CTA_STRATEGY.md`:
- Card 10, 17, 21, 24, 26, 29, 32, 37, 38: Add single CTAs
- Card 40: Already has OOMF CTA

#### G. Add HorizontalCTAScroll component
- Copy from `/home/robbe/blkout-platform/apps/comms-blkout/scripts/ACT5_HORIZONTAL_CTA_COMPONENT.tsx`
- To: `/home/robbe/blkout-website/src/components/movement/HorizontalCTAScroll.tsx`
- Import and use on Cards 37-38

---

### 2. Generate Videos

#### Fix Keyframe Size
Update `generate-video-keyframes.ts`:
```typescript
size: '1280*720' // Instead of '1920*1080'
```

#### Generate Key Frames
```bash
cd /home/robbe/blkout-platform/apps/comms-blkout
WAN_API_KEY=sk-b6ddccc5562343c191b20b0334549a2f npx tsx scripts/generate-video-keyframes.ts
```
**Output**: 8 key frame images (~24 min)

#### Animate with Wan I2V
Use `wan-direct.ts` `generateVideo()` function for each key frame
**Output**: 8 video clips (~24 min)

#### User Edits Together
- Video 1: 4 clips → single 60-90s video
- Video 2: 4 clips → single 60-90s video

---

### 3. User Creates Video 3

**Prompt**: `CARD_39_TRANSITION_VIDEO_PROMPT.md`
**Output**: `/home/robbe/blkout-website/public/videos/card-39-transition.mp4`

---

### 4. Final Deployment

```bash
cd /home/robbe/blkout-website
git add .
git commit -m "feat: Theory of Change v2.0 with hyper-real imagery"
git push
# Coolify auto-deploys to blkoutuk.com/movement
```

---

## 🗂️ FILE LOCATIONS

### Assets
- **Cards**: `/home/robbe/blkout-website/public/images/theory-of-change/`
- **Backgrounds**: `/home/robbe/blkout-website/public/images/theory-backgrounds-resized/`
- **Videos** (when ready): `/home/robbe/blkout-website/public/videos/`

### Components
- **Main**: `/home/robbe/blkout-website/src/components/movement/TheoryOfChange.tsx`
- **Disclaimer**: `/home/robbe/blkout-website/src/components/movement/DisclaimerCard.tsx`
- **Horizontal CTAs**: Need to copy from comms-blkout

### Documentation
- **Production docs**: `/home/robbe/blkout-platform/apps/comms-blkout/scripts/`
- **Integration audit**: `/home/robbe/blkout-website/LEGACY_ARTICLES_INTEGRATION_AUDIT.md`
- **This handoff**: `/home/robbe/blkout-website/THEORY_OF_CHANGE_V2_NEXT_SESSION.md`

### API Configuration
- **Wan API**: `/home/robbe/blkout-platform/apps/comms-blkout/scripts/services/wan-direct.ts`
- **API Key**: In `/home/robbe/blkout-platform/apps/comms-blkout/.env`

---

## 🎯 SUCCESS CRITERIA

- [x] 33 hyper-real cards generated
- [x] Disclaimer card component created
- [x] Archive accessibility fixed
- [ ] All cards integrated with imageUrl paths
- [ ] Aspect ratios updated to 4:5
- [ ] 10 CTAs added
- [ ] Horizontal CTA scroll integrated
- [ ] Videos 1 & 2 generated and integrated
- [ ] Video 3 created by user
- [ ] Deployed to blkoutuk.com/movement

---

## ⚠️ IMPORTANT NOTES

### Deployment Architecture (NEVER FORGET)
- **blkoutuk.com** = Coolify/Hostinger (NOT Vercel)
- **Repo**: blkout-website (NOT blkout-community-platform)
- **Process**: Push to GitHub → Coolify auto-deploys

### Archive Protection
- **Table**: `legacy_articles` (281 published articles, 2016-2025)
- **Route**: `/stories` (StoryArchivePage component)
- **Verified**: Monthly check article count hasn't decreased

### Wan API Limits
- **Max pixels**: 589,824 to 1,638,400 (use 1280×720 for video, 1080×1350 for cards)
- **Base64 limit**: 10MB (backgrounds must be resized)

---

**Resume next session with:** "Continue Theory of Change v2.0 integration"
