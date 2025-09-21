"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
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
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => router.push("/auth/login"), 2000);
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
                <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
                
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
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
                
                {message && (
                    <p className={`mt-4 text-center ${message.includes("error") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}
                
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}