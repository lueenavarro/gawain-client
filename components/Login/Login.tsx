import React from "react";
import GoogleLogin from "react-google-login";

const Login = () => {
  const responseGoogle = (response) => {
    console.log(response, "hello");
  };

  return (
    <GoogleLogin
      clientId="1057006530487-6uei7h2vbuk05mbq9sjqm9q7vv6aqdks.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    />
  );
};

export default Login
