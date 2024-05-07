// app.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: "Regov"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// User registration
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const user = { username, email, password: hash };
    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

//Update profile
app.post('/api/profile/update', (req, res) => {
  const { username, email, password, aboutMe } = req.body;
  // Update user profile data in the database (e.g., using ORM or raw SQL queries)
  db.run(
    `UPDATE users 
     SET password = ?, aboutMe = ?
     WHERE username = ? OR email = ?`,
    [password, aboutMe, username, email],
    function (err) {
      if (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json({ message: 'User profile updated successfully' });
      }
    }
  );
  
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
});

const blacklistedTokens = new Set();
app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  blacklistedTokens.add(token);
  res.send('Logged out');
});

// Middleware to check for blacklisted tokens
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (blacklistedTokens.has(token)) {
      return res.status(401).send('Token blacklisted');
  }
  next();
});


// Middleware to verify JWT tokens for protected routes
const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;
  
    // Check if token is provided
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
  
      // Attach the decoded user information to the request object
      req.user = decoded;
      next();
    });
  };
  

// Protected route example (optional)
app.get('/api/profile', verifyToken, (req, res) => {
  // Your protected route logic here
  const userProfile = fetchUserProfile(req.user.id);

  // Return user profile as response
  res.json(userProfile);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
