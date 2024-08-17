import React, { createContext, useContext, useEffect, useState } from "react";
import {API_BASE_URL} from "../src/utils/variables";

interface AuthContextType {
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    // Replace this with your actual login API call
    const url = API_BASE_URL+"/login";
    const data = { email, password };

    try {
      // Simulate a successful login
      // You should replace this with your actual login API call
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json', "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        setAuthenticated(true);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw new Error("Error during login");
    }
  };

  const logout = () => {
    // Replace this with your actual logout API call
    // Set authenticated to false after successful logout
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
