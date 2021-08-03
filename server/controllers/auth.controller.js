const { createHash } = require("crypto");
const sgMail = require("@sendgrid/mail");
const User = require("../models/User.model.js");
const { sendToken, handleExistingUser } = require("../utils/auth.utils");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ emailAuth: "No account was found with that email" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ passwordAuth: `Incorrect password for ${email}` });
      }
      sendToken(res, 200, user);
    } catch ({ message }) {
      res.status(500).send(message);
    }
  },
  register: async (req, res) => {
    const { fullName, username, email, password, selectedAvatar } = req.body;
    try {
      // Find user by email or username (no duplicate accounts)
      let user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (user) {
        return handleExistingUser(user, username, email, res);
      }

      user = await User.create({
        fullName,
        username,
        email,
        password,
        selectedAvatar,
      });
      sendToken(res, 201, user);
    } catch ({ message }) {
      res.status(500).send(message);
    }
  },
  googleAuth: async (req, res) => {
    const { email } = req.body;
    try {
      // find user by email
      const user = await User.findOne({ email });
      // if user exists, login
      if (user) {
        const token = await user.getSignedJwtToken();
        return res.status(200).json({
          token: `Bearer ${token}`,
          userExists: true,
        });
      }
      return res.status(404).json({ userExists: false });
    } catch ({ message }) {
      res.status(500).send(message);
    }
  },
  forgotPassword: async (req, res) => {
    // Send Email to email provided but first check if user exists
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ emailAuth: "No account was found with that email" });
      }
      const username = user.username;
      // Reset Token Gen and add to database hashed (private) version of token
      const resetToken = user.getResetPasswordToken();
      await user.save();
      // Create reset url to email to provided email
      const resetUrl = `${process.env.ORIGIN_URL}/resetpassword/${resetToken}`;
      // Text Message
      const text = `
    Hi, @${username},
    please go to the following link to reset your password:
    ${resetUrl}
    `;
      // HTML Message
      const html = `
      <p>Hi @${username},</p>
      <p>Please go to the following link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send({
          to: user.email,
          from: process.env.EMAIL_FROM,
          subject: "Password Reset Request",
          text,
          html,
        });
        res.status(200).json({ isEmailSent: true });
      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({ isEmailSent: false });
      }
    } catch ({ message }) {
      res.status(500).send(message);
    }
  },
  resetPassword: async (req, res) => {
    // Compare token in URL params to hashed token
    const resetPasswordToken = createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({
          invalidToken: "Visit the Forgot Password page to reset your password",
        });
      }
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(201).json({ isPasswordReset: true });
    } catch ({ message }) {
      res.status(500).send(message);
    }
  },
};
