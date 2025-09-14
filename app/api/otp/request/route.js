import { NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/twilio";

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Téléphone requis (E.164 ex: +336...)" }, { status: 400 });
    }

    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });

    return NextResponse.json({ sid: verification.sid, status: verification.status });
  } catch (e) {
    console.error("OTP request error:", e?.message);
    return NextResponse.json({ error: "Échec envoi OTP" }, { status: 500 });
  }
}
