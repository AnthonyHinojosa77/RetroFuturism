import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const postcards = await prisma.postcard.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(postcards);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const visitorName = (body?.visitorName ?? '').toString().trim();
    const destination = (body?.destination ?? '').toString().trim();
    const message = (body?.message ?? '').toString().trim();
    if (!visitorName || !destination || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const created = await prisma.postcard.create({
      data: { visitorName, destination, message },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
