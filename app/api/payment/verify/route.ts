import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // 1. Generate the expected signature
    // Formula: HMAC_SHA256(order_id + "|" + payment_id, secret)
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // 2. Compare signatures
    if (generated_signature === razorpay_signature) {
      
      // ✅ PAYMENT IS REAL!
      // TODO: Update your MongoDB here (e.g., set Order Status to "PAID")
      console.log("Payment Verified for Order:", razorpay_order_id);

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully" 
      });

    } else {
      //  FRAUD ATTEMPT
      return NextResponse.json({ 
        success: false, 
        message: "Invalid signature" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}