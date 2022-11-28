import { FetchError, ofetch } from "ofetch";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import type { User } from "types/api";

type Props = {
    children: React.ReactNode;
};

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
            }).then((res) => res.data),
        {
            onError(err) {
                if (err instanceof FetchError) {
                    // API Returned 401 Unauthorized - Token is invalid, wipe it.
                    if (err.status === 401) {
                        logout();
                    }
                }
            },
        }
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};

export const useUser = () => useAuth().user;
export const useAccessToken = () => useAuth().accessToken;
