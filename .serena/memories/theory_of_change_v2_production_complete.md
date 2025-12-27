# Theory of Change v2.0 - Production Complete (2025-12-26)

## ✅ COMPLETED ASSETS

### Hyper-Real Card Images (33 cards)
**Location**: `/home/robbe/blkout-website/public/images/theory-of-change/card-*.png`

**Complete Set**:
- Cards 1-17 (Act 1 & 2)
- Card 19 (Act 3 start)
- Cards 21-26, 28 (Act 3 continued)
- Cards 30-33 (Act 4)
- Cards 35-38 (Act 5)

**Style**: Full hyper-real photorealistic
**Format**: 4:5 portrait (1080x1350)
**Total Size**: ~63 MB
**Diversity**: Ages 20s-50s, various hair/builds/presentations
**Purple continuity**: Maintained throughout

### Background Images (35 total)
**Location**: `/home/robbe/blkout-website/public/images/theory-backgrounds-resized/`
- 29 scroll backgrounds (1.png - 29.png)
- 6 generated backgrounds (bg-card-15, 24, 25, 26, 28, 37)

### Disclaimer Card Component
**Location**: `/home/robbe/blkout-website/src/components/movement/DisclaimerCard.tsx`
**Credits**: Wan 2.6 (DashScope), Gemini 3 Pro
**Real photos**: Cards 20, 27, 29, 39, 40

## 📋 PRODUCTION DOCUMENTS

**All in**: `/home/robbe/blkout-platform/apps/comms-blkout/scripts/`

1. **THEORY_OF_CHANGE_PHOTO_REQUIREMENTS.md** - Background specs for 40 cards
2. **THEORY_OF_CHANGE_CTA_STRATEGY.md** - 10 strategic CTAs mapped
3. **BACKGROUND_TO_CARD_MAPPING.md** - Background assignments
4. **VIDEO_1_PROMPTS.md** - "We Don't Know Each Other (Yet)" 4 scenes
5. **VIDEO_2_HEROES_PRODUCTION_PROMPTS.md** - "Heroes" 4 scenes  
6. **CARD_39_TRANSITION_VIDEO_PROMPT.md** - User-created transition
7. **COMPONENT_UPDATES_REQUIRED.md** - Integration checklist
8. **ACT5_HORIZONTAL_CTA_COMPONENT.tsx** - Multi-pathway engagement
9. **PRODUCTION_SUMMARY.md** - Complete workflow
10. **VIDEO_PRODUCTION_SUMMARY.md** - Video approach

## ⏳ PENDING COMPLETION

### Videos (Claude to generate)
- **Video 1** (Card 18): 4 key frames + I2V animation (hyper-real)
- **Video 2** (Card 34): 4 key frames + I2V animation (X-Men 97)
- **Note**: Size issue to fix (1920×1080 too large, use 1280×720)

### User Created
- **Video 3** (Card 39): Transition (animated→real→you)

### Component Integration
- Add disclaimer Card 0
- Update all 33 cards with imageUrl paths
- Change aspect ratios to 4:5 (aspect-[4/5])
- Add 10 strategic CTAs
- Add HorizontalCTAScroll to Cards 37-38
- Update Card 40 to embedded OOMF

## 🎯 NEXT STEPS

1. **Fix video keyframe size** (1280×720 instead of 1920×1080)
2. **Generate 8 video key frames** (~24 min)
3. **Animate with Wan I2V** (8 clips, ~24 min)
4. **Integrate cards into component** (bulk update with imageUrl)
5. **Add CTAs and disclaimer**
6. **Deploy to Coolify**

## 📊 COSTS

- 33 cards: ~$1.00
- 6 backgrounds: ~$0.20
- Videos (pending): ~$0.50
- **Total**: ~$1.70

## 🔧 WAN API CONFIGURATION

**API Key**: `WAN_API_KEY=sk-b6ddccc5562343c191b20b0334549a2f`
**Endpoint**: https://dashscope-intl.aliyuncs.com/api/v1
**Model**: wan2.6-image
**Service**: `/home/robbe/blkout-platform/apps/comms-blkout/scripts/services/wan-direct.ts`
