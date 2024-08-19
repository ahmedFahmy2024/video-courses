import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature");

    let event = null;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return new NextResponse("Webhook error: " + error.message, { status: 400 });
    }

    const session = event.data.object;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse("Missing Metadata", { status: 400 });
        }

        await db.purchase.create({
            data: {
                userId,
                courseId,
            },
        });
    } else {
        return new NextResponse("Webhook error: unhandled event type " + event.type, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}
