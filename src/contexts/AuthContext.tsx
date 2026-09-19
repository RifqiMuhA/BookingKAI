"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData?: { name?: string; email?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const savedLogin = localStorage.getItem("mock_auth_is_logged_in");
      const savedUser = localStorage.getItem("mock_auth_user");
      if (savedLogin === "true") {
        setIsLoggedIn(true);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser({ name: "Pengguna KAI", email: "user@email.com" });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (userData?: { name?: string; email?: string }) => {
    const finalUser = {
      name: userData?.name || user?.name || "Pengguna KAI",
      email: userData?.email || user?.email || "user@email.com",
    };
    setIsLoggedIn(true);
    setUser(finalUser);
    try {
      localStorage.setItem("mock_auth_is_logged_in", "true");
      localStorage.setItem("mock_auth_user", JSON.stringify(finalUser));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.setItem("mock_auth_is_logged_in", "false");
      localStorage.removeItem("mock_auth_user");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
