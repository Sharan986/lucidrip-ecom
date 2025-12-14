import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json(); // Amount in Paisa (e.g. 500.00 -> 50000)

    const options = {
      amount: amount * 100, // Razorpay takes amount in paisa
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}