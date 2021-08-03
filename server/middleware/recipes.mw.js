const Yup = require("yup");
const Filter = require("bad-words");
let filter = new Filter();

module.exports = {
  validateRecipe: async (req, res, next) => {
    const { title, ingredients } = req.body;
    const RecipeSchema = Yup.object().shape({
      title: Yup.string()
        .min(4, "Title should be 4 characters or more")
        .max(16, "Title should be 16 characters or less")
        .matches(
          /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
          "Title should only contain letters"
        )
        .required("Required"),
      ingredients: Yup.array()
        .of(
          Yup.string()
            .min(3, "Ingredients should be 3 characters or more")
            .max(15, "Ingredients should be 15 characters or less")
            .required("Required")
        )
        .min(3, "List at least three ingredients")
        .max(8, "8 ingredients max")
        .required("Required"),
    });
    try {
      await RecipeSchema.validate({
        title,
        ingredients,
      });
      return next();
    } catch ({ errors }) {
      return res.status(400).json({ error: errors });
    }
  },
  checkForProfanity: (req, res, next) => {
    const { title, ingredients } = req.body;
    if (!title && !ingredients) {
      return next();
    }
    if (!ingredients) {
      const profaneTitle = title
        .split(" ")
        .some((word) => filter.isProfane(word));
      if (profaneTitle) {
        return res.status(400).json({
          profaneTitle: "Inappropriate recipe title",
        });
      }
      return next();
    }
    if (!title) {
      const profaneIngredient = ingredients
        .map((ingredient) => ingredient.split(" ").slice(1))
        .some((ingredient) => filter.isProfane(ingredient));
      if (profaneIngredient) {
        return res.status(400).json({
          profaneIngredient: "Inappropriate recipe ingredient",
        });
      }
      return next();
    }
    const profaneTitle = title
      .split(" ")
      .some((word) => filter.isProfane(word));
    const profaneIngredient = ingredients
      .map((ingredient) => ingredient.split(" ").slice(1))
      .some((ingredient) => filter.isProfane(ingredient));
    if (profaneTitle && profaneIngredient) {
      return res.status(400).json({
        profaneTitle: "Inappropriate recipe title",
        profaneIngredient: "Inappropriate recipe ingredient",
      });
    }
    if (profaneTitle) {
      return res.status(400).json({
        profaneTitle: "Inappropriate recipe title",
      });
    }
    if (profaneIngredient) {
      return res.status(400).json({
        profaneIngredient: "Inappropriate recipe ingredient",
      });
    }
    next();
  },
};
