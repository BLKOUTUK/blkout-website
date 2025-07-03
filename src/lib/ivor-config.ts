/**
 * IVOR Configuration - Backend connection settings
 */

export const IVOR_CONFIG = {
  // Backend API endpoints
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://ivor-api.blkoutuk.com'
    : 'http://localhost:8000',
    
  WEBSOCKET_URL: process.env.NODE_ENV === 'production'
    ? 'wss://ivor-api.blkoutuk.com/ws'
    : 'ws://localhost:8000/ws',
    
  // API endpoints
  ENDPOINTS: {
    CHAT_MESSAGE: '/chat/message',
    CHAT_SUGGESTIONS: '/chat/suggestions',
    EVENTS_UPCOMING: '/events/upcoming',
    EVENTS_SEARCH: '/events/search',
    HEALTH: '/health'
  },
  
  // WebSocket configuration
  WEBSOCKET: {
    RECONNECT_INTERVAL: 3000,
    MAX_RECONNECT_ATTEMPTS: 5,
    HEARTBEAT_INTERVAL: 30000
  },
  
  // Chat configuration
  CHAT: {
    MAX_MESSAGE_LENGTH: 1000,
    TYPING_INDICATOR_DELAY: 500,
    AUTO_SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior
  },
  
  // Avatar states
  AVATAR_STATES: {
    IDLE: 'idle',
    THINKING: 'thinking', 
    SPEAKING: 'speaking',
    ERROR: 'error'
  } as const
}

export type AvatarState = typeof IVOR_CONFIG.AVATAR_STATES[keyof typeof IVOR_CONFIG.AVATAR_STATES]