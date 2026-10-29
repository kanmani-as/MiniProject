# UtsavHub — Local Event and Festival Information System

> A centralized full-stack web application designed to bring local cultural programmes, temple festivals, college events, fairs, exhibitions, concerts, and community celebrations together onto one convenient platform.

---

## 📌 1. Project Background & Need
Local events and festivals are an indispensable pillar of community life, tourism, and cultural preservation. However, information about upcoming gatherings is often scattered across physical posters, word-of-mouth, disparate social media channels, and personal messages. As a result, citizens and tourists frequently miss out on festivals or struggle to confirm accurate dates, venues, timings, entry criteria, and organizer contact details.

**UtsavHub** addresses this challenge by providing a verified, unified civic platform where visitors can discover and plan their participation in events happening nearby, while authorized administrators and event organizers maintain accurate, up-to-date listings.

---

## 🚀 2. System Scope & Core Features

### 1. Event Browsing
- **Curated Homepage**: Modern responsive layout showcasing upcoming celebrations, spotlight banners, and community highlights.
- **Featured Highlights Carousel**: High-impact rotating carousel showcasing major town festivals (e.g. Grand Deepotsava, Temple Rathotsavam, Collegiate Hackathons).
- **Comprehensive Cards**: Displays event banner photography, category tag, verified administrative badge, date range, timing, venue, city, and ticket price.

### 2. Live Search & Multi-Facet Filtering
- **Keyword Search**: Instant search by event name, festival keyword, artist, or organizer.
- **Category Filter**: Filter across cultural festivals, religious processions, college fests, fairs & exhibitions, music concerts, and workshops.
- **City & Locality Filter**: Filter across towns and districts (Bengaluru, Mysore, Shivamogga, Hubballi, Mangalore).
- **Date Timeline Filter**: Quick filters for *Today*, *Tomorrow*, *This Weekend*, *This Month*, or a *Custom Date Picker*.
- **Admission Pricing Filter**: Filter between Free Public Entry and Ticketed events.
- **Admin Verified Filter**: One-click toggle for administrator-verified listings.
- **Grid vs. List View**: Toggle between visual card grid and compact detailed list view.

### 3. Detailed Event Pages (`/events/[id]`)
- **Full Description & Cultural Background**: Complete narrative outlining the event's significance and attractions.
- **Programme Schedule / Agenda**: Day-by-day and hour-by-hour timeline breakdown (rituals, performances, competitions).
- **Venue & Interactive Navigation**: Detailed address with 1-click **Open in Google Maps** integration for turn-by-turn navigation.
- **Organizer Contact Profile**: Direct telephone, email, and official website links.
- **Add to Calendar**:
  - Download standard `.ICS` file for Apple Calendar, Outlook, and Android.
  - 1-click Google Calendar sync.
- **Social Sharing**: Direct share shortcuts for WhatsApp, Twitter / X, Email, and Copy Link.
- **Related Events**: Smart discovery of other gatherings in the same category or town.

### 4. Interactive Event Calendar (`/calendar`)
- Full interactive monthly calendar grid.
- Visual event indicators on dates with active programmes.
- Day-by-day drilldown displaying all events scheduled on any clicked date.

### 5. Category Management & Exploration (`/categories`)
- Dedicated category pages with rich photography and descriptions.
- Dynamic counts of active events under each category.

### 6. Personal Vault: Saved & Digital Passes (`/saved`)
- **Bookmarked Events**: Save interesting festivals to personal list (persisted locally).
- **Digital Passes**: Access all RSVP passes issued by the system anytime.

### 7. Instant RSVP & Digital Event Pass
- Visitors can register for free or ticketed events.
- Instantly issues an **Official Digital Event Pass** featuring:
  - Event title, venue, and date
  - Attendee name and ticket count
  - Unique Registration Code (e.g., `REG-UTSA-9821`)
  - Simulated **QR Code** for gate scanning
  - Printable pass layout (`window.print()`)

### 8. Community / Organizer Event Submission (`/submit-event`)
- Public form allowing local organizers, college committees, and temple trusts to submit their upcoming event.
- Submissions are automatically placed into the **Administrative Verification Queue** with `PENDING_REVIEW` status.

### 9. Comprehensive Administrator Dashboard (`/admin`)
- **KPI Metrics**: Total Listings, Published Events, Pending Review Queue, Total Registrations, Categories.
- **Event Listings Management**:
  - Full CRUD operations (Create, Read, Update, Delete).
  - 1-Click Publish / Unpublish toggle.
  - 1-Click Verified Badge toggle.
  - Edit modal supporting all event fields (dates, timings, tickets, organizer contacts, schedule).
