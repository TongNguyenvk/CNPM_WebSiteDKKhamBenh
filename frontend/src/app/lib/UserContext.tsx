"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "./api";

interface UserContextType {
    user: any;
    roleId: string;
    loading: boolean;
    refresh: () => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    roleId: "",
    loading: true,
    refresh: () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [roleId, setRoleId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setRoleId("");
            setLoading(false);
            return;
        }
        try {
            const profile = await getUserProfile(token);
            setUser(profile);
            setRoleId(profile.roleId);
        } catch {
            setUser(null);
            setRoleId("");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, roleId, loading, refresh: fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext); 