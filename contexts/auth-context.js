"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// GraphQL queries and mutations
const ME_QUERY = gql`
    query Me {
        me {
            id
            first_name
            last_name
            userType
            email
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                id
                first_name
                last_name
                email
            }
        }
    }
`;

const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            token
            user {
                id
                first_name
                last_name
                email
            }
        }
    }
`;

// Create auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch current user data
    const { refetch } = useQuery(ME_QUERY, {
        onCompleted: (data) => {
            if (data?.me) {
                setUser(data.me);
            }
            setLoading(false);
        },
        onError: () => {
            setUser(null);
            setLoading(false);
        },
    });

    // Login mutation
    const [loginMutation] = useMutation(LOGIN_MUTATION);

    // Register mutation
    const [registerMutation] = useMutation(REGISTER_MUTATION);

    // Check for token on mount
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        console.log("Login request received", email, password);
        try {
            const { data } = await loginMutation({
                variables: {
                    input: { email, password },
                },
            });

            if (data?.login) {
                const { token, user } = data.login;
                Cookies.set("token", token, { expires: 7 }); // 7 days expiry
                setUser(user);
                return { success: true };
            }

            return { success: false, message: "Login failed" };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message:
                    error.graphQLErrors?.[0]?.message ||
                    "Login failed. Please try again.",
            };
        }
    };

    // Register function
    const register = async ({ first_name, last_name, email, password }) => {
        try {
            const { data } = await registerMutation({
                variables: {
                    input: {
                        first_name,
                        last_name,
                        email,
                        password,
                    },
                },
            });

            if (data?.register) {
                const { token, user } = data.register;
                Cookies.set("token", token, { expires: 7 }); // 7 days expiry
                setUser(user);
                return { success: true };
            }

            return { success: false, message: "Registration failed" };
        } catch (error) {
            return {
                success: false,
                message:
                    error.graphQLErrors?.[0]?.message ||
                    "Registration failed. Please try again.",
            };
        }
    };

    // Logout function
    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/");
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const { data } = await refetch();
            if (data?.me) {
                setUser(data.me);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
