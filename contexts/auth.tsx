import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import Loading from "components/shared/Loading/Loading";
import userService from "services/userService";
import tokenService from "services/tokenService";

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: null,
  logout: null,
  signup: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function decodeAccessToken() {
      try {
        const user = await tokenService.decodeAccessToken();
        setUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    decodeAccessToken();
  }, []);

  const login = async (user) => {
    const userData = await userService.login(user);
    setUser(userData);
    router.push("/");
  };

  const logout = async () => {
    await userService.logout();
    router.push("/login");
    setUser(null);
  };

  const signup = async (user) => {
    const userData = await userService.signup(user);
    setUser(userData);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
        signup,
      }}
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
    return <Loading />;
  }

  if (!isLoading && notAllowed) {
    router.push("/login");
  }

  return children;
};