- **Verification & Moderation Queue**: Review user-submitted listings with *Approve & Publish* or *Reject*.
- **Category Management**: Add new categories and edit classifications.
- **Visitor RSVPs & Attendee Log**: View all registrations with 1-Click **Export as CSV**.
- **MySQL Database Diagnostics**:
  - Displays configured `DATABASE_URL` (masked).
  - Table row counters (`events`, `categories`, `registrations`, `admin_users`).
  - 1-Click **Reset Demo Records** button to restore sample academic dataset.

---

## 🛠️ 3. Tech Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **Next.js 14** (App Router) | React 18, Server and Client Components, TypeScript |
| **Styling & Icons** | **Tailwind CSS** + **Lucide React** | Responsive design, festive color palette, glassmorphism |
| **Backend Services** | **Next.js API Routes** | RESTful endpoints for events, categories, registrations, admin auth |
| **Data Storage** | **MySQL Database** | Complete relational SQL DDL (`database/schema.sql`) using native `mysql2/promise` (No Prisma) |
| **Runtime Storage Engine** | **Native MySQL Driver** | Pure MySQL connection pooling and parameterized SQL queries across all `vb_` tables |

---

## 🗄️ 4. MySQL Database Schema (All Tables Prefixed with `vb_`)

The database is structured around 4 relational tables defined in `database/schema.sql`:

1. **`vb_users`**:
   - `id` (VARCHAR PK)
   - `email` (VARCHAR UNIQUE), `password_hash`, `name`, `role`
   - `created_at`, `updated_at`
2. **`vb_categories`**:
   - `id` (VARCHAR PK)
   - `name`, `slug` (UNIQUE)
   - `description`, `icon`, `color`, `image_url`, `display_order`, `created_at`
3. **`vb_events`**:
   - `id` (VARCHAR PK), `title`, `slug` (UNIQUE)
   - `short_description`, `description`
   - `category_id` (FK to `vb_categories.id`)
   - `start_date`, `end_date`, `start_time`, `end_time`
   - `venue`, `address`, `city`, `state`, `pincode`
   - `is_free` (BOOLEAN), `ticket_price` (DECIMAL), `ticket_link`
   - `organizer_name`, `organizer_email`, `organizer_phone`, `organizer_website`
   - `image_url`, `is_featured`, `is_verified`
   - `status` (ENUM: `'PUBLISHED'`, `'DRAFT'`, `'PENDING_REVIEW'`)
   - `expected_attendees`, `tags` (JSON/TEXT), `schedule` (JSON/TEXT)
   - `created_at`, `updated_at`
4. **`vb_registrations`**:
   - `id` (VARCHAR PK), `event_id` (FK to `vb_events.id`)
   - `user_name`, `user_email`, `user_phone`, `tickets_count`
   - `registration_code` (VARCHAR UNIQUE, e.g. `REG-UTSA-9821`)
   - `status` (ENUM: `'CONFIRMED'`, `'CANCELLED'`, `'ATTENDED'`)
   - `created_at`

---

## 💻 5. Running the Application

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Step 3: MySQL Database Setup & Seeding
Configure your MySQL database in `.env.local`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/local_events_db"
```
Run the automated seed script to create all `vb_` tables and insert sample records:
```bash
npm run db:seed
```
Alternatively, you can import `database/schema.sql` directly into MySQL / phpMyAdmin:
```bash
mysql -u root -p < database/schema.sql
```

---

## 🔐 6. Administrator Login Credentials
To access the Administrator Dashboard (`/admin` or `/admin/login`):
- **Email**: `admin@localevents.gov`
- **Password**: `admin123`
*(A 1-click **"Auto Fill"** or **"Quick Unlock (Demo Evaluation Mode)"** button is also provided for instant reviewer convenience.)*

---

## 🌟 7. Academic Verification & Evaluation Checklist
- [x] **Event Browsing**: Modern responsive homepage with Featured Carousel and Event Cards.
- [x] **Search & Filtering**: Live search by keyword, category chips, city dropdown, date timeline (today/tomorrow/weekend/month/custom), free/paid toggle, verified toggle.
- [x] **Event Details**: Complete description, agenda timeline, venue directions with Google Maps link, organizer profile, ticket info, .ICS calendar download, share modal.
- [x] **Category Management**: Categories with descriptions, event counts, and dedicated category views.
- [x] **Administrator Dashboard**: Add/Edit/Delete event listings, publish toggle, verify toggle, category manager, moderation queue, CSV registration export.
- [x] **Event Calendar**: Visual interactive calendar with month navigation and day schedule drilldown.
- [x] **Digital Passes**: RSVP booking with simulated QR code and unique pass code.
- [x] **Community Submissions**: Public organizer submission form with moderation pipeline.
- [x] **MySQL Schema & Scripts**: Standalone `database/schema.sql` with full table DDL and sample seed records.
