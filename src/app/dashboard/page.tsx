"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

interface QuietHour {
    _id: string;
    startTime: string;
    endTime: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [quietHours, setQuietHours] = useState<QuietHour[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = "/auth/login";
                return;
            }
            setUser(user);
        };
        
        const fetchQuietHours = async () => {
            const res = await fetch("/api/quiet-hours");
            if (res.ok) {
                const { data } = await res.json();
                setQuietHours(data || []);
            }
        };

        getUser();
        fetchQuietHours();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/quiet-hours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startTime, endTime }),
        });

        if (res.ok) {
            const { data } = await res.json();
            setQuietHours([...quietHours, data]);
            setStartTime("");
            setEndTime("");
        } else {
            const { error } = await res.json();
            alert(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/quiet-hours?id=${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setQuietHours(quietHours.filter(qh => qh._id !== id));
        } else {
            const { error } = await res.json();
            alert(error);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">
                Hi, {user.email?.split("@")[0] || "User"}!
            </h1>

            <div className="bg-white p-6 rounded shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Create Quiet Hours</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Quiet Hours"}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Quiet Hours</h2>
                {quietHours.length === 0 ? (
                    <p className="text-gray-500">No quiet hours scheduled yet.</p>
                ) : (
                    <div className="space-y-2">
                        {quietHours.filter(qh => qh).map((qh) => (
                            <div key={qh._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{qh.startTime} - {qh.endTime}</span>
                                <button
                                    onClick={() => handleDelete(qh._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}