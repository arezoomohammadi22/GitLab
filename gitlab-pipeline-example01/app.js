
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Use morgan for request logging
app.use(morgan('combined'));

// Default route
app.get('/', (req, res) => {
  res.send('Hello, GitLab CI/CD with a bit more complexity!');
});

// Additional route
app.get('/about', (req, res) => {
  res.send('This is a more complex Node.js application with additional routes.');
});

// Environment-specific route
app.get('/env', (req, res) => {
  res.send(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
