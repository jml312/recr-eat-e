import HomeNav from "components/HomeNav";
import NotFound from "components/NotFound";
import PrivateRoute from "components/PrivateRoute";
import { logoutUser, setCurrentUser } from "features/auth/auth.slice";
import jwt_decode from "jwt-decode";
import React, { lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Home from "features/recipes/Home";

// auth
const Login = lazy(() => import("features/auth/Login"));
const Register = lazy(() => import("features/auth/Register"));
const ForgotPassword = lazy(() => import("features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("features/auth/ResetPassword"));
// recipe
const MyLikes = lazy(() => import("features/recipes/MyLikes"));
const MyRecipes = lazy(() => import("features/recipes/MyRecipes"));
const CreateRecipe = lazy(() => import("features/recipes/CreateRecipe"));
const EditRecipe = lazy(() => import("features/recipes/EditRecipe"));
const Top3Recipes = lazy(() => import("features/recipes/Top3Recipes"));
// profile
const MyProfile = lazy(() => import("features/user/MyProfile"));
const UserProfile = lazy(() => import("features/user/UserProfile"));
const UserRecipes = lazy(() => import("features/user/UserRecipes"));
const UserLikes = lazy(() => import("features/user/UserLikes"));

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.token;
    // Check for token to keep user logged in
    if (token) {
      try {
        // Decode token and get user info and exp
        const { exp, notifications, ...rest } = jwt_decode(token);
        localStorage.hasReadNotifications =
          localStorage.hasReadNotifications || notifications.length === 0;
        // Set user and isAuthenticated
        dispatch(setCurrentUser({ notifications, ...rest }));
        // Check for expired token
        const currentTime = Date.now() / 1000; // to get in milliseconds
        if (exp < currentTime) {
          // Logout user
          dispatch(logoutUser());
          // Redirect to login
          history.push("/");
        }
      } catch {
        // Logout user
        dispatch(logoutUser());
        // Redirect to login
        history.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authRoutes = [
    {
      path: "/",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/forgotpassword",
      Component: ForgotPassword,
    },
    {
      path: "/resetpassword/:resetToken",
      Component: ResetPassword,
    },
  ];

  const privateRoutes = [
    {
      path: "/home",
      Component: Home,
    },
    {
      path: "/top-3",
      Component: Top3Recipes,
    },
    {
      path: "/my-likes",
      Component: MyLikes,
    },
    {
      path: "/my-recipes",
      Component: MyRecipes,
    },
    {
      path: "/profile/me",
      Component: MyProfile,
    },
    {
      path: "/create",
      Component: CreateRecipe,
    },
    {
      path: "/edit/:recipeId",
      Component: EditRecipe,
    },
    {
      path: "/profile/:username",
      Component: UserProfile,
    },
    {
      path: "/profile/:username/recipes",
      Component: UserRecipes,
    },
    {
      path: "/profile/:username/likes",
      Component: UserLikes,
    },
  ];

  return (
    <Switch>
      {/* auth routes */}
      {authRoutes.map(({ path, Component }, i) => (
        <Route exact path={path} component={Component} key={i} />
      ))}
      {/* private routes */}
      <PrivateRoute path={privateRoutes.map(({ path }) => path)}>
        <HomeNav>
          <Switch>
            {privateRoutes.map(({ path, Component }, i) => (
              <PrivateRoute exact path={path} Component={Component} key={i} />
            ))}
          </Switch>
        </HomeNav>
      </PrivateRoute>
      {/* not found */}
      <Route path="/404" component={NotFound} />
      <Redirect to="/404" />
    </Switch>
  );
};

export default App;
