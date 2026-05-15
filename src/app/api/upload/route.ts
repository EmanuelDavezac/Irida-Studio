import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Validate env vars at request time so misconfiguration is visible in logs
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[Upload] Cloudinary env vars missing:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret })
    return NextResponse.json({ error: 'Cloudinary no configurado' }, { status: 500 })
  }

  console.log('[Upload] Cloudinary cloud_name:', cloudName)

  let formData: FormData
  try {
    formData = await req.formData()
  } catch (err) {
    console.error('[Upload] formData parse error:', err)
    return NextResponse.json({ error: 'Error leyendo el formulario' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    console.error('[Upload] No file field in FormData')
    return NextResponse.json({ error: 'Sin archivo' }, { status: 400 })
  }

  console.log('[Upload] File received:', file.name, '|', file.type, '|', file.size, 'bytes')

  let buffer: Buffer
  try {
    const bytes = await file.arrayBuffer()
    buffer = Buffer.from(bytes)
  } catch (err) {
    console.error('[Upload] Buffer conversion error:', err)
    return NextResponse.json({ error: 'Error procesando el archivo' }, { status: 500 })
  }

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'irida-studio/products', resource_type: 'image' },
          (err, res) => {
            if (err) {
              console.error('[Upload] Cloudinary upload_stream error:', err)
              reject(err)
            } else if (!res) {
              console.error('[Upload] Cloudinary returned empty response')
              reject(new Error('Cloudinary empty response'))
            } else {
              console.log('[Upload] Cloudinary success, url:', res.secure_url)
              resolve(res)
            }
          },
        )
        .end(buffer)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Upload] Cloudinary failed:', message)
    return NextResponse.json({ error: `Error subiendo imagen: ${message}` }, { status: 500 })
  }
}
