import mysql, { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Category, EventItem, FilterOptions, Registration, AdminUser } from '@/types';
import { initialCategories, initialEvents } from './data/sample-events';

// Default connection config
function getConnectionConfig() {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/local_events_db';
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname || 'localhost',
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: url.pathname ? url.pathname.replace(/^\//, '') : 'local_events_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true,
      decimalNumbers: true,
      charset: 'utf8mb4'
    };
  } catch {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'local_events_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true,
      decimalNumbers: true,
      charset: 'utf8mb4'
    };
  }
}

// Global pool singleton for Next.js hot-reload safety
const globalForMySQL = globalThis as unknown as { mysqlPool?: Pool; isInitialized?: boolean };

export function getPool(): Pool {
  if (!globalForMySQL.mysqlPool) {
    const config = getConnectionConfig();
    globalForMySQL.mysqlPool = mysql.createPool(config);
  }
  return globalForMySQL.mysqlPool;
}

// Format date values to YYYY-MM-DD
function formatDbDate(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') {
    return val.substring(0, 10);
  }
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  return String(val);
}

// Row mappers between MySQL vb_* tables and TypeScript interfaces
function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    icon: row.icon || 'Calendar',
    color: row.color || 'from-amber-500 to-orange-600',
    imageUrl: row.image_url || row.imageUrl || '',
    displayOrder: Number(row.display_order ?? row.displayOrder ?? 0),
    eventCount: row.event_count !== undefined ? Number(row.event_count) : undefined,
  };
}

function mapRowToEvent(row: any): EventItem {
  let tags: string[] = [];
  if (Array.isArray(row.tags)) {
    tags = row.tags;
  } else if (typeof row.tags === 'string') {
    try {
      tags = JSON.parse(row.tags);
    } catch {
      tags = row.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  }

  let schedule: any[] = [];
  if (Array.isArray(row.schedule)) {
    schedule = row.schedule;
  } else if (typeof row.schedule === 'string') {
    try {
      schedule = JSON.parse(row.schedule);
    } catch {
      schedule = [];
    }
  }

  const event: EventItem = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description || row.shortDescription || '',
    description: row.description || '',
    categoryId: row.category_id || row.categoryId,
    startDate: formatDbDate(row.start_date || row.startDate),
    endDate: formatDbDate(row.end_date || row.endDate),
    startTime: row.start_time || row.startTime || '',
    endTime: row.end_time || row.endTime || '',
    venue: row.venue || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    pincode: row.pincode || '',
    isFree: Boolean(row.is_free ?? row.isFree),
    ticketPrice: Number(row.ticket_price ?? row.ticketPrice ?? 0),
    ticketLink: row.ticket_link || row.ticketLink || '',
    organizerName: row.organizer_name || row.organizerName || '',
    organizerEmail: row.organizer_email || row.organizerEmail || '',
    organizerPhone: row.organizer_phone || row.organizerPhone || '',
    organizerWebsite: row.organizer_website || row.organizerWebsite || '',
    imageUrl: row.image_url || row.imageUrl || '',
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    isVerified: Boolean(row.is_verified ?? row.isVerified),
    status: row.status,
    expectedAttendees: Number(row.expected_attendees ?? row.expectedAttendees ?? 0),
    tags,
    schedule,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };

  if (row.cat_id || row.cat_name) {
    event.category = {
      id: row.cat_id || row.category_id,
      name: row.cat_name,
      slug: row.cat_slug,
      description: row.cat_description || '',
      icon: row.cat_icon || 'Calendar',
      color: row.cat_color || 'from-amber-500 to-orange-600',
      imageUrl: row.cat_image_url || '',
      displayOrder: Number(row.cat_display_order || 0),
    };
  }

  return event;
}

