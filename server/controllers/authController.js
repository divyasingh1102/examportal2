// server/controllers/authController.js
import { query } from '../db.js';
import { generateToken, hashPassword, comparePassword } from '../middleware/auth.js';

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const rows = await query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Optional role verification if specified
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account found, but you are not registered as an ${role}. Please check your login role.`
      });
    }

    const isMatch = comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login authentication.' });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = hashPassword(password);

    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), passwordHash, 'student']
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'student'
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to the Online Exam Portal.',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function getMe(req, res) {
  try {
    const rows = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}
