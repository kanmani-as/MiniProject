import { Category, EventItem } from '@/types';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Cultural Festivals',
    slug: 'cultural-festivals',
    description: 'Traditional heritage celebrations, folk dance, dollu kunitha, deepotsavas, and seasonal harvest festivals.',
    icon: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    displayOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Religious & Temple Events',
    slug: 'religious-events',
    description: 'Annual Brahmotsavams, chariot Rathotsavas, sacred deepams, and devotional classical music sangeethams.',
    icon: 'Flame',
    color: 'from-orange-500 to-red-600',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-7935f8d2275f?w=800&auto=format&fit=crop&q=80',
    displayOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'College Fests & Tech',
    slug: 'college-events',
    description: 'Inter-collegiate cultural battles, hackathons, robotics arenas, battle of bands, and startup showcases.',
    icon: 'GraduationCap',
    color: 'from-blue-600 to-indigo-700',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
    displayOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Fairs & Exhibitions',
    slug: 'fairs-exhibitions',
    description: 'Handicraft bazaars, national book fairs, organic millet melas, flower shows, and artisan expos.',
    icon: 'Store',
    color: 'from-emerald-600 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    displayOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Music & Concerts',
    slug: 'music-concerts',
    description: 'Carnatic kacheris, Hindustani classical jugalbandis, indie rock bands, and acoustic unplugged evenings.',
    icon: 'Music',
    color: 'from-purple-600 to-pink-600',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    displayOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Workshops & Seminars',
    slug: 'workshops-seminars',
    description: 'Studio pottery, classical dance workshops, local history heritage walks, and urban gardening classes.',
    icon: 'BookOpen',
    color: 'from-cyan-600 to-blue-600',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
    displayOrder: 6,
  },
  {
    id: 'cat-7',
    name: 'Community & Sports',
    slug: 'community-sports',
    description: 'Heritage mini-marathons, charity cyclothons, cleanliness drives, and inter-neighborhood games.',
    icon: 'Users',
    color: 'from-rose-500 to-red-600',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    displayOrder: 7,
  },
];

