-- ==============================================================================
-- LOCAL EVENT AND FESTIVAL INFORMATION WEBSITE (UtsavHub)
-- Complete MySQL Database Schema and Seed Data
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB, and phpMyAdmin
-- All tables are prefixed with vb_ (e.g., vb_users, vb_categories, vb_events, vb_registrations)
-- No Prisma ORM — Pure MySQL Native Driver (mysql2)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `local_events_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `local_events_db`;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE (vb_users)
-- Stores administrator and user accounts for authentication and role management
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `vb_registrations`;
DROP TABLE IF EXISTS `vb_events`;
DROP TABLE IF EXISTS `vb_categories`;
DROP TABLE IF EXISTS `vb_users`;

CREATE TABLE `vb_users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_vb_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE (vb_categories)
-- Stores event classifications, colors, and display icons
-- ------------------------------------------------------------------------------
CREATE TABLE `vb_categories` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'Calendar',
  `color` VARCHAR(100) DEFAULT 'from-amber-500 to-orange-600',
  `image_url` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_vb_categories_slug` (`slug`),
  INDEX `idx_vb_categories_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. EVENTS TABLE (vb_events)
-- Stores festival and event listings with full details, dates, and schedules
-- ------------------------------------------------------------------------------
CREATE TABLE `vb_events` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_description` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `start_time` VARCHAR(20) NOT NULL,
  `end_time` VARCHAR(20) NOT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20),
  `is_free` BOOLEAN DEFAULT TRUE,
  `ticket_price` DECIMAL(10,2) DEFAULT 0.00,
  `ticket_link` VARCHAR(500),
  `organizer_name` VARCHAR(200) NOT NULL,
  `organizer_email` VARCHAR(150),
  `organizer_phone` VARCHAR(50),
  `organizer_website` VARCHAR(255),
  `image_url` VARCHAR(500) NOT NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `status` ENUM('PUBLISHED', 'DRAFT', 'PENDING_REVIEW') DEFAULT 'PUBLISHED',
  `expected_attendees` INT DEFAULT 500,
  `tags` TEXT,
  `schedule` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_vb_events_category` (`category_id`),
  INDEX `idx_vb_events_status` (`status`),
  INDEX `idx_vb_events_dates` (`start_date`, `end_date`),
  INDEX `idx_vb_events_city` (`city`),
  INDEX `idx_vb_events_featured` (`is_featured`),
  CONSTRAINT `fk_vb_events_category` FOREIGN KEY (`category_id`) REFERENCES `vb_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. REGISTRATIONS TABLE (vb_registrations)
-- Stores attendee RSVP registrations, unique pass codes, and ticket details
-- ------------------------------------------------------------------------------
CREATE TABLE `vb_registrations` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `event_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_email` VARCHAR(150) NOT NULL,
  `user_phone` VARCHAR(50) NOT NULL,
  `tickets_count` INT DEFAULT 1,
  `registration_code` VARCHAR(50) NOT NULL UNIQUE,
  `status` ENUM('CONFIRMED', 'CANCELLED', 'ATTENDED') DEFAULT 'CONFIRMED',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_vb_reg_event` (`event_id`),
  INDEX `idx_vb_reg_code` (`registration_code`),
  CONSTRAINT `fk_vb_reg_event` FOREIGN KEY (`event_id`) REFERENCES `vb_events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- SAMPLE SEED DATA INSERTION
-- ==============================================================================

-- 1. Default Admin User in vb_users
INSERT INTO `vb_users` (`id`, `email`, `password_hash`, `name`, `role`) VALUES
('usr-admin-1', 'admin@localevents.gov', 'admin123', 'Municipal Event Administrator', 'SUPER_ADMIN');

-- 2. Initial Categories in vb_categories
INSERT INTO `vb_categories` (`id`, `name`, `slug`, `description`, `icon`, `color`, `image_url`, `display_order`) VALUES
('cat-1', 'Cultural Festivals', 'cultural-festivals', 'Traditional celebrations, heritage programmes, folk dance, and seasonal harvest festivals.', 'Sparkles', 'from-amber-500 to-red-600', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', 1),
('cat-2', 'Religious & Temple Events', 'religious-events', 'Annual temple Brahmotsavams, chariot processions, devotional sangeetham, and holy day observances.', 'Flame', 'from-orange-500 to-amber-600', 'https://images.unsplash.com/photo-1609137144822-7935f8d2275f?w=800&auto=format&fit=crop&q=80', 2),
('cat-3', 'College Fests & Tech', 'college-events', 'Inter-collegiate cultural battles, robotics hackathons, sports meets, and innovation expos.', 'GraduationCap', 'from-blue-600 to-indigo-700', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80', 3),
('cat-4', 'Fairs & Exhibitions', 'fairs-exhibitions', 'Handicraft bazaars, book fairs, organic agro-markets, science expos, and regional trade carnivals.', 'Store', 'from-emerald-500 to-teal-700', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80', 4),
('cat-5', 'Music & Concerts', 'music-concerts', 'Classical Carnatic, Hindustani jugalbandi, indie fusion bands, and open-air acoustic night jams.', 'Music', 'from-purple-600 to-pink-600', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80', 5),
('cat-6', 'Workshops & Seminars', 'workshops-seminars', 'Pottery, classical dance workshops, local history heritage walks, and urban gardening masterclasses.', 'BookOpen', 'from-cyan-600 to-blue-600', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80', 6),
('cat-7', 'Community & Sports', 'community-sports', 'Local mini-marathons, charity cyclothons, cleanliness drives, and inter-neighborhood cricket leagues.', 'Users', 'from-rose-500 to-red-600', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', 7);

-- 3. Initial Events in vb_events
INSERT INTO `vb_events` (`id`, `title`, `slug`, `short_description`, `description`, `category_id`, `start_date`, `end_date`, `start_time`, `end_time`, `venue`, `address`, `city`, `state`, `pincode`, `is_free`, `ticket_price`, `ticket_link`, `organizer_name`, `organizer_email`, `organizer_phone`, `organizer_website`, `image_url`, `is_featured`, `is_verified`, `status`, `expected_attendees`, `tags`, `schedule`) VALUES
('evt-1', 'Grand Town Annual Deepam & Utsav Celebration', 'grand-town-annual-deepam-utsav', 'A 3-day spiritual and cultural extravaganza featuring 10,000 oil lamps, classical sangeet, and traditional fairgrounds.', 'Experience the luminous splendor of our historic annual town festival. Over three vibrant days, the ancient temple precinct and civic cultural grounds are illuminated by more than 10,000 hand-lit terracotta deepams. Features daily evening Carnatic concerts, Harikatha recitals, martial arts demonstrations, and a bustling night bazaar with authentic local sweets, bronze craft, and traditional toys. Free Annadanam served daily.', 'cat-1', '2026-11-12', '2026-11-14', '05:30 PM', '10:00 PM', 'Heritage Town Hall Grounds & Temple Street', 'Car Street, Gandhi Circle, Old Heritage Quarter', 'Mysore', 'Karnataka', '570001', TRUE, 0.00, '', 'Town Cultural & Heritage Trust', 'utsav@heritagetown.org', '+91 98450 12345', 'https://heritagetown.org', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80', TRUE, TRUE, 'PUBLISHED', 15000, '["Festival", "Deepam", "Cultural", "Free Entry", "Family Friendly"]', '[{"time": "05:30 PM", "title": "Lighting of the Maha Deepam & Shahnai Recital", "speakerOrPerformer": "Temple Priests & Pt. Ramesh Shahnai Group"}, {"time": "07:00 PM", "title": "Carnatic Vocal Recital: Mysore Heritage Compositions", "speakerOrPerformer": "Vidushi Shwetha & Ensemble"}, {"time": "08:45 PM", "title": "Dollu Kunitha Folk Percussion Spectacle", "speakerOrPerformer": "Janapada Kala Thanda"}]'),

('evt-2', 'Sri Veerabhadra Swamy Rathotsavam (Chariot Procession)', 'sri-veerabhadra-swamy-rathotsavam', 'Magnificent temple car procession with traditional percussion (chendamelam), flower decorations, and folk ritual dance.', 'The historic temple Rathotsavam is celebrated with immense devotion and community fervor. The 50-foot ornately carved wooden chariot will be pulled by thousands of devotees through the Raja Veedhi. Highlights include thunderous Panchavadyam and Dollu Kunitha percussion ensembles, ceremonial sacred rituals, and widespread public Annadanam serving over 20,000 visitors.', 'cat-2', '2026-11-20', '2026-11-20', '08:00 AM', '02:00 PM', 'Sri Veerabhadra Temple Precinct', 'Temple Road, Fort Area', 'Shivamogga', 'Karnataka', '577201', TRUE, 0.00, '', 'Temple Religious Endowments Committee', 'contact@rathotsavam.org', '+91 81822 55667', '', 'https://images.unsplash.com/photo-1609137144822-7935f8d2275f?w=1200&auto=format&fit=crop&q=80', TRUE, TRUE, 'PUBLISHED', 20000, '["Temple", "Rathotsava", "Procession", "Spiritual", "Traditional"]', '[{"time": "08:00 AM", "title": "Maha Ganapathi Pooja & Kalasha Sthapana", "speakerOrPerformer": "Archaka Vrunda"}, {"time": "10:30 AM", "title": "Flag-off of the Sacred Chariot Pull", "speakerOrPerformer": "Community Devotees"}, {"time": "12:30 PM", "title": "Maha Mangalarathi & Annadanam Prasad", "speakerOrPerformer": "Temple Trust"}]'),

('evt-3', 'TechNova 2026: National Collegiate Hackathon & Tech Expo', 'technova-2026-hackathon', 'A 36-hour code sprint, drone racing arena, AI robotics challenges, and guest talks from tech founders.', 'TechNova 2026 brings together over 1,200 student innovators from 80+ engineering colleges across the state. Features include a non-stop 36-hour hackathon across AI/Web3/Sustainability tracks, battle of bots, RoboWars in an enclosed arena, project exhibitions, and keynote panels on future technologies. Exciting cash prizes worth Rs. 2,50,000 along with internship interviews for top performers.', 'cat-3', '2026-11-06', '2026-11-07', '09:00 AM', '06:00 PM', 'College Campus Main Auditorium & Innovation Hub', 'Ring Road Campus, Vidyanagar', 'Bengaluru', 'Karnataka', '560076', FALSE, 150.00, 'https://technova.college.edu.in/register', 'Student Technical Society & Dept of CS', 'technova@college.edu.in', '+91 94480 88990', 'https://technova.college.edu.in', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=80', TRUE, TRUE, 'PUBLISHED', 2500, '["Tech", "Hackathon", "Robotics", "College", "AI", "Students"]', '[{"time": "09:00 AM", "title": "Opening Keynote & Problem Statement Release", "speakerOrPerformer": "Dr. Arvind Rao (Director, AI Labs)"}, {"time": "10:30 AM", "title": "Hacking Phase 1 Begins (Round-the-clock)", "speakerOrPerformer": "All Participant Teams"}, {"time": "02:00 PM", "title": "Drone Obstacle Racing Qualifiers", "speakerOrPerformer": "Robotics Arena"}]'),

('evt-4', 'Regional Swadeshi Handicrafts & Khadi Mela', 'regional-swadeshi-handicrafts-khadi-mela', 'Over 120 artisan stalls showcasing handloom sarees, terracotta pottery, Bidriware, and organic spice stalls.', 'Support rural craftsmanship at the annual Swadeshi Craft Fair. Directly interact with master weavers and award-winning artisans from 14 districts. Live craft workshops, pottery wheel sessions for children, daily handloom fashion displays, and regional culinary stalls offering hot Jolada Rotti, authentic sweets, and freshly ground filter coffee.', 'cat-4', '2026-11-15', '2026-11-22', '10:00 AM', '09:00 PM', 'District Exhibition Grounds', 'Club Road, Near City Central Library', 'Hubballi', 'Karnataka', '580029', TRUE, 0.00, '', 'State Handloom & Handicrafts Development Board', 'exhibitions@statehandicrafts.gov', '+91 83623 44551', 'https://handicraftmela.gov.in', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80', FALSE, TRUE, 'PUBLISHED', 8000, '["Handicrafts", "Handloom", "Khadi", "Exhibition", "Rural Artisans"]', '[{"time": "11:00 AM", "title": "Live Loom Weaving Demonstration", "speakerOrPerformer": "Master Weaver Narayanappa"}, {"time": "04:30 PM", "title": "Childrens Terracotta Clay Modeling Workshop", "speakerOrPerformer": "Potters Guild"}, {"time": "06:30 PM", "title": "Handloom Heritage Fashion Showcase", "speakerOrPerformer": "State Textile Cooperative"}]'),

('evt-5', 'Ragas by the Lake: Open-Air Classical & Fusion Sangeet', 'ragas-by-the-lake-classical-sangeet', 'An enchanting evening of flute recitals, sitar-sarod jugalbandi, and Indian fusion ensembles beneath the twilight sky.', 'Set on the amphitheatre overlooking the serene lake waters, Ragas by the Lake celebrates the timeless heritage of classical Indian music. Featuring acclaimed maestro Pt. Vidyadhar Sharma on Sitar, accompanied by Vidwan Ramana on Mridangam and an unplugged acoustic fusion collective. Blankets and traditional floor seating available; hot organic herbal teas served.', 'cat-5', '2026-11-08', '2026-11-08', '06:00 PM', '09:30 PM', 'Sankey Lake Amphitheatre', '18th Cross, Malleshwaram Lake Promenade', 'Bengaluru', 'Karnataka', '560003', FALSE, 250.00, 'https://lakeconcerts.org/tickets', 'City Arts & Music Foundation', 'tickets@lakeconcerts.org', '+91 97422 11002', 'https://lakeconcerts.org', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80', TRUE, TRUE, 'PUBLISHED', 850, '["Music", "Classical", "Concert", "Sitar", "Open Air", "Lake"]', '[{"time": "06:00 PM", "title": "Opening Flute Recital: Raag Yaman", "speakerOrPerformer": "Smt. Rohini Deshmukh"}, {"time": "07:15 PM", "title": "Sitar & Sarod Jugalbandi in Raag Kirwani", "speakerOrPerformer": "Pt. Vidyadhar Sharma & Ustad Zameer"}, {"time": "08:45 PM", "title": "Twilight Indian Classical Fusion Finale", "speakerOrPerformer": "The Lake Collective"}]'),

('evt-6', 'Terracotta Pottery & Clay Sculpting Masterclass', 'terracotta-pottery-clay-masterclass', 'Hands-on weekend studio workshop learning wheel throwing, trimming, and traditional wood-firing techniques.', 'Discover the therapeutic art of pottery with master artisan Somanna. Participants will receive their own work table, natural clay, tools, and personalized guidance to craft tea kulhars, decorative pots, and miniature figurines. All finished artworks will be dried, bisqued, and available for pickup or courier delivery. Suitable for beginners and art enthusiasts of all ages.', 'cat-6', '2026-11-28', '2026-11-28', '10:30 AM', '01:30 PM', 'Creative Clay Guild Studio', 'Plot 42, Hesaraghatta Crafts Village', 'Bengaluru', 'Karnataka', '560088', FALSE, 499.00, 'https://creativeclay.org/book', 'Creative Clay Guild & Art Society', 'workshop@creativeclay.org', '+91 98860 33221', 'https://creativeclay.org', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&auto=format&fit=crop&q=80', FALSE, TRUE, 'PUBLISHED', 40, '["Workshop", "Pottery", "Sculpting", "Art", "Weekend"]', '[{"time": "10:30 AM", "title": "Clay Preparation & Kneading Basics", "speakerOrPerformer": "Artisan Somanna"}, {"time": "11:15 AM", "title": "Electric Wheel Throwing Experience", "speakerOrPerformer": "Hands-on Practice"}, {"time": "12:45 PM", "title": "Surface Texturing & Relief Sculpture", "speakerOrPerformer": "Masterclass Staff"}]'),

('evt-7', 'Green Heritage City Mini-Marathon & 5K Walk', 'green-heritage-mini-marathon-5k', 'Community 10K run and 5K fun walk promoting local urban biodiversity and clean air conservation.', 'Lace up your running shoes for the 4th edition of the Green Heritage Run. The scenic route winds through century-old tree-lined boulevards, heritage royal arches, and lake peripheries. Includes timing chip for 10K runners, eco-friendly dry-fit jersey, organic breakfast box, commemorative wooden medal, and live brass band at the finish line.', 'cat-7', '2026-11-29', '2026-11-29', '05:45 AM', '09:30 AM', 'City Stadium South Gate Pavilion', 'Stadium Road, Cantt Area', 'Mysore', 'Karnataka', '570005', FALSE, 200.00, 'https://cityrunners.org/register', 'Civic Citizens Runners Club', 'marathon@cityrunners.org', '+91 99001 77665', 'https://cityrunners.org', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80', FALSE, TRUE, 'PUBLISHED', 3500, '["Marathon", "Running", "Fitness", "Heritage", "Community"]', '[{"time": "05:45 AM", "title": "Warm-up Zumba & Instructions", "speakerOrPerformer": "Fitness Lead Neha"}, {"time": "06:15 AM", "title": "10K Timed Heritage Run Flag-off", "speakerOrPerformer": "City Police Commissioner"}, {"time": "06:40 AM", "title": "5K Family & Senior Walk Flag-off", "speakerOrPerformer": "Civic Dignitaries"}, {"time": "08:30 AM", "title": "Medal Distribution & Healthy Breakfast", "speakerOrPerformer": "Stadium Ground"}]'),

('evt-8', 'Winter Organic Farmers & Millet Harvest Carnival', 'winter-organic-farmers-millet-carnival', 'Celebrate indigenous grains, fresh organic farm produce, live cooking demos, and traditional folk games.', 'Join local agro-producers and tribal farming collectives for two days celebrating nutritious native millets (Ragi, Navane, Jowar) and chemical-free vegetables. Features live recipe demos by celebrity chefs, seed exchange counters, cold-pressed oil tasting, and traditional village games like Pagade and Chowka Bara for children.', 'cat-4', '2026-12-05', '2026-12-06', '08:30 AM', '07:00 PM', 'Gandhi Krishi Vigyana Grounds', 'GKVK Post, Bellary Road', 'Bengaluru', 'Karnataka', '560065', TRUE, 0.00, '', 'Sustainable Farming Federation', 'contact@organicmilletmela.in', '+91 80 2345 6789', 'https://organicmilletmela.in', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80', TRUE, TRUE, 'PUBLISHED', 4500, '["Organic", "Millet", "FarmersMarket", "FoodFestival", "Sustainability"]', '[{"time": "09:00 AM", "title": "Heritage Millet Seed Exchange Inauguration", "speakerOrPerformer": "Seed Savers Collective"}, {"time": "11:30 AM", "title": "Live Millet Culinary Masterclass", "speakerOrPerformer": "Chef Sandeep Shenoy"}, {"time": "03:00 PM", "title": "Folk Desi Games & Traditional Storytelling", "speakerOrPerformer": "Village Cultural Troupe"}]');

-- 4. Initial Sample RSVPs in vb_registrations
INSERT INTO `vb_registrations` (`id`, `event_id`, `user_name`, `user_email`, `user_phone`, `tickets_count`, `registration_code`, `status`) VALUES
('reg-1', 'evt-1', 'Ramesh Kulkarni', 'ramesh.k@gmail.com', '+91 98451 22334', 2, 'REG-UTSAV-8921', 'CONFIRMED'),
('reg-2', 'evt-3', 'Ananya Sharma', 'ananya.dev@outlook.com', '+91 97312 44556', 1, 'REG-TECH-4109', 'CONFIRMED'),
('reg-3', 'evt-5', 'Vikram Adiga', 'vikram.adiga@gmail.com', '+91 94480 33221', 3, 'REG-RAGAS-6652', 'CONFIRMED');
