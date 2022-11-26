import { ofetch } from "ofetch";
import React, { createContext, useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
    children: React.ReactNode;
};

export interface User {
    uid: number;
    email: string;
}

export interface AuthContext {
    accessToken: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

interface AuthResponse {
    data: string;
}

const AuthContext = createContext<AuthContext>(null!);

const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const token = localStorage.getItem("access_token");
        return token || null;
    });

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("access_token", accessToken);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [accessToken]);

    const login = async (email: string, password: string) => {
        try {
            const { data: accessToken } = await ofetch<AuthResponse>(
                "/api/Auth/login",
                {
                    method: "POST",
                    body: {
                        email,
                        password,
                    },
                }
            );

            setAccessToken(accessToken);
        } catch (error) {
            console.log(error?.data);
            throw error;
        }
    };

    const logout = () => {
        setAccessToken(null);
    };

    const { data: user, error } = useSWR<User>(
        !accessToken ? null : { url: "/api/Auth/user", accessToken },
        ({ url, accessToken }) =>
            ofetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((res) => res.data)
    );

    const loading = !user && !error;
    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                accessToken,
                login,
                logout,
                loading: !accessToken ? false : loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

// Helpers

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

export const useUser = () => useAuth().user;
