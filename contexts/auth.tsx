import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import userService from "services/userService";
import tokenService from "services/tokenService";

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: null,
  signup: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function decodeAccessToken() {
      try {
        const user = await tokenService.decodeAccessToken();
        setUser(user);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    decodeAccessToken();
  }, []);

  const login = async (user) => {
    const userData = await userService.login(user);
    setUser(userData);
  };

  const signup = async (user) => {
    const userData = await userService.signup(user);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, isLoading, login, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const allowedRoutes = ["/login", "/signup"];
  const notAllowed =
    !isAuthenticated && !allowedRoutes.includes(router.pathname);

  if (isLoading) {
    return "Wait for it...";
  }

  if (!isLoading && notAllowed) {
    router.push("/login");
  }

  return children;
};
