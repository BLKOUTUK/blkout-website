# IVOR Quick Start Guide
## Get IVOR running in 5 minutes

---

## 🚀 Quick Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd /home/robbe/projects/blkout-website/ivor-backend

# Copy environment file
cp .env.example .env

# Edit .env with your API keys (minimum required)
nano .env
```

**Required API Keys:**
- `DEEPSEEK_API_KEY=your_deepseek_key` (Get from https://platform.deepseek.com)
- `OPENAI_API_KEY=your_openai_key` (Get from https://platform.openai.com)

**Optional (for full features):**
- `QWEN_API_KEY=your_qwen_key` (Alibaba Cloud)

```bash
# Start backend with auto-setup
./start.sh
```

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd /home/robbe/projects/blkout-website

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

### 3. Access IVOR

- **Website**: http://localhost:3003
- **Backend API**: http://localhost:8000
- **Chat**: Click the IVOR avatar in bottom-right corner

---

## 🧪 Test the Setup

### Basic Health Check
```bash
curl http://localhost:8000/health/
```

### Send Test Message
```bash
curl -X POST http://localhost:8000/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello IVOR!"}'
```

### Get Events
```bash
curl http://localhost:8000/events/upcoming
```

---

## 🔧 Docker Alternative

If you prefer Docker:

```bash
cd ivor-backend
docker-compose up --build
```

---

## 🚨 Troubleshooting

### Backend Won't Start
1. Check Python version: `python3 --version` (need 3.11+)
2. Check .env file exists and has API keys
3. Install dependencies manually: `pip install -r requirements.txt`

### Frontend Can't Connect
1. Verify backend is running on port 8000
2. Check browser console for WebSocket errors
3. Try HTTP fallback if WebSocket fails

### No AI Responses
1. Verify DeepSeek API key is valid
2. Check backend logs: `tail -f ivor-backend/ivor.log`
3. Test API directly with curl

### ChromaDB Issues
1. Check directory permissions: `chmod 755 chroma_db`
2. Clear and recreate: `rm -rf chroma_db && mkdir chroma_db`

---

## 💡 Features to Test

### 1. Basic Chat
- "What is BLKOUT about?"
- "Tell me about cooperative ownership"
- "What are your values?"

### 2. Events Integration
- "What events are happening this week?"
- "Are there any workshops coming up?"

### 3. Community Knowledge
- "How do I get involved?"
- "What resources are available?"

### 4. Avatar States
- Watch avatar animate during responses
- Notice different states (idle, thinking, speaking)

---

## 📊 Cost Monitoring

Expected costs with DeepSeek:
- **Light usage** (100 messages/day): ~$2/month
- **Moderate usage** (500 messages/day): ~$8/month  
- **Heavy usage** (2000 messages/day): ~$25/month

Monitor usage in DeepSeek dashboard.

---

## 🎯 Next Steps

Once basic setup works:

1. **Add Knowledge**: Update community documents in knowledge base
2. **Customize Responses**: Modify prompts in `core/ai_service.py`
3. **Events Integration**: Connect to real calendar API
4. **Deploy**: Use Docker for production deployment

---

## 🆘 Need Help?

1. Check logs: `tail -f ivor-backend/ivor.log`
2. Test individual components with curl
3. Verify API keys and network connectivity
4. Check Discord/community for support

**Backend Status**: http://localhost:8000/health/detailed  
**API Documentation**: http://localhost:8000/docs (when running)