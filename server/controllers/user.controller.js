const User = require("../models/User.model.js");
const Recipe = require("../models/Recipe.model.js");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = {
  getCurrentUser: async (req, res) => {
    const {
      user: { _id },
    } = req.body;
    try {
      const user = await User.findById(_id).select(["-password", "-__v"]);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getUserByUsername: async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username }).select([
        "-notifications",
        "-email",
        "-password",
        "-__v",
      ]);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  clearNotifications: async (req, res) => {
    const {
      user: { _id },
    } = req.body;
    try {
      await User.findByIdAndUpdate(_id, {
        notifications: [],
      });
      res.status(200).json({ msg: "Notifications cleared" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateAccount: async (req, res) => {
    const {
      username,
      selectedAvatar,
      user: { _id },
    } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      // update user
      if (username) {
        user.username = username;
      }
      if (selectedAvatar) {
        user.selectedAvatar = selectedAvatar;
      }
      await user.save();
      // update recipe usernames
      await Recipe.updateMany({ userId: _id }, { username });
      res.status(200).json({ token: user.getSignedJwtToken() });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  handleFollow: async (req, res) => {
    const {
      user: { _id },
      userId,
      following,
    } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      const userToFollow = await User.findById(userId);
      if (!userToFollow) {
        return res.status(400).json({ error: "No user found" });
      }
      // handle following for user
      const userFollowing = following
        ? [
            ...user.following,
            {
              username: userToFollow.username,
              selectedAvatar: userToFollow.selectedAvatar,
            },
          ]
        : user.following.filter(
            (user) => user.username !== userToFollow.username
          );
      user.following = userFollowing;
      await user.save();
      // handle followers for other user, and notifications
      const userToFollowFollowers = following
        ? [
            ...userToFollow.followers,
            { username: user.username, selectedAvatar: user.selectedAvatar },
          ]
        : userToFollow.followers.filter(
            (_user) => _user.username !== user.username
          );
      userToFollow.followers = userToFollowFollowers;

      if (following) {
        if (userToFollow.notifications.length === 0) {
          userToFollow.notifications.push({
            username: user.username,
            notificationType: "Like",
          });
        } else if (
          !userToFollow.notifications.some(
            (notification) =>
              notification.username === user.username &&
              notification.notificationType === "Follow"
          )
        ) {
          userToFollow.notifications.push({
            username: user.username,
            notificationType: "Follow",
          });
        }
      }
      await userToFollow.save();
      res.status(200).json({ userToFollowFollowers, following });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteLikes: async (req, res) => {
    const {
      user: { _id, username },
      userLikes,
    } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      // remove all likes from user
      user.likes = [];
      await user.save();
      // remove likeBy user from recipesAPI
      const recipeIds = userLikes.map((recipe) => ObjectId(recipe.userId));
      await Recipe.updateMany(
        {
          userId: {
            $in: recipeIds,
          },
        },
        {
          $pull: {
            likedBy: username,
          },
          $inc: {
            likeCount: -1,
          },
        }
      );
      res.status(200).json({ msg: "Likes removed" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteRecipes: async (req, res) => {
    const {
      user: { _id },
    } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      // delete user recipes
      user.recipes = [];
      await user.save();
      // remove all recipes from user
      await Recipe.deleteMany({ userId: ObjectId(_id) });
      // remove likes from any user
      await User.updateMany(
        {
          likes: { $elemMatch: { userId: ObjectId(_id) } },
        },
        { $pull: { likes: { userId: ObjectId(_id) } } }
      );
      res.status(200).json({ msg: "Recipes removed" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteAccount: async (req, res) => {
    const {
      user: { _id },
    } = req.body;
    try {
      // remove user
      const user = await User.findByIdAndDelete(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      // remove recipes
      await Recipe.deleteMany({ userId: ObjectId(_id) });
      // remove any user likes
      await User.updateMany(
        {
          likes: { $elemMatch: { userId: ObjectId(_id) } },
        },
        { $pull: { likes: { userId: ObjectId(_id) } } }
      );
      res.status(200).json({ msg: "Account removed" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
