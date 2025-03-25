import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true
      }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

if (password !== user.passwordHash) {
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

    // Don't send the password hash to the client
    const { passwordHash, ...userData } = user;

    return NextResponse.json({
      id: userData.id.toString(),
      name: userData.username,
      email: userData.email,
      role: userData.role
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
