import { createClient } from '@/app/lib/supabase-server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    // 결제 성공 → pro로 업그레이드
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      await supabase
        .from('users')
        .update({
          plan: 'pro',
          stripe_subscription_id: subscriptionId,
        })
        .eq('stripe_customer_id', customerId)
      break
    }

    // 구독 갱신 성공
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await supabase
        .from('users')
        .update({ plan: 'pro' })
        .eq('stripe_customer_id', customerId)
      break
    }

    // 구독 취소 or 결제 실패 → free로 다운그레이드
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const obj = event.data.object as Stripe.Subscription | Stripe.Invoice
      const customerId = obj.customer as string

      await supabase
        .from('users')
        .update({ plan: 'free' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}