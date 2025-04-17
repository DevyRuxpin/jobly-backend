const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const INTERVAL = 14 * 60 * 1000; // 14 minutes (just under the 15-minute sleep threshold)

async function checkHealth() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log(`Health check successful at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Run immediately
checkHealth();

// Then run every INTERVAL milliseconds
setInterval(checkHealth, INTERVAL);

console.log(`Starting health checks for ${BACKEND_URL} every ${INTERVAL/1000/60} minutes`); 