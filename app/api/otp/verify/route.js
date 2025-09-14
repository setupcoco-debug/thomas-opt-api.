import { NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/twilio";

export async function POST(req) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: "Téléphone et code requis" }, { status: 400 });
    }

    const res = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });

    if (res.status !== "approved") {
      return NextResponse.json({ error: "Code invalide" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("OTP verify error:", e?.message);
    return NextResponse.json({ error: "Échec vérification OTP" }, { status: 500 });
  }
}
