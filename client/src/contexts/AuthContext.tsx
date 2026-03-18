import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthUser {
    id: number;
    name: string;
    email: string;
    type: string;
    imageUrl?: string;
}

interface AuthContextType {
    token: string | null;
    user: AuthUser | null;
    login: (token: string, user: AuthUser) => void;
    updateUser: (updatedUser: AuthUser) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token")
    );
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = (newToken: string, newUser: AuthUser) => {
        setToken(newToken);
        setUser(newUser);
    };

    const updateUser = (updatedUser: AuthUser) => {
        setUser(updatedUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, user, login, updateUser, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
