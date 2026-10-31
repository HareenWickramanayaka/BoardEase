const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');

const makeToken = (u) =>
  jwt.sign(
    {
      id: u._id.toString(),
      name: u.name,
      role: u.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (
      !name?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '') ||
      (password || '').length < 6 ||
      !['student', 'owner'].includes(role)
    ) {
      return res.status(400).json({
        message: 'Enter a name, valid email, password (at least 6 characters) and account type.',
      });
    }

    if (await User.exists({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({
        message: 'This email is already registered.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, 10),
      role,
    });

    res.status(201).json({
      user: safeUser(user),
      token: makeToken(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: (req.body.email || '').toLowerCase().trim(),
    }).select('+password');

    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    res.json({
      user: safeUser(user),
      token: makeToken(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found.',
      });
    }

    res.json({
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();

    if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: 'Enter a valid name and email.',
      });
    }

    const taken = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (taken) {
      return res.status(409).json({
        message: 'Email address already in use.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Account not found.',
      });
    }

    res.json({
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must have at least 6 characters.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        message: 'Account not found.',
      });
    }

    const valid = await bcrypt.compare(currentPassword || '', user.password);

    if (!valid) {
      return res.status(400).json({
        message: 'Current password is incorrect.',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: 'Password changed successfully.',
    });
  } catch (err) {
    next(err);
  }
};
