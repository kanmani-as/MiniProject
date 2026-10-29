import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/local_events_db';
    
    // Mask password in DB URL for security
    const maskedUrl = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:******@');

    const health = await db.checkConnection();
    let stats = {
      totalEvents: 0,
      publishedEvents: 0,
      pendingEvents: 0,
      draftEvents: 0,
      totalCategories: 0,
      totalRegistrations: 0,
      totalUsers: 0,
      verifiedCount: 0,
      totalExpectedAttendees: 0
    };

    if (health.connected) {
      try {
        stats = await db.getStats();
      } catch (err: any) {
        console.warn('Could not fetch stats, tables may not be created yet:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics: {
        databaseEngine: health.connected 
          ? `MySQL Native Pool (${health.version || 'MySQL 8.0+'})` 
          : 'MySQL Driver (Awaiting Connection)',
        databaseUrlConfigured: maskedUrl,
        mode: health.connected ? 'Active MySQL Production Mode' : 'Offline / Server Connection Pending',
        schemaFile: 'database/schema.sql',
        connected: health.connected,
        connectionError: health.error || null,
        tables: {
          vb_categories: stats.totalCategories,
          vb_events: stats.totalEvents,
          vb_registrations: stats.totalRegistrations,
          vb_users: stats.totalUsers || 1,
          // Aliases for frontend backward compatibility
          categories: stats.totalCategories,
          events: stats.totalEvents,
          registrations: stats.totalRegistrations,
          admin_users: stats.totalUsers || 1
        },
        systemStats: stats,
        serverTime: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching DB diagnostics:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to fetch MySQL DB diagnostics' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === 'reset_seed') {
      await db.resetToDefaults();
      return NextResponse.json({
        success: true,
        message: 'MySQL database sample records restored successfully in vb_users, vb_categories, vb_events, and vb_registrations.'
      });
    }
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Reset database error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Server error while resetting MySQL database' 
    }, { status: 500 });
  }
}
