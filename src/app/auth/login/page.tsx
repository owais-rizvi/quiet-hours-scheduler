"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Login successful!");
                router.push("/dashboard");
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                    required
                />
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                    required
                />
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                
                {message && (
                    <p className={`mt-4 text-center ${message.includes("error") || message.includes("Invalid") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}
                
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/auth/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}