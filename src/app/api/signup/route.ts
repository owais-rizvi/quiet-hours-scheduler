import { createClient } from "../../utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface SignUpRequest {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    let body: SignUpRequest;
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
    
    const { data, error } = await supabase.auth.signUp({
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
        { message: "Check your email to confirm your account", user: data.user },
        { status: 200 }
    );
}