import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import MercadoPago, { Preference } from 'mercadopago'
import type { CartItem } from '@/types'
import { prisma } from '@/lib/prisma'

interface CheckoutBody {
  items: CartItem[]
  buyer: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
    provincia: string
    cp: string
  }
  delivery: {
    method: 'envio' | 'retiro'
    shippingCost: number
  }
  subtotal: number
  total: number
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `IRI-${date}-${rand}`
}

export async function POST(req: NextRequest) {
  if (!process.env.MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Credenciales de MercadoPago no configuradas' },
      { status: 500 }
    )
  }

  let body: CheckoutBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const { items, buyer, delivery, subtotal, total } = body

  if (!items?.length) {
    return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
  }

  // Build MP line items — skip products without price
  const mpItems = items
    .map((item) => {
      const price = item.variant?.price ?? item.product.price
      if (!price) return null
      return {
        id: item.product.id,
        title: item.variant
          ? `${item.product.name} — ${item.variant.name}`
          : item.product.name,
        quantity: item.quantity,
        unit_price: price,
        currency_id: 'ARS' as const,
        picture_url: item.product.images?.[0] ?? undefined,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  if (!mpItems.length) {
    return NextResponse.json(
      { error: 'Ningún producto tiene precio definido' },
      { status: 400 }
    )
  }

  // Persist order before sending to MP so we can track it via external_reference
  const orderId = randomUUID()
  const orderNumber = generateOrderNumber()
  const now = new Date()

  try {
    await prisma.order.create({
      data: {
        id: orderId,
        number: orderNumber,
        buyerName: `${buyer.nombre} ${buyer.apellido}`,
        buyerEmail: buyer.email,
        buyerPhone: buyer.telefono,
        address: buyer.direccion,
        city: buyer.ciudad,
        province: buyer.provincia,
        postalCode: buyer.cp,
        shippingMethod: delivery?.method ?? 'envio',
        subtotal: subtotal ?? 0,
        total: total ?? 0,
        status: 'PENDING',
        updatedAt: now,
        OrderItem: {
          create: mpItems.map((item) => ({
            id: randomUUID(),
            productId: item.id,
            productName: item.title,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.unit_price * item.quantity,
          })),
        },
      },
    })
  } catch (dbErr) {
    console.error('[Checkout] Failed to create order in DB:', dbErr)
    return NextResponse.json(
      { error: 'Error al registrar el pedido' },
      { status: 500 }
    )
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const webhookUrl = 'https://irida-studio-rg38.vercel.app/api/webhook/mercadopago'

  try {
    const client = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
    const preferenceAPI = new Preference(client)

    const result = await preferenceAPI.create({
      body: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: mpItems as any,
        payer: {
          name: buyer.nombre,
          surname: buyer.apellido,
          email: buyer.email,
          phone: { number: buyer.telefono },
          address: {
            street_name: buyer.direccion,
            zip_code: buyer.cp || '3080',
          },
        },
        back_urls: {
          success: `${base}/exito`,
          failure: `${base}/fallo`,
          pending: `${base}/fallo`,
        },
        auto_return: 'approved',
        statement_descriptor: 'IRIDA STUDIO',
        notification_url: webhookUrl,
        external_reference: orderId,
      },
    })

    return NextResponse.json({
      init_point: result.init_point,
      id: result.id,
      orderNumber,
    })
  } catch (err) {
    console.error('[MercadoPago] preference.create error:', err)
    // Mark the pre-created order as cancelled since MP failed
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', updatedAt: new Date() },
    }).catch(() => null)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
}
