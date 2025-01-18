/*
 * File API Instructions
 * This api must be included in the nextjs application to work with files
 *  a.	Make a file called /api/files/[...method]/route.ts
 *  b.	Make its contents `export * from '@repo/files'`
 * This is necessary for the client side to work with files
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { BucketConnection, Files as S3Connection } from "./S3Connection"


const signedUrlSchema = z.object({
  key: z.string(),
  method: z.enum(['get', 'put']).optional()
})

const listSchema = z.object({
  prefix: z.string().optional()
})

const deleteSchema = z.object({
  key: z.string()
})

export function fileServerFactory(Configuration: {
  connection?: BucketConnection
  bucket?: string
}) {
  // Make the s3 connector
  const Files = new S3Connection(Configuration)

  async function handleSignedUrl(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const input = signedUrlSchema.parse({
      key: searchParams.get('key'),
      method: searchParams.get('method') || undefined
    })
    const url = await Files.signedUrl(input.key, input.method)
    return NextResponse.json({ url })
  }

  async function handleList(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const input = listSchema.parse({
      prefix: searchParams.get('prefix') || undefined
    })
    const items = await Files.list({ prefix: input.prefix })
    return NextResponse.json(items)
  }

  async function handleDelete(request: NextRequest) {
    const input = deleteSchema.parse(await request.json())
    await Files.delete(input.key)
    return NextResponse.json({ success: true })
  }

  async function GET(
    request: NextRequest,
    context: { params: Promise<{ method: string[] }> }
  ): Promise<NextResponse> {
    const [method] = (await context.params).method
    if (method === 'signed-url') return handleSignedUrl(request)
    if (method === 'list') return handleList(request)
    return NextResponse.json({ error: 'Method not found' }, { status: 404 })
  }

  async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ method: string[] }> }
  ): Promise<NextResponse> {
    const [method] = (await context.params).method
    if (method === 'delete') return handleDelete(request)
    return NextResponse.json({ error: 'Method not found' }, { status: 404 })
  }

  return { GET, DELETE }
}
