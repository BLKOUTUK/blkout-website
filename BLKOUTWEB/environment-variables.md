# Environment Variables Configuration

Add these environment variables to your Vercel project to enable the moderation pipeline:

## 1. Vercel Dashboard Configuration

Navigate to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add the following variables:

```env
# OpenRouter AI Integration
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=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
DEFAULT_MODEL=anthropic/claude-3-haiku

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Community Settings
COMMUNITY_MODERATION_ENABLED=true
PUBLICATION_AUTO_ARCHIVE=true
CURATOR_SIGNUP_ENABLED=true
```

## 2. Local Development (.env.local)

For local development, create `.env.local` in your project root:

```env
# OpenRouter AI Integration
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=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
DEFAULT_MODEL=anthropic/claude-3-haiku

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Community Settings
COMMUNITY_MODERATION_ENABLED=true
PUBLICATION_AUTO_ARCHIVE=true
CURATOR_SIGNUP_ENABLED=true
```

## 3. Required Actions

1. **Add to Vercel**: Copy the production variables to Vercel dashboard
2. **Redeploy**: Trigger a new deployment after adding environment variables
3. **Test**: Verify the `/api/moderate-content` endpoint works correctly

## 4. Security Notes

- The OpenRouter API key provided has been shared for this implementation
- **IMPORTANT**: Revoke this key after testing: `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`
- Replace with your own OpenRouter API key for production use
- Never commit API keys to version control

## 5. Testing the Integration

After deployment, test the moderation workflow:

```bash
# Test the API endpoint
curl -X POST https://your-domain.vercel.app/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "contentId": "test-content-id",
    "moderatorId": "test-moderator-id"
  }'
```

This will enable Chrome extension content to flow through the complete pipeline:
**Chrome Extension → Moderation Queue → API Approval → Published Content → Community Display**