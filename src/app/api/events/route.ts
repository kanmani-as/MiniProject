import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FilterOptions } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('category') || undefined;
    const city = searchParams.get('city') || undefined;
    const dateFilter = (searchParams.get('date') as FilterOptions['dateFilter']) || undefined;
    const customDate = searchParams.get('customDate') || undefined;
    const priceFilter = (searchParams.get('price') as FilterOptions['priceFilter']) || undefined;
    const onlyVerified = searchParams.get('verified') === 'true';
    const status = searchParams.get('status') || undefined;
    const includeAll = searchParams.get('includeAll') === 'true';

    const events = await db.getEvents({
      search,
      categoryId,
      city,
      dateFilter,
      customDate,
      priceFilter,
      onlyVerified,
      status,
      includeAllStatuses: includeAll
    });

    const cities = await db.getDistinctCities();

    return NextResponse.json({
      success: true,
      count: events.length,
      cities,
      data: events
    });
  } catch (error: any) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to retrieve events from MySQL database' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields check
    if (!body.title || !body.categoryId || !body.startDate || !body.venue || !body.city) {
      return NextResponse.json({
        success: false,
        error: 'Please fill in all mandatory fields: Title, Category, Start Date, Venue, and City.'
      }, { status: 400 });
    }

    // Default status: if submitted from public form, it's PENDING_REVIEW; if admin, can be PUBLISHED
    const status = body.status || 'PENDING_REVIEW';
    const isVerified = body.isVerified ?? false;

    const newEvent = await db.createEvent({
      title: body.title,
      shortDescription: body.shortDescription || body.description?.substring(0, 160) || 'Local event listing.',
      description: body.description || '',
      categoryId: body.categoryId,
      startDate: body.startDate,
      endDate: body.endDate || body.startDate,
      startTime: body.startTime || '10:00 AM',
      endTime: body.endTime || '06:00 PM',
      venue: body.venue,
      address: body.address || `${body.venue}, ${body.city}`,
      city: body.city,
      state: body.state || 'Karnataka',
      pincode: body.pincode || '',
      isFree: body.isFree ?? (body.ticketPrice === 0 || !body.ticketPrice),
      ticketPrice: Number(body.ticketPrice) || 0,
      ticketLink: body.ticketLink || '',
      organizerName: body.organizerName || 'Community Organizer',
      organizerEmail: body.organizerEmail || '',
      organizerPhone: body.organizerPhone || '',
      organizerWebsite: body.organizerWebsite || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      isFeatured: body.isFeatured ?? false,
      isVerified: isVerified,
      status: status,
      expectedAttendees: Number(body.expectedAttendees) || 500,
      tags: body.tags || ['Community', 'LocalEvent'],
      schedule: body.schedule || []
    });

    return NextResponse.json({
      success: true,
      message: status === 'PENDING_REVIEW' 
        ? 'Event submitted successfully! It will appear on the website once approved by an administrator.' 
        : 'Event published successfully!',
      data: newEvent
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to create event in MySQL database' 
    }, { status: 500 });
  }
}
