import request from "utils/request";

// takes an email and password
export const login = (data) => {
  return request({
    url: "auth/login",
    method: "POST",
    data,
  });
};

// takes register info
export const register = (data) => {
  return request({
    url: "auth/register",
    method: "POST",
    data,
  });
};

export const googleAuth = (data) => {
  return request({
    url: "auth/googleauth",
    method: "POST",
    data,
  });
};

// takes an email
export const forgotPassword = (data) => {
  return request({
    url: "auth/forgotpassword",
    method: "POST",
    data,
  });
};

// takes a reset token and a new password
export const resetPassword = ({ resetToken, ...data }) => {
  return request({
    url: `auth/resetpassword/${resetToken}`,
    method: "PATCH",
    data,
  });
};