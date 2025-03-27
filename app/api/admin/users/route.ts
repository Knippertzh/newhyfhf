import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, action, newPassword } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle different actions
    switch (action) {
      case 'suspend':
        await prisma.user.update({
          where: { id: userId },
          data: { status: 'SUSPENDED' },
        });
        return NextResponse.json({ message: 'User suspended successfully' });

      case 'activate':
        await prisma.user.update({
          where: { id: userId },
          data: { status: 'ACTIVE' },
        });
        return NextResponse.json({ message: 'User activated successfully' });

      case 'resetPassword':
        if (!newPassword) {
          return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }
        
        // Hash the new password
        const passwordHash = await hashPassword(newPassword);
        
        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash },
        });
        return NextResponse.json({ message: 'Password reset successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { username, email, password, role = 'USER', status = 'PENDING' } = data;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Don't return the password hash
    const { passwordHash: _, ...userData } = user;

    return NextResponse.json({
      message: 'User created successfully',
      user: userData,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      // Fetch user activity logs (mock implementation)
      // In a real app, you would fetch actual logs from a database
      const activityLogs = [
        { timestamp: new Date().toISOString(), action: 'login', details: 'User logged in' },
        { timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'profile_update', details: 'User updated profile' },
        { timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'password_change', details: 'User changed password' },
      ];

      return NextResponse.json({ userId, activityLogs });
    } else {
      // If no userId is provided, return all users
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error('Error fetching user logs:', error);
    return NextResponse.json({ error: 'Failed to fetch user logs' }, { status: 500 });
  }
}