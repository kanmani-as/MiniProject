import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.getEventById(params.id);
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found in database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error in GET /api/events/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Server error retrieving event from MySQL database' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await db.updateEvent(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found or not modified' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully in MySQL database',
      data: updated
    });
  } catch (error: any) {
    console.error('Error in PUT /api/events/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to update event in MySQL database' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await db.deleteEvent(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Event not found or already deleted from database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event listing deleted successfully from MySQL database' });
  } catch (error: any) {
    console.error('Error in DELETE /api/events/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to delete event from MySQL database' 
    }, { status: 500 });
  }
}
