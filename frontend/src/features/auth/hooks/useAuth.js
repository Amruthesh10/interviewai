import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


 const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
        const data = await login({ email, password });

        // 🔥 IMPORTANT: ensure success only when valid
        if (!data || !data.user) {
            throw new Error("Invalid login response");
        }

        setUser(data.user);
        return data;

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        // 🔥 VERY IMPORTANT: throw proper error
        throw err?.response?.data || err;

    } finally {
        setLoading(false);
    }
};
    const handleRegister = async (userData) => {
    setLoading(true);

    try {
        const data = await register(userData);

        if (!data || !data.user) {
            throw new Error("Invalid register response");
        }

        setUser(data.user);
        return data;

    } catch (err) {
        console.error("REGISTER ERROR:", err);

        // 🔥 send backend message forward
        throw err?.response?.data || err;

    } finally {
        setLoading(false);
    }
};
    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}