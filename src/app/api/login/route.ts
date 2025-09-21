import { createClient } from "../../utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    let body: LoginRequest;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const { email, password } = body;
    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { message: "Login successful", user: data.user },
        { status: 200 }
    );
}