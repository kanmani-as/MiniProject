import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId') || undefined;
    const registrations = await db.getRegistrations(eventId);

    return NextResponse.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error: any) {
    console.error('Error in GET /api/registrations:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Server error retrieving registrations from MySQL database' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.eventId || !body.userName || !body.userEmail || !body.userPhone) {
      return NextResponse.json({
        success: false,
        error: 'Please provide full name, email address, phone number, and select an event.'
      }, { status: 400 });
    }

    const reg = await db.createRegistration({
      eventId: body.eventId,
      userName: body.userName,
      userEmail: body.userEmail,
      userPhone: body.userPhone,
      ticketsCount: Number(body.ticketsCount) || 1,
    });

    if (!reg) {
      return NextResponse.json({ success: false, error: 'Event not found in MySQL database' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration confirmed! Digital Pass generated and recorded in MySQL.',
      data: reg
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/registrations:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to process registration in MySQL database' 
    }, { status: 500 });
  }
}
