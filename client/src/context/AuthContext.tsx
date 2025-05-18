import { createContext, useEffect, useState, ReactNode } from "react";
import { Role } from "../data";
interface AuthContextType {
  isLoggedin: boolean;
  username: string | null;
  userid:string ;
  userRole:string;
  checkAuth: () => void;
  logout: () => Promise<void>;
  setIsLoggedin: (value: boolean) => void;
}
const url=import.meta.env.VITE_SERVER_URL
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userid,setID]=useState<string>('guest');
  const [userRole,setRole]=useState<Role>(Role.guest);

  // Fetch auth status ONCE when the app loads
  const checkAuth = async () => {
    try {
      const response = await fetch(`${url}/auth-status`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoggedin(data.isLoggedin);
        setUsername(data.username);
        setID(data.id)
        setRole(data.role)
        
      } else {
        setIsLoggedin(false);
        setUsername(null);
        setID('guest');
        setRole(Role.guest)
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedin(false);
    }
  };

  useEffect(() => {
    checkAuth(); // Call on mount
  }, []);

  // Logout function (updates global state)
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        credentials: "include",
      });
      setIsLoggedin(false);
      setUsername(null);
      setID('guest')
      setRole(Role.guest)
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedin, username,userid,userRole, checkAuth, logout,setIsLoggedin}}>
      {children}
    </AuthContext.Provider>
  );
}
