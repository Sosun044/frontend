// src/context/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        token,
        user,
        logout,
        setToken, // ✅ EKLE
        setUser,  // ✅ EKLE
        isInitialized,
    } = context;

    const hasRole = (allowedRoles = []) => {
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
    };

    return {
        token,
        user,
        logout,
        setToken,     // ✅ EKLE
        setUser,      // ✅ EKLE
        hasRole,
        isInitialized,
    };
};
