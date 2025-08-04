/**
 * BLKOUT IVOR Platform - Backend API
 * Minimal Express server for AI chat functionality
 */

const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://blkout-website-9stqi5sck-robs-projects-54d653d3.vercel.app',
    'https://blkoutuk.com',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175'
  ],
  credentials: true
}));

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BLKOUT IVOR Backend is healthy',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, context } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }

  let response = "Thank you for connecting with IVOR! ";
  
  if (context && context.pathway) {
    switch (context.pathway) {
      case 'Community Healer':
        response += `As a Community Healer focused on healing trauma, your message "${message}" resonates deeply. How can we support collective healing in our community?`;
        break;
      case 'Culture Keeper':
        response += `Your role as a Culture Keeper is vital. Regarding "${message}" - what cultural practices are you most passionate about preserving?`;
        break;
      case 'System Disruptor':
        response += `As a System Disruptor, your message "${message}" aligns with challenging oppression. What systemic changes are you working toward?`;
        break;
      case 'Wisdom Keeper':
        response += `Your wisdom as a Wisdom Keeper is essential. Your message "${message}" reflects knowledge sharing. What would you like to share today?`;
        break;
      default:
        response += `Your message "${message}" is important. I'm here to support your liberation journey. How can we work together?`;
    }
  } else {
    response += `Your message "${message}" is valued. I'm IVOR, here to support the BLKOUT community. How can I assist you today?`;
  }

  res.json({
    success: true,
    response: response,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`IVOR Backend running on port ${port}`);
});

module.exports = app;