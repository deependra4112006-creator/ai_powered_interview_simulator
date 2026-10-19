import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbStore from '../services/dbStore.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'interviewai_super_secret_jwt_key_2026_dev_secure';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, experienceLevel, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existing = await dbStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbStore.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Frontend Developer',
      experienceLevel: experienceLevel || 'Fresher / Entry Level',
      skills: skills || ['JavaScript', 'React', 'HTML/CSS', 'Git'],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    const userId = user._id || user.id;
    const token = generateToken(userId);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId);

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// 1-Click Guest Login for seamless testing
export const guestLogin = async (req, res) => {
  try {
    await dbStore.seedDefaultData();
    const demoUser = await dbStore.findUserByEmail('alex.chen@interviewai.demo');
    if (!demoUser) {
      return res.status(500).json({ success: false, message: 'Demo account not initialized.' });
    }

    const userId = demoUser._id || demoUser.id;
    const token = generateToken(userId);

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        experienceLevel: demoUser.experienceLevel,
        skills: demoUser.skills,
        avatar: demoUser.avatar
      }
    });
  } catch (err) {
    console.error('Guest login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during demo login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    return res.json({
      success: true,
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        experienceLevel: req.user.experienceLevel,
        skills: req.user.skills,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching user.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, role, experienceLevel, skills, avatar } = req.body;

    const updated = await dbStore.updateUser(userId, {
      ...(name && { name }),
      ...(role && { role }),
      ...(experienceLevel && { experienceLevel }),
      ...(skills && { skills }),
      ...(avatar && { avatar })
    });

    return res.json({
      success: true,
      user: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        experienceLevel: updated.experienceLevel,
        skills: updated.skills,
        avatar: updated.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await dbStore.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.password && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbStore.updateUser(userId, { password: hashedPassword });

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating password.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await dbStore.deleteUser(userId);
    return res.json({ success: true, message: 'Account and associated interview records deleted permanently.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting account.' });
  }
};

