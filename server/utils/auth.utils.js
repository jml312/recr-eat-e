module.exports = {
  sendToken: async (res, statusCode, user) => {
    const token = await user.getSignedJwtToken();
    res.status(statusCode).json({
      token: `Bearer ${token}`,
    });
  },
  handleExistingUser: (user, username, email, res) => {
    const usernameExists = user.username === username;
    const emailExists = user.email === email;
    if (usernameExists && emailExists) {
      return res.status(400).json({
        usernameExists: `An account with that username already exists`,
        emailExists: `An account with that email already exists`,
      });
    }
    return usernameExists
      ? res.status(400).json({
          usernameExists: `An account with that username already exists`,
        })
      : res.status(400).json({
          emailExists: `An account with that email already exists`,
        });
  },
};
