import { createClient } from "../../utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

interface QuietHoursRequest {
    startTime: string;
    endTime: string;
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function hasOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    
    return s1 < e2 && s2 < e1;
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: QuietHoursRequest;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { startTime, endTime } = body;
    if (!startTime || !endTime) {
        return NextResponse.json({ error: "Start time and end time are required" }, { status: 400 });
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("quiet-hours-scheduler");
        const collection = db.collection("quiet_hours");

        // Check for overlaps
        const existingHours = await collection.find({ userId: user.id }).toArray();
        
        for (const existing of existingHours) {
            if (hasOverlap(startTime, endTime, existing.startTime, existing.endTime)) {
                return NextResponse.json({ 
                    error: `Overlaps with existing quiet hours: ${existing.startTime} - ${existing.endTime}` 
                }, { status: 400 });
            }
        }

        const result = await collection.insertOne({
            userId: user.id,
            startTime,
            endTime,
            createdAt: new Date()
        });

        const newQuietHour = await collection.findOne({ _id: result.insertedId });
        
        return NextResponse.json({ data: newQuietHour }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function GET() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("quiet-hours-scheduler");
        const collection = db.collection("quiet_hours");

        const quietHours = await collection
            .find({ userId: user.id })
            .sort({ startTime: 1 })
            .toArray();

        return NextResponse.json({ data: quietHours }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("quiet-hours-scheduler");
        const collection = db.collection("quiet_hours");

        const { ObjectId } = await import('mongodb');
        const result = await collection.deleteOne({ 
            _id: new ObjectId(id),
            userId: user.id 
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Quiet hour not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}