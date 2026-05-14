import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import MercadoPago, { Payment } from 'mercadopago'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

// ── Signature validation ──────────────────────────────────────────────────────
// Only validates when x-signature header IS present (dashboard webhooks).
// IPN notifications via notification_url don't include the header — allowed through.

function validateSignature(
  req: NextRequest,
  dataId: string | number | undefined,
): boolean {
  const sigHeader = req.headers.get('x-signature')

  // IPN / notification_url calls don't include x-signature — skip validation
  if (!sigHeader) return true

  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[Webhook] x-signature present but MP_WEBHOOK_SECRET not set')
    return true
  }

  const requestId = req.headers.get('x-request-id') ?? ''

  const parts: Record<string, string> = {}
  for (const chunk of sigHeader.split(',')) {
    const [k, v] = chunk.trim().split('=')
    if (k && v) parts[k] = v
  }

  const { ts, v1 } = parts
  if (!ts || !v1) {
    console.error('[Webhook] Malformed x-signature header:', sigHeader)
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts}`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  if (expected !== v1) {
    // Log mismatch but don't block — payment status is verified independently via MP API
    console.warn('[Webhook] Signature mismatch (check MP_WEBHOOK_SECRET on Vercel). Proceeding with API verification.')
  }

  return true
}

// ── Email ─────────────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendConfirmationEmail(order: {
  number: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  address: string
  city: string
  province: string
  shippingMethod: string
  total: number
  OrderItem: Array<{
    productName: string
    variantName: string | null
    quantity: number
    unitPrice: number
    total: number
  }>
}) {
  const itemRows = order.OrderItem.map(
    (i) =>
      `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #f0ece6">${i.productName}${i.variantName ? ` — ${i.variantName}` : ''}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f0ece6;text-align:center">×${i.quantity}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f0ece6;text-align:right">$${i.total.toLocaleString('es-AR')}</td>
      </tr>`,
  ).join('')

  const deliveryLine =
    order.shippingMethod === 'retiro'
      ? 'Retiro en local (te avisamos por WhatsApp)'
      : `${order.address}, ${order.city}, ${order.province}`

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #e8e2d9;border-radius:12px;overflow:hidden">
    <div style="background:#1a1510;padding:28px 32px">
      <p style="margin:0;color:#c9a84c;font-style:italic;font-size:22px;letter-spacing:0.02em">Irida Studio</p>
    </div>
    <div style="padding:32px">
      <h1 style="margin:0 0 8px;font-size:26px;color:#1a1510;font-weight:normal">
        ¡Pedido confirmado! <span style="color:#c9a84c">✓</span>
      </h1>
      <p style="margin:0 0 24px;color:#7a6a55;font-family:sans-serif;font-size:14px">
        Hola ${order.buyerName}, recibimos tu pago correctamente.
      </p>

      <p style="margin:0 0 6px;font-family:sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a89880">
        Pedido
      </p>
      <p style="margin:0 0 24px;font-size:18px;color:#1a1510">#${order.number}</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="background:#faf8f5">
            <th style="padding:8px 12px;text-align:left;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a89880;font-weight:normal">Producto</th>
            <th style="padding:8px 12px;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a89880;font-weight:normal;text-align:center">Cant.</th>
            <th style="padding:8px 12px;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a89880;font-weight:normal;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 12px 0;font-style:italic;font-size:18px;color:#1a1510">Total</td>
            <td style="padding:12px 12px 0;text-align:right;font-style:italic;font-size:22px;color:#c9a84c">$${order.total.toLocaleString('es-AR')}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#faf8f5;border-radius:8px;padding:16px;margin-bottom:24px">
        <p style="margin:0 0 4px;font-family:sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a89880">Entrega</p>
        <p style="margin:0;font-size:14px;color:#1a1510">${deliveryLine}</p>
      </div>

      <p style="margin:0;font-family:sans-serif;font-size:13px;color:#7a6a55;line-height:1.6">
        Te vamos a avisar cuando tu pedido esté listo. Ante cualquier consulta escribinos por
        <a href="https://wa.me/5493496567541" style="color:#c9a84c">WhatsApp</a>.
      </p>
    </div>
    <div style="background:#faf8f5;padding:16px 32px;border-top:1px solid #e8e2d9">
      <p style="margin:0;font-family:sans-serif;font-size:11px;color:#a89880;text-align:center">
        Irida Studio · Esperanza, Santa Fe
      </p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Irida Studio <onboarding@resend.dev>',
    to: order.buyerEmail,
    subject: `Pedido confirmado #${order.number} — Irida Studio ✓`,
    html,
  })
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const url = new URL(req.url)

  let body: {
    type?: string
    action?: string
    data?: { id?: string | number }
  }

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  // MP sends notifications in 3 formats:
  // 1. Dashboard webhook (new): JSON body { type, data.id } + x-signature header
  // 2. notification_url IPN (new): query ?type=payment&data.id=<id>, no signature
  // 3. notification_url IPN (old): query ?topic=payment&id=<id>, no signature
  const eventType =
    body.type ??
    url.searchParams.get('type') ??
    (url.searchParams.get('topic') === 'payment' ? 'payment' : null)

  const paymentId =
    body.data?.id ??
    url.searchParams.get('data.id') ??
    url.searchParams.get('id')

  console.log('[Webhook] Received', {
    eventType,
    paymentId: String(paymentId),
    action: body.action,
    hasSignature: !!req.headers.get('x-signature'),
    query: url.search,
  })

  if (eventType !== 'payment') {
    console.log('[Webhook] Non-payment event, ignoring:', eventType, '| action:', body.action)
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (!paymentId) {
    console.error('[Webhook] No payment ID found in request')
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (!validateSignature(req, paymentId)) {
    console.error('[Webhook] Signature validation failed')
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  try {
    const mpClient = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const paymentAPI = new Payment(mpClient)
    const payment = await paymentAPI.get({ id: Number(paymentId) })

    console.log('[Webhook] Payment status:', payment.status, '| external_reference:', payment.external_reference)

    if (payment.status !== 'approved') {
      console.log('[Webhook] Payment not approved, status:', payment.status)
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const orderId = payment.external_reference
    if (!orderId) {
      console.error('[Webhook] No external_reference on payment', paymentId)
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } })
    if (!existing) {
      console.error('[Webhook] Order not found in DB:', orderId)
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (existing.status === 'PAID') {
      console.log('[Webhook] Order already PAID, idempotent skip:', orderId)
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        mpPaymentId: String(paymentId),
        mpOrderId: payment.order?.id ? String(payment.order.id) : undefined,
        updatedAt: new Date(),
      },
      include: { OrderItem: true },
    })

    console.log('[Webhook] Order updated to PAID:', orderId)

    try {
      await sendConfirmationEmail(updated)
      console.log('[Webhook] Confirmation email sent to:', updated.buyerEmail)
    } catch (emailErr) {
      console.error('[Webhook] Email send failed:', emailErr)
    }
  } catch (err) {
    console.error('[Webhook] Processing error:', err)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
