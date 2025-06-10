import { createContext, useEffect, useState, ReactNode } from "react";
import { Role } from "../data";
import { useQueryClient } from "@tanstack/react-query";

const url = import.meta.env.VITE_SERVER_URL;

interface AuthContextType {
  isLoggedin: boolean;
  username: string | null;
  userid: string;
  userRole: string;
  loading: boolean; // ✅ NEW
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setIsLoggedin: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userid, setID] = useState<string>('guest');
  const [userRole, setRole] = useState<Role>(Role.guest);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const queryclient = useQueryClient();

const checkAuth = async (): Promise<void> => {
  try {
    const response = await fetch(`${url}/auth-status`, {
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      setIsLoggedin(data.isLoggedin);
      setUsername(data.username);
      setID(data.id);
      setRole(data.role);
    } else {
      setIsLoggedin(false);
      setUsername(null);
      setID('guest');
      setRole(Role.guest);
    }
  } catch (error) {
    console.error("Error checking auth:", error);
    setIsLoggedin(false);
  } finally {
    setLoading(false); // ✅ Important!
  }
};


  useEffect(() => {
    checkAuth();
    // ✅ Only run once on mount
  }, []);

  const logout = async () => {
    try {
      await fetch(`${url}/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      setIsLoggedin(false);
      setUsername(null);
      setID('guest');
      setRole(Role.guest);
      queryclient.invalidateQueries();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedin, username, userid, userRole, checkAuth, logout, setIsLoggedin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