export const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Grand Town Annual Deepam & Utsav Celebration',
    slug: 'grand-town-annual-deepam-utsav',
    shortDescription: 'A 3-day spiritual and cultural extravaganza featuring 10,000 oil lamps, classical sangeet, and traditional fairgrounds.',
    description: `Experience the luminous splendor of our historic annual town festival. Over three vibrant days, the ancient temple precinct and civic cultural grounds are illuminated by more than 10,000 hand-lit terracotta deepams. 

The celebration features:
- Daily evening Carnatic concerts by Vidwans and local school choirs.
- Grand Harikatha storytelling sessions detailing our town's folklore and river history.
- Traditional martial arts (Kalaripayattu and Garadi Mane) demonstrations.
- A bustling night bazaar with handloom textiles, Channapatna toys, brass handicrafts, and piping-hot regional sweets like Mysore Pak and Dharwad Peda.
- Free Annadanam (community sacred meal) served daily between 1:00 PM and 3:00 PM, and 7:30 PM to 9:30 PM.

All community members, pilgrims, and tourists are warmly invited to partake in this cultural landmark celebration.`,
    categoryId: 'cat-1',
    startDate: '2026-11-12',
    endDate: '2026-11-14',
    startTime: '05:30 PM',
    endTime: '10:00 PM',
    venue: 'Heritage Town Hall Grounds & Temple Street',
    address: 'Car Street, Gandhi Circle, Old Heritage Quarter',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570001',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'Town Cultural & Heritage Trust',
    organizerEmail: 'utsav@heritagetown.org',
    organizerPhone: '+91 98450 12345',
    organizerWebsite: 'https://heritagetown.org',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 15000,
    tags: ['Festival', 'Deepam', 'Cultural', 'Free Entry', 'Family Friendly'],
    schedule: [
      { time: '05:30 PM', title: 'Lighting of the Maha Deepam & Shahnai Recital', speakerOrPerformer: 'Temple Priests & Pt. Ramesh Shahnai Group' },
      { time: '06:30 PM', title: 'Classical Bharatanatyam Ensemble', speakerOrPerformer: 'Nritya Kunj Academy' },
      { time: '08:00 PM', title: 'Carnatic Vocal Concert by Vidwan S. Narayana', speakerOrPerformer: 'Vidwan S. Narayana (Mridangam: Vidwan Anantha)' },
      { time: '09:30 PM', title: 'Community Mahamangalarti and Deepa Daan', speakerOrPerformer: 'Trustees & Dignitaries' }
    ],
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'evt-2',
    title: 'Sri Veerabhadra Swamy Maha Rathotsavam (Chariot Procession)',
    slug: 'sri-veerabhadra-swamy-maha-rathotsavam',
    shortDescription: 'Historic 50-foot wooden temple chariot procession with thunderous Dollu Kunitha percussion and floral canopies.',
    description: `The sacred Rathotsavam of Sri Veerabhadra Swamy stands as one of the region's most revered annual gatherings. Thousands of devotees converge from surrounding taluks to pull the majestic, ornately sculpted 50-foot teakwood chariot along the sacred Raja Veedhi.

Key Highlights:
- Grand traditional percussion ensembles including Dollu Kunitha, Somana Kunitha, and Kerala Chenda Melam.
- Spectacular floral decorations utilizing marigolds and jasmine brought straight from rural farms.
- Ceremonial distribution of prasadam and sacred holy water.
- Dedicated family zones and drinking water points setup by municipal scouts.`,
    categoryId: 'cat-2',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    startTime: '08:00 AM',
    endTime: '02:00 PM',
    venue: 'Sri Veerabhadra Temple Precinct',
    address: 'Temple Main Gate, Fort Road',
    city: 'Shivamogga',
    state: 'Karnataka',
    pincode: '577201',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'Temple Religious Endowments Committee',
    organizerEmail: 'rathotsavam@shivamoggatemple.org',
    organizerPhone: '+91 81822 55667',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-7935f8d2275f?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 22000,
    tags: ['Religious', 'Temple', 'Rathotsavam', 'Heritage', 'Chariot'],
    schedule: [
      { time: '07:00 AM', title: 'Maha Abhishekam & Alankaram Rituals' },
      { time: '08:30 AM', title: 'Flag Hoisting & Chariot Invocation (Ratha Arohana)' },
      { time: '09:30 AM', title: 'Grand Chariot Pulling along Raja Veedhi' },
      { time: '01:00 PM', title: 'Maha Annadana Prasadam Feast for all devotees' }
    ],
    createdAt: '2026-10-16T11:00:00.000Z',
  },
  {
    id: 'evt-3',
    title: 'TechNova 2026: National Collegiate Hackathon & Tech Expo',
    slug: 'technova-2026-hackathon-tech-expo',
    shortDescription: 'A 36-hour code sprint, drone racing arena, AI robotics challenges, and keynote talks from industry tech leaders.',
    description: `TechNova 2026 is our flagship inter-collegiate innovation summit bringing together 1,200+ passionate student developers, UI designers, and hardware tinkerers from 85 colleges across South India.

Tracks & Competitions:
- 36-Hour Hackathon: Generative AI, Sustainable Smart Cities, Healthcare IoT, and Web3 Open Track.
- RoboWars Arena: Heavyweight and featherweight remote-controlled combat robots battling inside a shatterproof polycarbonate cage.
- Drone Racing Obstacle Course: High-speed FPV drone pilots dodging glowing neon rings.
- Project Expo & Startup Pitch: Present your final-year prototypes directly to seed angel investors and venture scouts.

Cash pool of Rs. 2,50,000 + guaranteed internship interview passes for top 10 finalists. Registration fee includes 4 buffet meals, midnight snacks, swag bag, and high-speed gigabit Wi-Fi.`,
    categoryId: 'cat-3',
    startDate: '2026-11-06',
    endDate: '2026-11-07',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    venue: 'College Campus Main Auditorium & Innovation Hub',
    address: 'Ring Road Campus, Vidyanagar Tech Enclave',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560076',
    isFree: false,
    ticketPrice: 150,
    organizerName: 'Student Technical Council & Dept of CSE',
    organizerEmail: 'technova@college.edu.in',
    organizerPhone: '+91 94480 88990',
    organizerWebsite: 'https://technova2026.college.edu.in',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 2500,
    tags: ['College', 'Hackathon', 'Coding', 'Robotics', 'Innovation'],
    schedule: [
      { time: '09:00 AM', title: 'Check-in, Swag Kit Distribution & Breakfast' },
      { time: '10:30 AM', title: 'Keynote Address: Scaling AI for Local Governance' },
      { time: '11:30 AM', title: 'Hackathon Hacking Begins (36 Hours Clock Starts)' },
      { time: '03:00 PM', title: 'RoboWars Round 1 Arena Eliminators' }
    ],
    createdAt: '2026-10-17T09:30:00.000Z',
  },
  {
    id: 'evt-4',
    title: 'Regional Swadeshi Handicrafts, Handlooms & Khadi Mela',
    slug: 'regional-swadeshi-handicrafts-khadi-mela',
    shortDescription: 'Over 140 master artisan stalls featuring Ilkal sarees, terracotta pots, brass idols, and regional culinary treats.',
    description: `Discover the unmatched beauty of authentic Indian handicrafts at the 18th edition of the Swadeshi Handloom & Artisan Fair.

Over 140 state-certified artisans and women self-help cooperative groups will directly showcase their handcrafted creations without any middlemen markup:
- Handwoven Ilkal, Guledgudd Khun, and Molakalmuru Silk Sarees.
- Intricate Bidriware silver inlay vases and keepsake boxes.
- Rosewood carving, sandalwood soaps, and Channapatna lacquered wooden toys.
- Authentic regional food court serving steaming Akki Rotti, Jolada Rotti Oota, freshly pressed sugarcane juice, and organic honey.
- Live potter's wheel demonstrations where visitors can shape their own clay cups.`,
    categoryId: 'cat-4',
    startDate: '2026-11-15',
    endDate: '2026-11-22',
    startTime: '10:00 AM',
    endTime: '09:00 PM',
    venue: 'District Exhibition Pavilion Grounds',
    address: 'Club Road, Opposite City Central Library',
    city: 'Hubballi',
    state: 'Karnataka',
    pincode: '580029',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'State Handloom & Handicrafts Development Board',
    organizerEmail: 'exhibitions@statehandicrafts.gov.in',
    organizerPhone: '+91 83623 44551',
    organizerWebsite: 'https://handicraftmela.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 18000,
    tags: ['Exhibition', 'Handicraft', 'Handloom', 'Shopping', 'Artisans'],
    createdAt: '2026-10-18T14:00:00.000Z',
  },
  {
    id: 'evt-5',
    title: 'Ragas by the Lake: Open-Air Twilight Classical & Fusion Sangeet',
    slug: 'ragas-by-the-lake-open-air-sangeet',
    shortDescription: 'An enchanting open-air evening of bamboo flute recitals, sitar-sarod jugalbandi, and acoustic fusion ensembles.',
    description: `Set against the calm waters of the lake promenade beneath a canopy of illuminated banyan trees, 'Ragas by the Lake' returns for an unforgettable twilight celebration of classical music.

Featured Artists:
- Vidwan Anand Swaminathan (Venu / Bamboo Flute) performing evening ragas like Marwa and Yaman.
- Pandit Vidyadhar Sharma (Sitar) with Ustad Imran Khan (Tabla) in a fiery Jugalbandi recital.
- The 'Bhoomi Acoustic Project' bringing together acoustic guitar, violin, and mridangam in meditative Indian folk-fusion arrangements.

Traditional woven floor mats, ambient kerosene lamps, and hot herbal kashaya / filter coffee will be available. Seating is on a first-come, first-served basis.`,
    categoryId: 'cat-5',
    startDate: '2026-11-08',
    endDate: '2026-11-08',
    startTime: '06:00 PM',
    endTime: '09:30 PM',
    venue: 'Sankey Lake Open-Air Amphitheatre',
    address: '18th Cross, Malleshwaram Lake Promenade',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560003',
    isFree: false,
    ticketPrice: 250,
    organizerName: 'City Arts & Music Foundation',
    organizerEmail: 'tickets@ragasbythelake.org',
    organizerPhone: '+91 97422 11002',
    organizerWebsite: 'https://ragasbythelake.org',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 750,
    tags: ['Music', 'Classical', 'Concert', 'Outdoor', 'Acoustic'],
    createdAt: '2026-10-19T08:00:00.000Z',
  },
  {
    id: 'evt-6',
    title: 'Traditional Terracotta Pottery & Clay Sculpting Studio Workshop',
    slug: 'terracotta-pottery-clay-sculpting-workshop',
    shortDescription: 'Hands-on weekend studio masterclass learning wheel throwing, trimming, and terracotta glazing.',
    description: `Step away from screens and connect with the grounding earth in this immersive 3-hour pottery workshop led by master craftsman Somanna, whose family has practiced clay sculpting for four generations.

What You Will Learn:
- Kneading and preparing natural river clay.
- Centering clay on an electric potter's wheel.
- Throwing bowls, cups, and miniature planters.
- Hand-building techniques including pinch pots, coils, and slab carving.
- Applying natural slip glazes and understanding kiln firing.

Every participant creates 3 custom items that will be fired in our kiln and packaged for collection within 7 days. All materials, aprons, and toolkits provided.`,
    categoryId: 'cat-6',
    startDate: '2026-11-28',
    endDate: '2026-11-28',
    startTime: '10:30 AM',
    endTime: '01:30 PM',
    venue: 'Creative Clay Guild Studio',
    address: 'Studio 4, Hesaraghatta Crafts Village',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560088',
    isFree: false,
    ticketPrice: 499,
    organizerName: 'Creative Clay Guild & Art Society',
    organizerEmail: 'workshops@creativeclay.org',
    organizerPhone: '+91 98860 33221',
    organizerWebsite: 'https://creativeclay.org',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 35,
    tags: ['Workshop', 'Pottery', 'Art', 'Handmade', 'Learning'],
    createdAt: '2026-10-20T12:00:00.000Z',
  },
  {
    id: 'evt-7',
    title: 'Green Heritage City Mini-Marathon & 5K Walk for Clean Air',
    slug: 'green-heritage-mini-marathon-5k-walk',
    shortDescription: 'Scenic 10K timed run and 5K family walk through century-old tree avenues and historic palace arches.',
    description: `Join over 3,000 citizens in the 5th annual Green Heritage Run promoting urban tree canopy preservation, clean air, and active fitness.

Race Categories:
- 10K Timed Heritage Challenge (Bib with RFID timing chip, cash trophies for top 3 male/female age categories).
- 5K Green Fun Walk & Jog (Non-timed, ideal for families, students, and seniors).

Registration includes:
- Breathable eco-friendly dry-fit running jersey.
- Commemorative engraved wooden finisher medal.
- Hydration and fruit energy stations every 1.5 km.
- Hot traditional wholesome breakfast (Idli-Vada and Sambhar) at the stadium finish line.
- Medical ambulances and physiotherapy support on-site.`,
    categoryId: 'cat-7',
    startDate: '2026-11-29',
    endDate: '2026-11-29',
    startTime: '05:45 AM',
    endTime: '09:30 AM',
    venue: 'Chamundi Sports Pavilion Main Arena',
    address: 'Pavilion Road, Near Racecourse Circle',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570005',
    isFree: false,
    ticketPrice: 199,
    organizerName: 'Civic Runners Collective & Green City Forum',
    organizerEmail: 'marathon@heritagerun.org',
    organizerPhone: '+91 99001 77665',
    organizerWebsite: 'https://heritagerun.org',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 3500,
    tags: ['Sports', 'Marathon', 'Fitness', 'Community', 'Health'],
    createdAt: '2026-10-21T07:15:00.000Z',
  },
  {
    id: 'evt-8',
    title: 'Winter Organic Millet & Desi Farmers Harvest Carnival',
    slug: 'winter-organic-millet-harvest-carnival',
    shortDescription: 'Celebration of indigenous super-grains, chemical-free farm produce, chef cook-offs, and folk sports.',
    description: `Celebrate our state's rich agro-biodiversity at the Winter Millet Harvest Carnival. Meet 60+ progressive organic farmers and farmer producer organizations (FPOs).

Festival Attractions:
- Rare heirloom seed bank exchange: Over 80 indigenous paddy varieties and 20 millet seeds.
- Live masterclass by heritage food researchers on cooking gluten-free millets (Ragi, Foxtail, Kodo, Barnyard).
- Cold-pressed oil extraction live press and stone-milled spices.
- Traditional village games zone featuring Gilli-Danda, Lagori, Pagade, and Buguri for children.
- Free soil testing clinic for terrace gardeners.`,
    categoryId: 'cat-4',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    startTime: '08:30 AM',
    endTime: '07:00 PM',
    venue: 'Gandhi Krishi Vigyana Kendra (GKVK) Exhibition Grounds',
    address: 'GKVK Campus, Bellary Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560065',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'Organic Farming & Biodiversity Forum',
    organizerEmail: 'carnival@organicmillets.in',
    organizerPhone: '+91 80 2345 6789',
    organizerWebsite: 'https://organicmillets.in',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 6000,
    tags: ['Fair', 'Organic', 'Millets', 'Farmers', 'Sustainability'],
    createdAt: '2026-10-21T16:00:00.000Z',
  },
  {
    id: 'evt-9',
    title: 'Kadlekai Parishe (Historic Bull Temple Groundnut Fair)',
    slug: 'kadlekai-parishe-bull-temple-fair',
    shortDescription: 'A 500-year-old traditional groundnut festival where thousands of farmers offer their first harvest to Nandi.',
    description: `Kadlekai Parishe is one of the oldest cultural traditions of the region, dating back more than 500 years to the Vijayanagara era. Farmers from across southern districts assemble to offer their first harvest of groundnuts to the monumental monolith Nandi bull at the Dodda Ganesha and Basavanagudi Temple.

Stretches of Bull Temple Road transform into an electric sea of stalls selling roasted, boiled, salted, spiced, and raw groundnuts alongside traditional bajji, sweet jalebis, sugarcane juice, and festive balloons.`,
    categoryId: 'cat-1',
    startDate: '2026-11-23',
    endDate: '2026-11-25',
    startTime: '09:00 AM',
    endTime: '11:00 PM',
    venue: 'Historic Bull Temple & Bugle Rock Grounds',
    address: 'Bull Temple Road, Basavanagudi',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560019',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'Basavanagudi Heritage & Religious Society',
    organizerEmail: 'parishe@basavanagudi.org',
    organizerPhone: '+91 80 2661 4488',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 80000,
    tags: ['Heritage', 'Parishe', 'Groundnut', 'Festival', 'Basavanagudi'],
    createdAt: '2026-10-22T06:00:00.000Z',
  },
  {
    id: 'evt-10',
    title: 'Coastal Yakshagana All-Night Mythological Performance',
    slug: 'coastal-yakshagana-all-night-performance',
    shortDescription: 'Vibrant coastal theatre featuring towering headgear, striking face paint, martial dance, and high-pitched chande beats.',
    description: `Immerse yourself in the hypnotic world of Badagu Tittu Yakshagana, the legendary traditional theatre form of coastal Karnataka. The troupe presents the epic episode 'Sudhanva Moksha'.

The all-night performance features:
- Intricate 'mukhada alankara' (face makeup) and magnificent 'kireeta' (golden crown headgear).
- Thunderous rhythm interplay between the Chande and Maddale drums.
- Spontaneous poetic dialogue recitation (arthadhari) blending philosophy, humor, and heroism.
- Tea and coastal snack counters open all night. Entry is free for all patrons of coastal folk art.`,
    categoryId: 'cat-1',
    startDate: '2026-12-12',
    endDate: '2026-12-13',
    startTime: '08:30 PM',
    endTime: '05:30 AM',
    venue: 'Kudroli Gokarnanatha Temple Cultural Stage',
    address: 'Kudroli, Alake',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575003',
    isFree: true,
    ticketPrice: 0,
    organizerName: 'Coastal Folk Arts Academy & Kudroli Trust',
    organizerEmail: 'yakshagana@kudroli.org',
    organizerPhone: '+91 824 249 5522',
    imageUrl: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 3000,
    tags: ['Yakshagana', 'Theatre', 'Folk', 'Coastal', 'AllNight'],
    createdAt: '2026-10-22T10:00:00.000Z',
  },
  {
    id: 'evt-11',
    title: 'Inter-College Battle of the Bands & Acoustic Rock Arena',
    slug: 'inter-college-battle-of-bands',
    shortDescription: 'Top 16 collegiate rock and fusion bands competing for the Golden Riff trophy and studio recording contract.',
    description: `Get ready for an electrifying evening of high-voltage riffs, pounding drum solos, and original songwriting! 16 finalist college bands selected from 50+ preliminary auditions will rock the open-air college quadrangle.

Judged by prominent independent music producers. Categories include Best Original Track, Best Lead Guitarist, Best Bassist, and Fan-Favorite Band. Food trucks, band merch booths, and acoustic relaxation tents on site.`,
    categoryId: 'cat-3',
    startDate: '2026-12-18',
    endDate: '2026-12-18',
    startTime: '04:00 PM',
    endTime: '10:00 PM',
    venue: 'St. Joseph University Open Amphitheatre',
    address: 'Langford Road, Shantinagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560027',
    isFree: false,
    ticketPrice: 120,
    organizerName: 'University Cultural Activities Committee',
    organizerEmail: 'musicfest@sju.edu.in',
    organizerPhone: '+91 98440 55443',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 1800,
    tags: ['College', 'Music', 'Bands', 'Rock', 'LiveConcert'],
    createdAt: '2026-10-22T15:00:00.000Z',
  },
  {
    id: 'evt-12',
    title: 'Historic Fort & Old Pete Heritage Guided Walking Tour',
    slug: 'historic-fort-old-pete-heritage-walk',
    shortDescription: 'Explore the 16th-century mud fort bastions, silk weaving lanes, and spice market alleyways with a historian.',
    description: `Step back in time to explore the founding footprint of the city with acclaimed author and architectural historian Dr. Meera Rao.

Route Highlights:
- The 1537 Kempegowda mud fort boundary remnants and granite gates.
- Dodda Pete and Chikka Pete: 400-year-old commerce streets, brass vessels alley, and hereditary silver smithies.
- Historic Sufi shrines and hidden temple step-wells (kalyanis).
- Includes traditional filter coffee and hot Khara Bath stop at an iconic 90-year-old local mess.

Group size limited to 25 people to ensure clear audio headsets and interactive discussion.`,
    categoryId: 'cat-6',
    startDate: '2026-11-21',
    endDate: '2026-11-21',
    startTime: '07:00 AM',
    endTime: '09:30 AM',
    venue: 'Bengaluru Fort Gate Promenade',
    address: 'Near Victoria Hospital, Fort Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560002',
    isFree: false,
    ticketPrice: 350,
    organizerName: 'City Heritage Chronicle & Walking Collective',
    organizerEmail: 'walks@heritagechronicle.org',
    organizerPhone: '+91 94800 22331',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
    isFeatured: false,
    isVerified: true,
    status: 'PUBLISHED',
    expectedAttendees: 25,
    tags: ['HeritageWalk', 'History', 'Culture', 'WalkingTour', 'Architecture'],
    createdAt: '2026-10-23T05:00:00.000Z',
  }
];
