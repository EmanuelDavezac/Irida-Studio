import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/admin/sync-payment?id=<mp_payment_id>
// Diagnoses and optionally fixes a stuck order
export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paymentId = req.nextUrl.searchParams.get('id')
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing ?id=<mp_payment_id>' }, { status: 400 })
  }

  try {
    const mpClient = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const paymentAPI = new Payment(mpClient)
    const payment = await paymentAPI.get({ id: Number(paymentId) })

    const orderId = payment.external_reference ?? null
    const order = orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          include: { OrderItem: true },
        })
      : null

    return NextResponse.json({
      payment: {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        external_reference: payment.external_reference,
        payer_email: payment.payer?.email,
        transaction_amount: payment.transaction_amount,
        date_approved: payment.date_approved,
      },
      order: order
        ? { id: order.id, number: order.number, status: order.status, buyerEmail: order.buyerEmail }
        : null,
      diagnosis: {
        payment_approved: payment.status === 'approved',
        order_found: !!order,
        order_already_paid: order?.status === 'PAID',
        external_reference_match: !!order,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/admin/sync-payment?id=<mp_payment_id>
// Force-updates the order to PAID if payment is approved
export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paymentId = req.nextUrl.searchParams.get('id')
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing ?id=<mp_payment_id>' }, { status: 400 })
  }

  try {
    const mpClient = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const paymentAPI = new Payment(mpClient)
    const payment = await paymentAPI.get({ id: Number(paymentId) })

    if (payment.status !== 'approved') {
      return NextResponse.json({
        error: `Payment status is '${payment.status}', not 'approved'. Cannot mark as paid.`,
      }, { status: 400 })
    }

    const orderId = payment.external_reference
    if (!orderId) {
      return NextResponse.json({ error: 'Payment has no external_reference' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        mpPaymentId: String(paymentId),
        mpOrderId: payment.order?.id ? String(payment.order.id) : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, order: { id: updated.id, number: updated.number, status: updated.status } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
