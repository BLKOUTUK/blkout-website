// Simple health check API endpoint (JavaScript instead of TypeScript)
export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: process.env.NODE_ENV || 'development'
  });
}