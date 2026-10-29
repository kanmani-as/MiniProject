import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to retrieve categories from MySQL database' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat = await db.createCategory({
      name: body.name,
      slug: body.slug || slug,
      description: body.description || '',
      icon: body.icon || 'Calendar',
      color: body.color || 'from-amber-500 to-orange-600',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      displayOrder: body.displayOrder || 99
    });

    return NextResponse.json({ success: true, data: newCat }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to create category in MySQL database' 
    }, { status: 500 });
  }
}
