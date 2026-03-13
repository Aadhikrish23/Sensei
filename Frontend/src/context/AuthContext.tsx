import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import auth from "../api/auth.api";
import tokenServices from "../utils/tokenServices";

type AuthContextType = {
  accessToken: string | null;

  user: User | null;

  login: (email: string, password: string) => Promise<string>;
  refresh: () => Promise<void>;
  hasAttemptedRefresh: boolean;
  verify: (token: string) => Promise<void>;
  logout: () => void;
};
interface User {
  userid: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<string> => {
    const userdata = await auth.userlogin(email, password);
    console.log("usedata:", userdata);
    if (!userdata.Data.isEmailVerified) {
      return userdata.Data.status;
    }
    if (!userdata.Data.accessToken || !userdata.Data.id) {
      throw new Error("Access token missing");
    }
    setAccessToken(userdata.Data.accessToken);
    setUser({ userid: userdata.Data.id });
    tokenServices.setToken(userdata.Data.accessToken);
    console.log("Setting token:", userdata.Data.accessToken);
    console.log("After setting:", accessToken);
    return userdata.Status;
  };
  const logout = async () => {
    const userdata = await auth.userLogout();
    setAccessToken(null);
    setUser(null);
    tokenServices.clearToken();
  };
  const verify = async (token: string): Promise<void> => {
    const userdata = await auth.userVerify(token);
    console.log("usedata:", userdata);
    if (!userdata.Data.accessToken || !userdata.Data.id) {
      throw new Error("Access token missing");
    }
    setAccessToken(userdata.Data.accessToken);
    setUser({ userid: userdata.Data.id });
    tokenServices.setToken(userdata.Data.accessToken);
    console.log("Setting token:", userdata.Data.accessToken);
    console.log("After setting:", accessToken);
  };
  const refresh = async (): Promise<void> => {
    const storedToken = tokenServices.getToken();

    if (!storedToken) {
      setHasAttemptedRefresh(true);
      return;
    }

    const userdata = await auth.userRefresh();
    if (!userdata.Data.accessToken || !userdata.Data.id) {
      throw new Error("Access token missing");
    }
    setAccessToken(userdata.Data.accessToken);
    setUser({ userid: userdata.Data.id });
    tokenServices.setToken(userdata.Data.accessToken);
  };
  useEffect(() => {
    tokenServices.registerLogout(logout);

    return () => {
      tokenServices.registerLogout(null);
    };
  }, []);
  const hasInitialized = useRef(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      try {
        const userdata = await auth.userRefresh();

        if (userdata.Data.accessToken && userdata.Data.id) {
          setAccessToken(userdata.Data.accessToken);
          setUser({ userid: userdata.Data.id });
          tokenServices.setToken(userdata.Data.accessToken);
        }
      } catch {
        // ignore
      } finally {
        setHasAttemptedRefresh(true);
      }
    };

    initialize();
  }, []);
  console.log("Provider accessToken:", accessToken);
  console.log("State variable accessToken:", accessToken);
  console.log("Setter exists:", typeof setAccessToken);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        refresh,
        hasAttemptedRefresh,
        verify,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
