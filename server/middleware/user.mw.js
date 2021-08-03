const { verify } = require("jsonwebtoken");
const Yup = require("yup");
const Filter = require("bad-words");
let filter = new Filter();

module.exports = {
  verifyAuthorization: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user = verify(token, process.env.JWT_SECRET);
      req.body.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },
  validateUsername: async (req, res, next) => {
    const { username } = req.body;
    const RegisterSchema = Yup.object().shape({
      username: Yup.string()
        .min(5, "Username should be 5 characters or more")
        .max(8, "Username should be 8 characters or less")
        .required("Required"),
    });
    try {
      await RegisterSchema.validate({
        username,
      });
      if (filter.isProfane(username)) {
        return res.status(400).json({ error: "Username contains profanity" });
      }
      return next();
    } catch ({ errors }) {
      return res.status(400).json({ error: errors });
    }
  },
};
