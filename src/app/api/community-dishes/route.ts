import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dishes = await prisma.communityDish.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(dishes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const visitorName = (body?.visitorName ?? '').toString().trim();
    const dishName = (body?.dishName ?? '').toString().trim();
    const description = (body?.description ?? '').toString().trim();
    if (!visitorName || !dishName || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const created = await prisma.communityDish.create({
      data: { visitorName, dishName, description },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
