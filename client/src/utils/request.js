import axios from "axios";

// Create an Axios Client with defaults
const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE_URL });

// Request Wrapper with default success/error actions
const request = async function (options, withAuthorization = false) {
  try {
    const { data } = withAuthorization
      ? await client({
          headers: { Authorization: `${localStorage.token}` },
          ...options,
        })
      : await client(options);
    return data;
  } catch (error) {
    return Promise.reject(error.response || error.message);
  }
};

export default request;
