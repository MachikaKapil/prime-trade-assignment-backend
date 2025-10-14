// Load environment variables
require('dotenv').config();

const express = require('express');
const app = express();

// Access environment variables
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🔒 JWT_SECRET: ${JWT_SECRET}`);
  console.log(`⏱️ JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}`);
  console.log(`🧂 SALT_ROUNDS: ${SALT_ROUNDS}`);
});
