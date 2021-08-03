const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const RecipeSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "Users",
  },
  username: {
    type: String,
    ref: "Users",
  },
  title: { type: String, unique: true },
  cuisine: {
    type: String,
    enum: [
      "Mexican",
      "Italian",
      "American",
      "Indian",
      "Greek",
      "French",
      "Spanish",
      "Thai",
      "Vietnamese",
      "Japanese",
      "Korean",
      "Chinese",
      "Russian",
    ],
  },
  ingredients: [String],
  likeCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  likedBy: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

RecipeSchema.pre("save", function (next) {
  this.likeCount = this.likedBy.length;
  next();
});

module.exports = Recipe = model("Recipes", RecipeSchema);
