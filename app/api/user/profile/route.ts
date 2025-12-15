import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// 1. GET: Fetch User Profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // We will pass email from frontend

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email }).select("-password"); // Don't send password

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// 2. PUT: Update User Profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();
    
    // Find and Update
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, phone },
      { new: true } // Return the updated document
    ).select("-password");

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}