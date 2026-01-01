const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const app = express();

const PORT = process.env.PORT || 3002;
const LEDGER_URL = process.env.LEDGER_URL || 'http://localhost:3068';
const DOCKER_COMPOSE_DIR = process.env.DOCKER_COMPOSE_DIR || '/app';
const AUTO_RESTART = process.env.AUTO_RESTART !== 'false';
const RESTART_DELAY_MS = parseInt(process.env.RESTART_DELAY_MS || '2000', 10);

// Track recent ledger creations to debounce restarts
let lastRestartTime = 0;
const MIN_RESTART_INTERVAL_MS = 10000; // At least 10 seconds between restarts

console.log(`Ledger Auto-Restart Proxy starting...`);
console.log(`- Target: ${LEDGER_URL}`);
console.log(`- Auto-restart: ${AUTO_RESTART}`);
console.log(`- Restart delay: ${RESTART_DELAY_MS}ms`);

// Function to restart ledger services
async function restartLedgerServices() {
  const now = Date.now();
  
  // Debounce restarts
  if (now - lastRestartTime < MIN_RESTART_INTERVAL_MS) {
    console.log(`[${new Date().toISOString()}] Skipping restart (too soon after last restart)`);
    return;
  }
  
  lastRestartTime = now;
  
  console.log(`[${new Date().toISOString()}] Restarting ledger and worker services...`);
  
  try {
    // Use Docker API or docker compose command
    const { stdout, stderr } = await execPromise(
      'docker compose restart ledger worker',
      { cwd: DOCKER_COMPOSE_DIR }
    );
    
    console.log(`[${new Date().toISOString()}] Restart completed`);
    if (stdout) console.log('stdout:', stdout);
    if (stderr) console.log('stderr:', stderr);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Restart failed:`, error.message);
  }
}

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', autoRestart: AUTO_RESTART });
});

// Proxy all requests
app.use(async (req, res) => {
  const startTime = Date.now();
  const path = req.path;
  const method = req.method;
  
  console.log(`[${new Date().toISOString()}] ${method} ${path}`);
  
  try {
    // Determine if this is a ledger creation request (POST /v2/{ledger})
    const isLedgerCreation = method === 'POST' && /^\/v2\/[^\/]+\/?$/.test(path);
    
    // Forward request to ledger service
    const response = await axios({
      method: method,
      url: `${LEDGER_URL}${path}`,
      headers: {
        ...req.headers,
        host: undefined,
        connection: undefined,
        'content-length': undefined,
      },
      data: ['GET', 'HEAD'].includes(method) ? undefined : req.body,
      params: req.query,
      validateStatus: () => true,
      responseType: 'arraybuffer',
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${method} ${path} -> ${response.status} (${duration}ms)`);
    
    // Forward response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.set(key, value);
      }
    });
    
    // Send response
    res.status(response.status).send(response.data);
    
    // If ledger was successfully created, schedule a restart
    if (isLedgerCreation && response.status >= 200 && response.status < 300 && AUTO_RESTART) {
      console.log(`[${new Date().toISOString()}] Ledger creation detected, scheduling restart in ${RESTART_DELAY_MS}ms`);
      
      setTimeout(() => {
        restartLedgerServices();
      }, RESTART_DELAY_MS);
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Proxy error:`, error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'Ledger service is not available',
      });
    } else {
      res.status(500).json({
        error: 'Proxy Error',
        message: error.message,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Ledger Auto-Restart Proxy listening on port ${PORT}`);
});