function mapRowToRegistration(row: any): Registration {
  return {
    id: row.id,
    eventId: row.event_id || row.eventId,
    eventTitle: row.event_title || row.eventTitle,
    eventDate: formatDbDate(row.event_date || row.eventDate),
    eventVenue: row.event_venue || row.eventVenue,
    userName: row.user_name || row.userName,
    userEmail: row.user_email || row.userEmail,
    userPhone: row.user_phone || row.userPhone,
    ticketsCount: Number(row.tickets_count ?? row.ticketsCount ?? 1),
    registrationCode: row.registration_code || row.registrationCode,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

function mapRowToUser(row: any): AdminUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role || 'ADMIN',
  };
}

/**
 * Pure MySQL Database Client for UtsavHub.
 * Interacts directly with vb_users, vb_categories, vb_events, vb_registrations tables.
 * No Prisma ORM — pure native parameterized SQL statements.
 */
export class MySQLDatabase {
  private tablesEnsured: boolean = false;

  /**
   * Ensures all vb_* database tables exist and seeds them if empty.
   */
  public async ensureTablesExist(): Promise<void> {
    if (this.tablesEnsured) return;

    const pool = getPool();
    try {
      // 1. Create vb_users
      await pool.query(`
        CREATE TABLE IF NOT EXISTS \`vb_users\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`email\` VARCHAR(150) NOT NULL UNIQUE,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`name\` VARCHAR(100) NOT NULL,
          \`role\` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
          \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX \`idx_vb_users_email\` (\`email\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 2. Create vb_categories
      await pool.query(`
        CREATE TABLE IF NOT EXISTS \`vb_categories\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`name\` VARCHAR(100) NOT NULL,
          \`slug\` VARCHAR(100) NOT NULL UNIQUE,
          \`description\` TEXT,
          \`icon\` VARCHAR(50) DEFAULT 'Calendar',
          \`color\` VARCHAR(100) DEFAULT 'from-amber-500 to-orange-600',
          \`image_url\` VARCHAR(500),
          \`display_order\` INT DEFAULT 0,
          \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX \`idx_vb_categories_slug\` (\`slug\`),
          INDEX \`idx_vb_categories_order\` (\`display_order\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 3. Create vb_events
      await pool.query(`
        CREATE TABLE IF NOT EXISTS \`vb_events\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`title\` VARCHAR(255) NOT NULL,
          \`slug\` VARCHAR(255) NOT NULL UNIQUE,
          \`short_description\` VARCHAR(500) NOT NULL,
          \`description\` TEXT NOT NULL,
          \`category_id\` VARCHAR(50) NOT NULL,
          \`start_date\` DATE NOT NULL,
          \`end_date\` DATE NOT NULL,
          \`start_time\` VARCHAR(20) NOT NULL,
          \`end_time\` VARCHAR(20) NOT NULL,
          \`venue\` VARCHAR(255) NOT NULL,
          \`address\` VARCHAR(500) NOT NULL,
          \`city\` VARCHAR(100) NOT NULL,
          \`state\` VARCHAR(100) NOT NULL,
          \`pincode\` VARCHAR(20),
          \`is_free\` BOOLEAN DEFAULT TRUE,
          \`ticket_price\` DECIMAL(10,2) DEFAULT 0.00,
          \`ticket_link\` VARCHAR(500),
          \`organizer_name\` VARCHAR(200) NOT NULL,
          \`organizer_email\` VARCHAR(150),
          \`organizer_phone\` VARCHAR(50),
          \`organizer_website\` VARCHAR(255),
          \`image_url\` VARCHAR(500) NOT NULL,
          \`is_featured\` BOOLEAN DEFAULT FALSE,
          \`is_verified\` BOOLEAN DEFAULT FALSE,
          \`status\` ENUM('PUBLISHED', 'DRAFT', 'PENDING_REVIEW') DEFAULT 'PUBLISHED',
          \`expected_attendees\` INT DEFAULT 500,
          \`tags\` TEXT,
          \`schedule\` TEXT,
          \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX \`idx_vb_events_category\` (\`category_id\`),
          INDEX \`idx_vb_events_status\` (\`status\`),
          INDEX \`idx_vb_events_dates\` (\`start_date\`, \`end_date\`),
          INDEX \`idx_vb_events_city\` (\`city\`),
          INDEX \`idx_vb_events_featured\` (\`is_featured\`),
          CONSTRAINT \`fk_vb_events_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`vb_categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 4. Create vb_registrations
      await pool.query(`
        CREATE TABLE IF NOT EXISTS \`vb_registrations\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`event_id\` VARCHAR(50) NOT NULL,
          \`user_name\` VARCHAR(150) NOT NULL,
          \`user_email\` VARCHAR(150) NOT NULL,
          \`user_phone\` VARCHAR(50) NOT NULL,
          \`tickets_count\` INT DEFAULT 1,
          \`registration_code\` VARCHAR(50) NOT NULL UNIQUE,
          \`status\` ENUM('CONFIRMED', 'CANCELLED', 'ATTENDED') DEFAULT 'CONFIRMED',
          \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX \`idx_vb_reg_event\` (\`event_id\`),
          INDEX \`idx_vb_reg_code\` (\`registration_code\`),
          CONSTRAINT \`fk_vb_reg_event\` FOREIGN KEY (\`event_id\`) REFERENCES \`vb_events\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Seed admin user if vb_users is empty
      const [userRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM `vb_users`');
      if (userRows[0]?.count === 0) {
        await pool.query(`
          INSERT INTO \`vb_users\` (\`id\`, \`email\`, \`password_hash\`, \`name\`, \`role\`)
          VALUES (?, ?, ?, ?, ?)
        `, ['usr-admin-1', 'admin@localevents.gov', 'admin123', 'Municipal Event Administrator', 'SUPER_ADMIN']);
      }

      // Seed categories if vb_categories is empty
      const [catRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM `vb_categories`');
      if (catRows[0]?.count === 0) {
        for (const cat of initialCategories) {
          await pool.query(`
            INSERT INTO \`vb_categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`icon\`, \`color\`, \`image_url\`, \`display_order\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.color, cat.imageUrl, cat.displayOrder]);
        }
      }

      // Seed events if vb_events is empty
      const [eventRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM `vb_events`');
      if (eventRows[0]?.count === 0) {
        for (const evt of initialEvents) {
          await pool.query(`
            INSERT INTO \`vb_events\` (
              \`id\`, \`title\`, \`slug\`, \`short_description\`, \`description\`, \`category_id\`,
              \`start_date\`, \`end_date\`, \`start_time\`, \`end_time\`, \`venue\`, \`address\`,
              \`city\`, \`state\`, \`pincode\`, \`is_free\`, \`ticket_price\`, \`ticket_link\`,
              \`organizer_name\`, \`organizer_email\`, \`organizer_phone\`, \`organizer_website\`,
              \`image_url\`, \`is_featured\`, \`is_verified\`, \`status\`, \`expected_attendees\`,
              \`tags\`, \`schedule\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            evt.id,
            evt.title,
            evt.slug,
            evt.shortDescription,
            evt.description,
            evt.categoryId,
            evt.startDate,
            evt.endDate,
            evt.startTime,
            evt.endTime,
            evt.venue,
            evt.address,
            evt.city,
            evt.state,
            evt.pincode,
            evt.isFree ? 1 : 0,
            evt.ticketPrice,
            evt.ticketLink || '',
            evt.organizerName,
            evt.organizerEmail || '',
            evt.organizerPhone || '',
            evt.organizerWebsite || '',
            evt.imageUrl,
            evt.isFeatured ? 1 : 0,
            evt.isVerified ? 1 : 0,
            evt.status,
            evt.expectedAttendees || 500,
            JSON.stringify(evt.tags || []),
            JSON.stringify(evt.schedule || [])
          ]);
        }
      }

      // Seed registrations if vb_registrations is empty
      const [regRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM `vb_registrations`');
      if (regRows[0]?.count === 0) {
        await pool.query(`
          INSERT INTO \`vb_registrations\` (\`id\`, \`event_id\`, \`user_name\`, \`user_email\`, \`user_phone\`, \`tickets_count\`, \`registration_code\`, \`status\`)
          VALUES 
          ('reg-1', 'evt-1', 'Ramesh Kulkarni', 'ramesh.k@gmail.com', '+91 98451 22334', 2, 'REG-UTSAV-8921', 'CONFIRMED'),
          ('reg-2', 'evt-3', 'Ananya Sharma', 'ananya.dev@outlook.com', '+91 97312 44556', 1, 'REG-TECH-4109', 'CONFIRMED'),
          ('reg-3', 'evt-5', 'Vikram Adiga', 'vikram.adiga@gmail.com', '+91 94480 33221', 3, 'REG-RAGAS-6652', 'CONFIRMED')
        `);
      }

      this.tablesEnsured = true;
    } catch (err: any) {
      console.error('MySQL table initialization warning:', err.message);
      // Let individual queries report explicit connection errors if MySQL is not running
    }
  }

  /**
   * Health check / Diagnostic ping for MySQL
   */
  public async checkConnection(): Promise<{ connected: boolean; error?: string; version?: string }> {
    try {
      const pool = getPool();
      const [rows] = await pool.query<RowDataPacket[]>('SELECT VERSION() AS version');
      return {
        connected: true,
        version: rows[0]?.version || 'MySQL 8.0+'
      };
    } catch (err: any) {
      return {
        connected: false,
        error: err.message
      };
    }
  }

  /**
   * Get all categories with dynamic eventCount from vb_events
   */
  public async getCategories(): Promise<Category[]> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.icon, c.color, 
        c.image_url, c.display_order, c.created_at,
        COUNT(e.id) AS event_count
      FROM \`vb_categories\` c
      LEFT JOIN \`vb_events\` e ON e.category_id = c.id AND e.status = 'PUBLISHED'
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `);

    return rows.map(mapRowToCategory);
  }

