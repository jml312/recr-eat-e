const Yup = require("yup");
const fetch = require("node-fetch");
const Filter = require("bad-words");
let filter = new Filter();

module.exports = {
  validateLoginInput: async (req, res, next) => {
    const { email, password } = req.body;
    const LoginSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
    });
    try {
      await LoginSchema.validate({ email, password });
      return next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  validateRegisterInput: async (req, res, next) => {
    const { fullName, username, email, password } = req.body;
    const RegisterSchema = Yup.object().shape({
      fullName: Yup.string()
        .min(4, "Full name should be 4 characters or more")
        .max(14, "Full name should be 14 characters or less")
        .matches(/^[a-zA-Z]+$/, "Full name should only contain letters")
        .required("Required"),
      username: Yup.string()
        .min(5, "Username should be 5 characters or more")
        .max(8, "Username should be 8 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "Password should be 8 characters or more")
        .required("Required"),
    });
    try {
      await RegisterSchema.validate({
        fullName: fullName.replace(/\s+/g, ""),
        username,
        email,
        password,
      });
      return next();
    } catch ({ errors }) {
      return res.status(400).json({ error: errors });
    }
  },
  checkForProfanity: (req, res, next) => {
    const { username, fullName } = req.body;
    //splitting by characters
    let [firstName, lastName] = fullName.split(" ");
    firstName = firstName.split(/[^A-Za-z]/).join("");
    lastName = lastName.split(/[^A-Za-z]/).join("");
    const strippedUsername = username.split(/[^A-Za-z]/).join(" ");
    // check for profanity
    const profaneFirstName = filter.isProfane(firstName);
    const profaneLastName = filter.isProfane(lastName);
    const profaneUsername = filter.isProfane(strippedUsername);
    // check all combos
    if (profaneFirstName && profaneLastName && profaneUsername) {
      return res.status(400).json({
        profaneFirstName: "Inappropriate first name",
        profaneLastName: "Inappropriate last name",
        profaneUsername: "Inappropriate username",
      });
    }
    if (profaneFirstName && profaneLastName) {
      return res.status(400).json({
        profaneFirstName: "Inappropriate first name",
        profaneLastName: "Inappropriate last name",
      });
    }
    if (profaneFirstName && profaneUsername) {
      return res.status(400).json({
        profaneFirstName: "Inappropriate first name",
        profaneUsername: "Inappropriate username",
      });
    }
    if (profaneLastName && profaneUsername) {
      return res.status(400).json({
        profaneLastName: "Inappropriate last name",
        profaneUsername: "Inappropriate username",
      });
    }
    if (profaneFirstName) {
      return res.status(400).json({
        profaneFirstName: "Inappropriate first name",
      });
    }
    if (profaneLastName) {
      return res.status(400).json({
        profaneLastName: "Inappropriate last name",
      });
    }
    if (profaneUsername) {
      return res.status(400).json({
        profaneUsername: "Inappropriate username",
      });
    }

    return next();
  },
  validateHuman: async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({ error: "Token is required" });
    }
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
      }
    );
    const { success } = await response.json();
    return success
      ? next()
      : res
          .status(404)
          .json({ error: "Error verifying reCAPTCHA, please try again." });
  },
};
