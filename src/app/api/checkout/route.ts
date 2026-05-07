import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Preference } from 'mercadopago'
import type { CartItem } from '@/types'

interface CheckoutBody {
  items: CartItem[]
  buyer: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    direccion: string
  }
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

  const { items, buyer } = body

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
    .filter(Boolean) as NonNullable<(typeof items)[0]>[]

  if (!mpItems.length) {
    return NextResponse.json(
      { error: 'Ningún producto tiene precio definido' },
      { status: 400 }
    )
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  try {
    const client = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
    const preferenceAPI = new Preference(client)

    const result = await preferenceAPI.create({
      body: {
        items: mpItems,
        payer: {
          name: buyer.nombre,
          surname: buyer.apellido,
          email: buyer.email,
          phone: { number: buyer.telefono },
          address: {
            street_name: buyer.direccion,
            city_name: 'Esperanza',
            zip_code: '3080',
          },
        },
        back_urls: {
          success: `${base}/exito`,
          failure: `${base}/fallo`,
          pending: `${base}/fallo`,
        },
        auto_return: 'approved',
        statement_descriptor: 'IRIDA STUDIO',
        external_reference: `irida_${Date.now()}`,
      },
    })

    return NextResponse.json({
      init_point: result.init_point,
      id: result.id,
    })
  } catch (err) {
    console.error('[MercadoPago] preference.create error:', err)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
}
