import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAccessToken, clearTokens } from "@/service/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const accessToken = getAccessToken();

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                console.log("🎯 Decoded Token:", decoded);
                setUser({ username: decoded.sub, role: decoded.role });
                setToken(accessToken);
            } catch (e) {
                console.error("❌ Token decode edilemedi:", e);
                clearTokens();
                setUser(null);
                setToken(null);
            } finally {
                setIsInitialized(true);
            }
        } else {
            setIsInitialized(true); // token hiç yoksa da set et
        }
    }, []);






    const logout = () => {
        clearTokens();
        setUser(null);
        setToken(null);
        // window.location.href = "/auth/sign-in";
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setToken,
                setUser,
                logout,
                isInitialized,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
