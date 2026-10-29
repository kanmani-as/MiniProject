// ==============================================================================
// UTSAVHUB: MYSQL DATABASE SEEDER & INITIALIZATION SCRIPT
// Executes pure SQL commands directly on MySQL using mysql2
// No Prisma ORM — All tables use the vb_ prefix (vb_users, vb_categories, vb_events, vb_registrations)
// Run with: npm run db:seed
// ==============================================================================

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Simple .env.local / .env file reader
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          let val = trimmed.substring(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

function parseDbConfig() {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/local_events_db';
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname || 'localhost',
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: url.pathname ? url.pathname.replace(/^\//, '') : 'local_events_db',
    };
  } catch {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'local_events_db',
    };
  }
}

async function runSeed() {
  console.log('================================================================');
  console.log('  UTSAVHUB: LOCAL EVENT AND FESTIVAL INFORMATION SYSTEM');
  console.log('  MySQL Database Seeder & Schema Initializer (vb_ Tables)');
  console.log('================================================================\n');

  const config = parseDbConfig();
  console.log(`Connecting to MySQL host: ${config.host}:${config.port} as user: ${config.user}...`);

  let rootConnection;
  try {
    // 1. Connect without database first to ensure database exists
    rootConnection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      multipleStatements: true,
    });
    console.log('MySQL server connection established successfully.');

    console.log(`Creating database \`${config.database}\` if not exists...`);
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.query(`USE \`${config.database}\`;`);
    console.log(`Database \`${config.database}\` is ready.`);
  } catch (err) {
    console.error('\n[MySQL Connection Error]');
    console.error(`Failed to connect to MySQL on ${config.host}:${config.port}.`);
    console.error(`Error details: ${err.message || err.code || err}`);
    console.error('\nPlease verify that:');
    console.error('1. Your MySQL server (XAMPP / MySQL Service / Docker) is currently running.');
    console.error('2. DATABASE_URL in .env.local matches your MySQL user and password.');
    console.error('----------------------------------------------------------------\n');
    process.exit(1);
  }

  // 2. Read schema.sql
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`Schema file not found at ${schemaPath}`);
    await rootConnection.end();
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log(`\nExecuting schema file: ${schemaPath} (${(sql.length / 1024).toFixed(2)} KB)...`);

  try {
    // Execute SQL script
    await rootConnection.query(sql);
    console.log('Schema DDL and seed statements executed successfully.\n');

    // 3. Verify counts in all vb_* tables
    const [userRows] = await rootConnection.query('SELECT COUNT(*) AS c FROM `vb_users`');
    const [catRows] = await rootConnection.query('SELECT COUNT(*) AS c FROM `vb_categories`');
    const [eventRows] = await rootConnection.query('SELECT COUNT(*) AS c FROM `vb_events`');
    const [regRows] = await rootConnection.query('SELECT COUNT(*) AS c FROM `vb_registrations`');

    console.log('----------------------------------------------------------------');
    console.log('  TABLE ROW VERIFICATION (All tables prefixed with vb_):');
    console.log('----------------------------------------------------------------');
    console.log(`  - vb_users:         ${userRows[0].c} records`);
    console.log(`  - vb_categories:    ${catRows[0].c} records`);
    console.log(`  - vb_events:        ${eventRows[0].c} records`);
    console.log(`  - vb_registrations: ${regRows[0].c} records`);
    console.log('----------------------------------------------------------------');
    console.log('MySQL database initialized and seeded successfully!\n');
  } catch (err) {
    console.error('Error executing SQL statements:', err.message);
  } finally {
    await rootConnection.end();
  }
}

runSeed();
