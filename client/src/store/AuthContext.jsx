import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = user?.role || "guest";
  const isAdmin = role === "admin";

  // 🔹 Centralized error handler
  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || fallback;

  // 🔹 Check auth (memoized)
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  // 🔹 Register
  const register = async (name, email, password, confirmPassword) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Registration failed"),
      };
    }
  };

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Login failed"),
      };
    }
  };

  // 🔹 Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
