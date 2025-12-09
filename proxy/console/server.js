const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const AUTH_URL = process.env.AUTH_URL || 'http://auth:8080';
const API_URL = process.env.API_URL || 'http://gateway/api';
const CLIENT_ID = process.env.CLIENT_ID || 'console';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'console-secret-key-12345';

let cachedToken = null;
let tokenExpiry = 0;

// Function to get or refresh access token
async function getAccessToken() {
  const now = Date.now();
  
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > now + 60000) {
    return cachedToken;
  }

  try {
    console.log('Fetching new access token...');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'ledger:read ledger:write');
    
    const response = await axios.post(`${AUTH_URL}/oauth/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    cachedToken = response.data.access_token;
    // Assume token expires in 1 hour if not specified
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiry = now + (expiresIn * 1000);
    
    console.log('Access token obtained, expires in:', expiresIn, 'seconds');
    return cachedToken;
  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw new Error('Authentication failed');
  }
}

// Mock /versions endpoint for console compatibility
app.get('/versions', (req, res) => {
  res.json({
    region: 'localhost',
    env: 'production',
    versions: [
      { name: 'ledger', version: 'v2.3.3', health: true },
      { name: 'auth', version: 'v2.4.1', health: true }
    ]
  });
});

// Middleware to proxy all requests
app.use(express.json());
app.use(async (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  try {
    const token = await getAccessToken();
    
    // Forward request to API with authentication
    // Remove /api prefix if present since API_URL already includes it
    const apiPath = req.path.startsWith('/api') ? req.path.substring(4) : req.path;
    const response = await axios({
      method: req.method,
      url: `${API_URL}${apiPath}`,
      headers: {
        ...req.headers,
        'Authorization': `Bearer ${token}`,
        'host': undefined, // Remove original host header
        'connection': undefined,
      },
      data: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      params: req.query,
      validateStatus: () => true, // Don't throw on any status code
    });

    // Forward response back to client
    res.status(response.status);
    Object.keys(response.headers).forEach(key => {
      res.set(key, response.headers[key]);
    });
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Console proxy listening on port ${PORT}`);
  console.log(`AUTH_URL: ${AUTH_URL}`);
  console.log(`API_URL: ${API_URL}`);
  console.log(`CLIENT_ID: ${CLIENT_ID}`);
});
