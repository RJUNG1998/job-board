import { createClient } from "@/app/lib/supabase-server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: {user} } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

  const {data: userData} = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();
  
  let customerId = userData?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true`,
  })

  return NextResponse.json({ url: session.url });
}