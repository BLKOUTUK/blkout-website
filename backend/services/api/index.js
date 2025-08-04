/**
 * BLKOUT IVOR AI Backend - Vercel Serverless Function
 * Intelligent AI assistant with liberation pathway context
 */

// Helper functions
function getDefaultFocus(pathway) {
  const focuses = {
    'Community Healer': 'healing trauma and building resilience',
    'Culture Keeper': 'preserving and celebrating Black culture', 
    'System Disruptor': 'challenging oppressive systems',
    'Wisdom Keeper': 'sharing knowledge and mentoring others'
  };
  return focuses[pathway] || 'community empowerment and liberation';
}

function getDefaultDescription(pathway) {
  const descriptions = {
    'Community Healer': 'Focused on trauma-informed support and collective healing',
    'Culture Keeper': 'Dedicated to cultural preservation and celebration',
    'System Disruptor': 'Committed to systemic change through direct action', 
    'Wisdom Keeper': 'Sharing knowledge and guiding community growth'
  };
  return descriptions[pathway] || 'Working toward Black queer liberation';
}

function getPathwayNextSteps(pathway) {
  const nextSteps = {
    'Community Healer': [
      'Explore trauma-informed community resources',
      'Connect with other healers in the community',
      'Learn about collective healing practices',
      'Share your healing journey with others'
    ],
    'Culture Keeper': [
      'Document and share cultural practices',
      'Connect with cultural preservation initiatives', 
      'Organize cultural celebration events',
      'Teach others about Black queer history'
    ],
    'System Disruptor': [
      'Join or organize direct action campaigns',
      'Learn about systemic oppression and resistance',
      'Build coalitions for systemic change',
      'Develop strategies for community organizing'
    ],
    'Wisdom Keeper': [
      'Mentor younger community members',
      'Share knowledge through storytelling',
      'Create educational resources for the community',
      'Build intergenerational connections'
    ]
  };
  return nextSteps[pathway] || [
    'Explore your liberation pathway further',
    'Connect with the BLKOUT community',
    'Share your experiences and learn from others',
    'Take action toward collective liberation'
  ];
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  try {
    // Health endpoint
    if (url === '/api/health' && method === 'GET') {
      return res.status(200).json({
        success: true,
        service: 'IVOR AI Backend',
        status: 'healthy',
        version: '2.0.0',
        features: ['pathway_integration', 'community_chat', 'liberation_focus'],
        timestamp: new Date().toISOString()
      });
    }
    
    // Chat endpoint
    if (url === '/api/chat' && method === 'POST') {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Message is required and must be a string'
        });
      }

      // Generate contextual AI response based on liberation pathway
      let response = "Greetings from IVOR! I'm here to support the BLKOUT community. ";
      
      if (context && context.pathway) {
        const { pathway, focus, description } = context;
        
        switch (pathway) {
          case 'Community Healer':
            response = `Hello, fellow Community Healer! Your focus on ${focus || 'healing trauma and building resilience'} resonates deeply with our community's need for collective healing. Regarding your message: "${message}" - I understand the importance of trauma-informed support and creating safe spaces for healing. How can we work together to build resilience and support systems that honor our community's healing journey? What specific healing practices or resources would be most helpful right now?`;
            break;
            
          case 'Culture Keeper':
            response = `Greetings, Culture Keeper! Your dedication to ${focus || 'preserving and celebrating Black culture'} is vital for our community's strength and identity. About your message: "${message}" - our cultural preservation and celebration efforts need voices like yours. What specific cultural practices, traditions, or stories are you most passionate about preserving and sharing? How can we ensure our rich heritage continues to inspire and guide our community?`;
            break;
            
          case 'System Disruptor':
            response = `Power to you, System Disruptor! Your commitment to ${focus || 'challenging oppressive systems'} aligns perfectly with our liberation work. Your message "${message}" reflects the urgency of systemic change. What specific systems or structures are you working to disrupt? How can we coordinate our efforts to create meaningful change and build alternative systems that serve our community's liberation?`;
            break;
            
          case 'Wisdom Keeper':
            response = `Welcome, Wisdom Keeper! Your role in ${focus || 'sharing knowledge and mentoring others'} is essential for our community's growth and guidance. Your message "${message}" shows the importance of knowledge sharing and mentorship. What wisdom, experiences, or insights would you like to share with our community today? How can we create more opportunities for intergenerational learning and knowledge transfer?`;
            break;
            
          default:
            response = `Thank you for connecting with IVOR! Your message "${message}" is valued and important to our community. While I'm still learning about your specific liberation pathway, I'm here to support you on your journey toward collective freedom and community empowerment. How can we work together to advance Black queer liberation and build the world we deserve?`;
        }
      } else {
        response = `Thank you for reaching out! Your message "${message}" is important to our community. I'm IVOR, the AI assistant for BLKOUT - here to support Black queer liberation through authentic conversation and community connection. Whether you're exploring your liberation pathway, seeking resources, or looking to connect with our community, I'm here to help. What brings you to our platform today?`;
      }

      // Add community resources and next steps
      response += "\n\nRemember: You're part of a powerful community working toward liberation. Feel free to explore our resources, connect with others, or ask me about anything related to Black queer community support, liberation pathways, or how to get more involved with BLKOUT.";

      return res.status(200).json({
        success: true,
        response: response,
        context_received: Boolean(context),
        pathway_detected: context?.pathway || null,
        timestamp: new Date().toISOString(),
        conversation_id: `ivor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    // Pathway context endpoint
    if (url === '/api/pathway-context' && method === 'POST') {
      const { pathway, focus, description, userId } = req.body;
      
      if (!pathway) {
        return res.status(400).json({
          success: false,
          error: 'Pathway is required'
        });
      }

      const pathwayContext = {
        pathway,
        focus: focus || getDefaultFocus(pathway),
        description: description || getDefaultDescription(pathway),
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString(),
        status: 'active'
      };

      return res.status(200).json({
        success: true,
        message: 'Pathway context saved successfully',
        context: pathwayContext,
        next_steps: getPathwayNextSteps(pathway)
      });
    }
    
    // 404 for other routes
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      message: 'This endpoint does not exist on the IVOR AI backend',
      available_endpoints: ['/api/health', '/api/chat', '/api/pathway-context']
    });
    
  } catch (error) {
    console.error('IVOR Backend Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error - IVOR is temporarily unavailable',
      message: 'Please try again in a moment. If the issue persists, our community is still here to support you through other channels.',
      fallback: 'You can always reach out through our community forums or contact our support team directly.'
    });
  }
}