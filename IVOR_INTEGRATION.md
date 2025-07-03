# IVOR Integration Guide
## Connecting BLKOUT Website to IVOR Backend

This guide explains how the BLKOUT website integrates with the separate IVOR repository.

---

## Repository Structure

```
BLKOUTUK/
├── blkout-website/          (this repository)
│   ├── src/components/blkout/
│   │   ├── IvorChatbot.tsx  (frontend component)
│   │   └── IvorAvatar.tsx   (avatar component)
│   ├── src/lib/ivor-config.ts (connection config)
│   └── IVOR_INTEGRATION.md  (this file)
└── ivor/                    (separate repository)
    ├── backend/             (FastAPI service)
    ├── deployment/          (Docker configs)
    └── docs/               (API documentation)
```

---

## Frontend Integration

### Configuration

The frontend connects to IVOR via configuration in `src/lib/ivor-config.ts`:

```typescript
export const IVOR_CONFIG = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://ivor-api.blkoutuk.com'
    : 'http://localhost:8000',
    
  WEBSOCKET_URL: process.env.NODE_ENV === 'production'
    ? 'wss://ivor-api.blkoutuk.com/ws'
    : 'ws://localhost:8000/ws'
}
```

### Components

**IvorChatbot.tsx**: Main chat interface
- Handles WebSocket connection to IVOR backend
- Displays AI responses with sources and suggestions
- Manages conversation state and user sessions

**IvorAvatar.tsx**: Animated avatar
- State-based animations (idle, thinking, speaking, error)
- BLKOUT brand color integration
- Accessibility features

---

## Development Workflow

### 1. Start IVOR Backend

```bash
# Clone and setup IVOR repository
git clone https://github.com/BLKOUTUK/ivor.git
cd ivor
./scripts/setup.sh

# Start backend
cd backend
./start.sh
```

### 2. Start BLKOUT Website

```bash
# In separate terminal
cd blkout-website
npm run dev
```

### 3. Test Integration

- Visit: http://localhost:3003
- Click IVOR avatar in bottom-right corner
- Send test message: "What is BLKOUT about?"

---

## Production Deployment

### Backend Deployment

IVOR backend is deployed separately:
- **Repository**: https://github.com/BLKOUTUK/ivor
- **Production URL**: https://ivor-api.blkoutuk.com
- **Documentation**: https://ivor-api.blkoutuk.com/docs

### Frontend Integration

The BLKOUT website connects to the production IVOR API automatically:
- No additional configuration needed
- CORS is configured in IVOR backend
- SSL/HTTPS handled by IVOR deployment

---

## API Integration

### Chat Endpoint

```typescript
// Send message to IVOR
const response = await fetch(`${IVOR_CONFIG.API_BASE_URL}/chat/message`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello IVOR!',
    session_id: 'user-session-id'
  })
})
```

### WebSocket Connection

```typescript
// Real-time chat via WebSocket
const ws = new WebSocket(IVOR_CONFIG.WEBSOCKET_URL)
ws.send(JSON.stringify({
  message: 'Hello IVOR!',
  session_id: 'user-session-id'
}))
```

### Events Integration

```typescript
// Get upcoming events
const events = await fetch(`${IVOR_CONFIG.API_BASE_URL}/events/upcoming`)
const data = await events.json()
```

---

## Error Handling

### Connection Fallbacks

1. **WebSocket Primary**: Real-time communication
2. **HTTP Fallback**: If WebSocket fails
3. **Mock Response**: If backend unavailable

### User Experience

- Connection status indicator in chat header
- Graceful error messages aligned with BLKOUT values
- Automatic reconnection attempts

---

## Customization

### Branding

IVOR components use BLKOUT design system:
- Colors from `src/lib/constants.ts`
- Typography and spacing from Tailwind config
- Accessibility features maintained

### Content

IVOR's knowledge base is managed in the backend repository:
- Community values and principles
- Cooperative ownership resources
- Event information and connections

---

## Monitoring

### Health Checks

```bash
# Check IVOR backend status
curl https://ivor-api.blkoutuk.com/health/

# Detailed health information
curl https://ivor-api.blkoutuk.com/health/detailed
```

### Performance

- **Response Times**: < 3 seconds for AI responses
- **Availability**: 99.9% uptime target
- **Cost Monitoring**: Track API usage in DeepSeek dashboard

---

## Troubleshooting

### Common Issues

**IVOR not responding:**
1. Check backend status: `curl https://ivor-api.blkoutuk.com/health/`
2. Verify network connectivity
3. Check browser console for errors

**WebSocket connection fails:**
1. Verify URL in `ivor-config.ts`
2. Check firewall/proxy settings
3. Fallback to HTTP API should work

**Chat interface not loading:**
1. Check frontend build: `npm run build`
2. Verify component imports
3. Check browser compatibility

### Debug Mode

Enable debug logging:

```typescript
// In IvorChatbot.tsx
const DEBUG = process.env.NODE_ENV === 'development'
if (DEBUG) console.log('IVOR Debug:', data)
```

---

## Future Enhancements

### Planned Features

1. **Enhanced Event Integration**: Direct calendar synchronization
2. **Member Connections**: Community member matching
3. **Resource Recommendations**: Personalized content suggestions
4. **Voice Interface**: Audio input/output capabilities

### Technical Improvements

1. **Caching**: Reduce API calls with intelligent caching
2. **Offline Support**: Service worker for offline functionality
3. **Performance**: Optimize bundle size and loading times
4. **Analytics**: Privacy-focused usage analytics

---

## Support

### Documentation
- **IVOR API**: https://github.com/BLKOUTUK/ivor/docs/API.md
- **Deployment**: https://github.com/BLKOUTUK/ivor/docs/DEPLOYMENT.md

### Community
- **Issues**: GitHub Issues in respective repositories
- **Discord**: BLKOUT Community Discord
- **Email**: hello@blkoutuk.com

---

## Contributing

### Frontend Changes
Submit PRs to `blkout-website` repository for:
- UI/UX improvements
- Component enhancements
- Integration optimizations

### Backend Changes
Submit PRs to `ivor` repository for:
- AI/ML improvements
- API enhancements
- Infrastructure updates

### Cross-Repository Changes
1. Create issues in both repositories
2. Link related PRs
3. Test integration thoroughly
4. Update documentation

This separation allows independent development while maintaining seamless integration for the community experience.