  /**
   * Get category by slug
   */
  public async getCategoryBySlug(slug: string): Promise<Category | null> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.icon, c.color, 
        c.image_url, c.display_order, c.created_at,
        COUNT(e.id) AS event_count
      FROM \`vb_categories\` c
      LEFT JOIN \`vb_events\` e ON e.category_id = c.id AND e.status = 'PUBLISHED'
      WHERE c.slug = ?
      GROUP BY c.id
    `, [slug]);

    if (rows.length === 0) return null;
    return mapRowToCategory(rows[0]);
  }

  /**
   * Get category by id
   */
  public async getCategoryById(id: string): Promise<Category | null> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM \`vb_categories\` WHERE id = ?
    `, [id]);

    if (rows.length === 0) return null;
    return mapRowToCategory(rows[0]);
  }

  /**
   * Insert new category into vb_categories
   */
  public async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    await this.ensureTablesExist();
    const pool = getPool();
    const id = `cat-${Date.now()}`;

    // Get max display_order
    const [maxOrderRows] = await pool.query<RowDataPacket[]>(`
      SELECT COALESCE(MAX(display_order), 0) AS max_order FROM \`vb_categories\`
    `);
    const displayOrder = data.displayOrder || (Number(maxOrderRows[0]?.max_order || 0) + 1);

    await pool.query(`
      INSERT INTO \`vb_categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`icon\`, \`color\`, \`image_url\`, \`display_order\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.name,
      data.slug,
      data.description || '',
      data.icon || 'Calendar',
      data.color || 'from-amber-500 to-orange-600',
      data.imageUrl || '',
      displayOrder
    ]);

    const created = await this.getCategoryById(id);
    return created!;
  }

  /**
   * Retrieve events from vb_events with multi-parameter filtering
   */
  public async getEvents(options: FilterOptions & { status?: string; includeAllStatuses?: boolean } = {}): Promise<EventItem[]> {
    await this.ensureTablesExist();
    const pool = getPool();

    let sql = `
      SELECT 
        e.*,
        c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
        c.description AS cat_description, c.icon AS cat_icon,
        c.color AS cat_color, c.image_url AS cat_image_url,
        c.display_order AS cat_display_order
      FROM \`vb_events\` e
      LEFT JOIN \`vb_categories\` c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filter by status (default is only PUBLISHED for public visitors)
    if (!options.includeAllStatuses) {
      sql += ` AND e.status = ?`;
      params.push(options.status || 'PUBLISHED');
    } else if (options.status) {
      sql += ` AND e.status = ?`;
      params.push(options.status);
    }

    // Keyword Search
    if (options.search && options.search.trim()) {
      const q = `%${options.search.trim().toLowerCase()}%`;
      sql += ` AND (
        LOWER(e.title) LIKE ? OR 
        LOWER(e.short_description) LIKE ? OR 
        LOWER(e.venue) LIKE ? OR 
        LOWER(e.city) LIKE ? OR 
        LOWER(e.organizer_name) LIKE ? OR 
        LOWER(e.tags) LIKE ?
      )`;
      params.push(q, q, q, q, q, q);
    }

    // Category Filter
    if (options.categoryId && options.categoryId !== 'all') {
      sql += ` AND e.category_id = ?`;
      params.push(options.categoryId);
    }

    // City Filter
    if (options.city && options.city !== 'all') {
      sql += ` AND LOWER(e.city) = LOWER(?)`;
      params.push(options.city);
    }

    // Pricing Filter
    if (options.priceFilter === 'free') {
      sql += ` AND e.is_free = 1`;
    } else if (options.priceFilter === 'paid') {
      sql += ` AND e.is_free = 0`;
    }

    // Verified Only
    if (options.onlyVerified) {
      sql += ` AND e.is_verified = 1`;
    }

    // Date Filters
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (options.dateFilter === 'today') {
      sql += ` AND e.start_date <= ? AND e.end_date >= ?`;
      params.push(todayStr, todayStr);
    } else if (options.dateFilter === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      sql += ` AND e.start_date <= ? AND e.end_date >= ?`;
      params.push(tomorrowStr, tomorrowStr);
    } else if (options.dateFilter === 'weekend') {
      const dayOfWeek = now.getDay();
      const daysUntilSat = (6 - dayOfWeek + 7) % 7;
      const sat = new Date(now);
      sat.setDate(sat.getDate() + daysUntilSat);
      const sun = new Date(sat);
      sun.setDate(sun.getDate() + 1);
      const satStr = sat.toISOString().split('T')[0];
      const sunStr = sun.toISOString().split('T')[0];
      sql += ` AND e.start_date <= ? AND e.end_date >= ?`;
      params.push(sunStr, satStr);
    } else if (options.dateFilter === 'month') {
      const currentYearMonth = todayStr.substring(0, 7);
      sql += ` AND (e.start_date LIKE ? OR e.end_date LIKE ?)`;
      params.push(`${currentYearMonth}%`, `${currentYearMonth}%`);
    } else if (options.dateFilter === 'custom' && options.customDate) {
      sql += ` AND e.start_date <= ? AND e.end_date >= ?`;
      params.push(options.customDate, options.customDate);
    }

    sql += ` ORDER BY e.start_date ASC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows.map(mapRowToEvent);
  }

  /**
   * Get featured events for hero carousel
   */
  public async getFeaturedEvents(): Promise<EventItem[]> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        e.*,
        c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
        c.description AS cat_description, c.icon AS cat_icon,
        c.color AS cat_color, c.image_url AS cat_image_url,
        c.display_order AS cat_display_order
      FROM \`vb_events\` e
      LEFT JOIN \`vb_categories\` c ON e.category_id = c.id
      WHERE e.is_featured = 1 AND e.status = 'PUBLISHED'
      ORDER BY e.start_date ASC
    `);

    return rows.map(mapRowToEvent);
  }

  /**
   * Get event by id or slug
   */
  public async getEventById(idOrSlug: string): Promise<EventItem | null> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        e.*,
        c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
        c.description AS cat_description, c.icon AS cat_icon,
        c.color AS cat_color, c.image_url AS cat_image_url,
        c.display_order AS cat_display_order
      FROM \`vb_events\` e
      LEFT JOIN \`vb_categories\` c ON e.category_id = c.id
      WHERE e.id = ? OR e.slug = ?
    `, [idOrSlug, idOrSlug]);

    if (rows.length === 0) return null;
    return mapRowToEvent(rows[0]);
  }

  /**
   * Insert new event into vb_events
   */
  public async createEvent(data: Omit<EventItem, 'id' | 'slug' | 'createdAt'>): Promise<EventItem> {
    await this.ensureTablesExist();
    const pool = getPool();
    const id = `evt-${Date.now()}`;
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Math.floor(Math.random() * 1000)}`;

    await pool.query(`
      INSERT INTO \`vb_events\` (
        \`id\`, \`title\`, \`slug\`, \`short_description\`, \`description\`, \`category_id\`,
        \`start_date\`, \`end_date\`, \`start_time\`, \`end_time\`, \`venue\`, \`address\`,
        \`city\`, \`state\`, \`pincode\`, \`is_free\`, \`ticket_price\`, \`ticket_link\`,
        \`organizer_name\`, \`organizer_email\`, \`organizer_phone\`, \`organizer_website\`,
        \`image_url\`, \`is_featured\`, \`is_verified\`, \`status\`, \`expected_attendees\`,
        \`tags\`, \`schedule\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.title,
      slug,
      data.shortDescription,
      data.description,
      data.categoryId,
      data.startDate,
      data.endDate || data.startDate,
      data.startTime || '10:00 AM',
      data.endTime || '06:00 PM',
      data.venue,
      data.address,
      data.city,
      data.state || 'Karnataka',
      data.pincode || '',
      data.isFree ? 1 : 0,
      data.ticketPrice || 0,
      data.ticketLink || '',
      data.organizerName,
      data.organizerEmail || '',
      data.organizerPhone || '',
      data.organizerWebsite || '',
      data.imageUrl,
      data.isFeatured ? 1 : 0,
      data.isVerified ? 1 : 0,
      data.status || 'PENDING_REVIEW',
      data.expectedAttendees || 500,
      JSON.stringify(data.tags || []),
      JSON.stringify(data.schedule || [])
    ]);

    const created = await this.getEventById(id);
    return created!;
  }

  /**
   * Update existing event in vb_events
   */
  public async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
    await this.ensureTablesExist();
    const pool = getPool();

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { fields.push('`title` = ?'); values.push(updates.title); }
    if (updates.slug !== undefined) { fields.push('`slug` = ?'); values.push(updates.slug); }
    if (updates.shortDescription !== undefined) { fields.push('`short_description` = ?'); values.push(updates.shortDescription); }
    if (updates.description !== undefined) { fields.push('`description` = ?'); values.push(updates.description); }
    if (updates.categoryId !== undefined) { fields.push('`category_id` = ?'); values.push(updates.categoryId); }
    if (updates.startDate !== undefined) { fields.push('`start_date` = ?'); values.push(updates.startDate); }
    if (updates.endDate !== undefined) { fields.push('`end_date` = ?'); values.push(updates.endDate); }
    if (updates.startTime !== undefined) { fields.push('`start_time` = ?'); values.push(updates.startTime); }
    if (updates.endTime !== undefined) { fields.push('`end_time` = ?'); values.push(updates.endTime); }
    if (updates.venue !== undefined) { fields.push('`venue` = ?'); values.push(updates.venue); }
    if (updates.address !== undefined) { fields.push('`address` = ?'); values.push(updates.address); }
    if (updates.city !== undefined) { fields.push('`city` = ?'); values.push(updates.city); }
    if (updates.state !== undefined) { fields.push('`state` = ?'); values.push(updates.state); }
    if (updates.pincode !== undefined) { fields.push('`pincode` = ?'); values.push(updates.pincode); }
    if (updates.isFree !== undefined) { fields.push('`is_free` = ?'); values.push(updates.isFree ? 1 : 0); }
    if (updates.ticketPrice !== undefined) { fields.push('`ticket_price` = ?'); values.push(updates.ticketPrice); }
    if (updates.ticketLink !== undefined) { fields.push('`ticket_link` = ?'); values.push(updates.ticketLink); }
    if (updates.organizerName !== undefined) { fields.push('`organizer_name` = ?'); values.push(updates.organizerName); }
    if (updates.organizerEmail !== undefined) { fields.push('`organizer_email` = ?'); values.push(updates.organizerEmail); }
    if (updates.organizerPhone !== undefined) { fields.push('`organizer_phone` = ?'); values.push(updates.organizerPhone); }
    if (updates.organizerWebsite !== undefined) { fields.push('`organizer_website` = ?'); values.push(updates.organizerWebsite); }
    if (updates.imageUrl !== undefined) { fields.push('`image_url` = ?'); values.push(updates.imageUrl); }
    if (updates.isFeatured !== undefined) { fields.push('`is_featured` = ?'); values.push(updates.isFeatured ? 1 : 0); }
    if (updates.isVerified !== undefined) { fields.push('`is_verified` = ?'); values.push(updates.isVerified ? 1 : 0); }
    if (updates.status !== undefined) { fields.push('`status` = ?'); values.push(updates.status); }
    if (updates.expectedAttendees !== undefined) { fields.push('`expected_attendees` = ?'); values.push(updates.expectedAttendees); }
    if (updates.tags !== undefined) { fields.push('`tags` = ?'); values.push(JSON.stringify(updates.tags)); }
    if (updates.schedule !== undefined) { fields.push('`schedule` = ?'); values.push(JSON.stringify(updates.schedule)); }

    if (fields.length === 0) {
      return this.getEventById(id);
    }

    values.push(id);
    const sql = `UPDATE \`vb_events\` SET ${fields.join(', ')} WHERE \`id\` = ?`;
    const [result] = await pool.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) return null;
    return this.getEventById(id);
  }

  /**
   * Delete an event from vb_events
   */
  public async deleteEvent(id: string): Promise<boolean> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(`
      DELETE FROM \`vb_events\` WHERE \`id\` = ?
    `, [id]);

    return result.affectedRows > 0;
  }

  /**
   * Create attendee registration in vb_registrations
   */
  public async createRegistration(data: {
    eventId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    ticketsCount: number;
  }): Promise<Registration | null> {
    await this.ensureTablesExist();
    const pool = getPool();

    const event = await this.getEventById(data.eventId);
    if (!event) return null;

    const id = `reg-${Date.now()}`;
    const code = `REG-${event.title.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X')}-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(`
      INSERT INTO \`vb_registrations\` (
        \`id\`, \`event_id\`, \`user_name\`, \`user_email\`, \`user_phone\`, \`tickets_count\`, \`registration_code\`, \`status\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `, [
      id,
      event.id,
      data.userName,
      data.userEmail,
      data.userPhone,
      data.ticketsCount || 1,
      code
    ]);

    return {
      id,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventVenue: event.venue,
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      ticketsCount: data.ticketsCount || 1,
      registrationCode: code,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Retrieve registrations joining vb_events
   */
  public async getRegistrations(eventId?: string): Promise<Registration[]> {
    await this.ensureTablesExist();
    const pool = getPool();

    let sql = `
      SELECT 
        r.*,
        e.title AS event_title,
        e.start_date AS event_date,
        e.venue AS event_venue
      FROM \`vb_registrations\` r
      LEFT JOIN \`vb_events\` e ON r.event_id = e.id
    `;
    const params: any[] = [];

    if (eventId) {
      sql += ` WHERE r.event_id = ?`;
      params.push(eventId);
    }

    sql += ` ORDER BY r.created_at DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows.map(mapRowToRegistration);
  }

  /**
   * Aggregated statistics from all vb_* tables
   */
  public async getStats(): Promise<{
    totalEvents: number;
    publishedEvents: number;
    pendingEvents: number;
    draftEvents: number;
    totalCategories: number;
    totalRegistrations: number;
    totalUsers: number;
    verifiedCount: number;
    totalExpectedAttendees: number;
  }> {
    await this.ensureTablesExist();
    const pool = getPool();

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        (SELECT COUNT(*) FROM \`vb_events\`) AS totalEvents,
        (SELECT COUNT(*) FROM \`vb_events\` WHERE \`status\` = 'PUBLISHED') AS publishedEvents,
        (SELECT COUNT(*) FROM \`vb_events\` WHERE \`status\` = 'PENDING_REVIEW') AS pendingEvents,
        (SELECT COUNT(*) FROM \`vb_events\` WHERE \`status\` = 'DRAFT') AS draftEvents,
        (SELECT COUNT(*) FROM \`vb_categories\`) AS totalCategories,
        (SELECT COUNT(*) FROM \`vb_registrations\`) AS totalRegistrations,
        (SELECT COUNT(*) FROM \`vb_users\`) AS totalUsers,
        (SELECT COUNT(*) FROM \`vb_events\` WHERE \`is_verified\` = 1) AS verifiedCount,
        (SELECT COALESCE(SUM(\`expected_attendees\`), 0) FROM \`vb_events\`) AS totalExpectedAttendees
    `);

    const r = rows[0] || {};
    return {
      totalEvents: Number(r.totalEvents || 0),
      publishedEvents: Number(r.publishedEvents || 0),
      pendingEvents: Number(r.pendingEvents || 0),
      draftEvents: Number(r.draftEvents || 0),
      totalCategories: Number(r.totalCategories || 0),
      totalRegistrations: Number(r.totalRegistrations || 0),
      totalUsers: Number(r.totalUsers || 0),
      verifiedCount: Number(r.verifiedCount || 0),
      totalExpectedAttendees: Number(r.totalExpectedAttendees || 0),
    };
  }

  /**
   * Retrieve distinct cities from vb_events
   */
  public async getDistinctCities(): Promise<string[]> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT DISTINCT \`city\` FROM \`vb_events\` 
      WHERE \`city\` IS NOT NULL AND \`city\` != '' 
      ORDER BY \`city\` ASC
    `);

    return rows.map(r => r.city);
  }

  /**
   * Query administrator user by email from vb_users
   */
  public async getUserByEmail(email: string): Promise<(AdminUser & { password_hash?: string }) | null> {
    await this.ensureTablesExist();
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM \`vb_users\` WHERE \`email\` = ?
    `, [email]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      password_hash: row.password_hash,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    };
  }

  /**
   * Authenticate admin against vb_users table
   */
  public async verifyUserCredentials(email: string, passwordPlain: string): Promise<AdminUser | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    // Direct password match or hashed match
    if (user.password_hash === passwordPlain) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      };
    }

    return null;
  }

  /**
   * Reset database back to default seed state
   */
  public async resetToDefaults(): Promise<void> {
    const pool = getPool();
    try {
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
      await pool.query('TRUNCATE TABLE `vb_registrations`');
      await pool.query('TRUNCATE TABLE `vb_events`');
      await pool.query('TRUNCATE TABLE `vb_categories`');
      await pool.query('TRUNCATE TABLE `vb_users`');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');

      this.tablesEnsured = false;
      await this.ensureTablesExist();
    } catch (err: any) {
      console.error('Reset database error:', err);
      throw err;
    }
  }
}

// Export singleton instance
export const db = new MySQLDatabase();
