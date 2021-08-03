import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";

const PrivateRoute = ({ Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { pathname } = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", from: pathname }} />
        )
      }
    />
  );
};

export default PrivateRoute;
