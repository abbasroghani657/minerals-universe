const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const dbUrl = process.env.DATABASE_URL || 'mysql://root:maaz@localhost:3306/abbasshoping';
let urlParsed;
try {
  urlParsed = new URL(dbUrl);
} catch (e) {
  urlParsed = new URL('mysql://root:maaz@localhost:3306/abbasshoping');
}

const adapter = new PrismaMariaDb({
  host: urlParsed.hostname || 'localhost',
  port: urlParsed.port ? Number(urlParsed.port) : 3306,
  user: urlParsed.username || 'root',
  password: urlParsed.password ? decodeURIComponent(urlParsed.password) : '',
  database: urlParsed.pathname.replace(/^\//, '') || 'abbasshoping',
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
    cat: 'Aquamarine',
    name: 'Natural Aquamarine Emerald Cut — 4.8 Cts',
    original: '$480',
    sale: '$385',
    priceNum: 385,
    badge: 'SALE',
    stock: 'Only 2 left',
    desc: 'A stunning natural aquamarine with exceptional clarity and a beautiful deep blue-green hue. Perfectly cut in an emerald pattern to maximize brilliance and fire.',
    origin: 'Pakistan',
    treatment: 'Unheated',
    cert: 'GIA'
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=800&q=80',
    cat: 'Garnet',
    name: 'Deep Red Pyrope Garnet Oval — 3.2 Cts',
    original: '$320',
    sale: '$245',
    priceNum: 245,
    badge: 'BEST SELLER',
    stock: null,
    desc: 'A rich, fiery deep red pyrope garnet. This oval cut gemstone exhibits wonderful internal reflections and exceptional luster under any lighting conditions.',
    origin: 'Afghanistan',
    treatment: 'None',
    cert: 'Local Lab'
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    cat: 'Tourmaline',
    name: 'Pink Tourmaline Cushion Cut — 6.1 Cts',
    original: '$920',
    sale: '$740',
    priceNum: 740,
    badge: 'NEW',
    stock: 'Only 1 left',
    desc: 'A vibrant pink tourmaline weighing over 6 carats. The cushion cut offers a classic vintage feel combined with modern brilliance, showing secondary violet flashes.',
    origin: 'Brazil',
    treatment: 'Heated',
    cert: 'IGI'
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&q=80',
    cat: 'Topaz',
    name: 'Imperial Topaz Pear Shape — 7.4 Cts',
    original: '$650',
    sale: '$510',
    priceNum: 510,
    badge: 'LOW STOCK',
    stock: 'Only 1 left',
    desc: 'A rare and valuable imperial topaz featuring warm, golden-orange hues. The elegant pear shape elongates the stone beautifully, highlighting its magnificent double-refractive colors.',
    origin: 'Russia',
    treatment: 'Irradiated',
    cert: 'GIA'
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80',
    cat: 'Aquamarine',
    name: 'Ocean Blue Aquamarine Round — 2.5 Cts',
    original: null,
    sale: '$490',
    priceNum: 490,
    badge: '',
    stock: null,
    desc: 'A round cut aquamarine of a beautiful pastel ocean blue color. Perfect for a delicate custom pendant or a premium engagement ring setting.',
    origin: 'Pakistan',
    treatment: 'Unheated',
    cert: 'GIA'
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    cat: 'Tourmaline',
    name: 'Watermelon Tourmaline Slice — 12.5 Cts',
    original: '$1200',
    sale: '$950',
    priceNum: 950,
    badge: 'RARE',
    stock: null,
    desc: 'A stunning watermelon tourmaline slice showcasing distinct green and pink concentric color zones. A true collector\'s item polished to a mirror-like finish.',
    origin: 'Brazil',
    treatment: 'None',
    cert: 'Local Lab'
  },
  {
    id: 101,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    cat: 'Sapphire',
    name: 'Royal Blue Sapphire — 2.8 Cts',
    original: '$1200',
    sale: '$950',
    priceNum: 950,
    badge: 'PREMIUM',
    stock: null,
    desc: 'An intense, royal blue sapphire with excellent transparency and rich color saturation. Sourced from the Kashmir region, this is an investment-grade gemstone.',
    origin: 'Kashmir',
    treatment: 'Unheated',
    cert: 'GIA'
  },
  {
    id: 102,
    img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=800&q=80',
    cat: 'Ruby',
    name: 'Pigeon Blood Ruby — 1.9 Cts',
    original: null,
    sale: '$1500',
    priceNum: 1500,
    badge: 'RARE',
    stock: null,
    desc: 'A highly sought-after pigeon blood red ruby from Burma. Features classic ruby red glow under UV and rich crystal saturation, cut to perfection.',
    origin: 'Burma',
    treatment: 'Heated',
    cert: 'IGI'
  },
  {
    id: 103,
    img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    cat: 'Emerald',
    name: 'Vivid Green Emerald — 3.5 Cts',
    original: '$850',
    sale: '$720',
    priceNum: 720,
    badge: '',
    stock: null,
    desc: 'A natural emerald showcasing a vivid green hue. Displays classic \'jardin\' inclusions characteristic of fine Colombian emeralds, adding unique character.',
    origin: 'Colombia',
    treatment: 'Minor Oiled',
    cert: 'GIA'
  },
  {
    id: 108,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    cat: 'Kunzite',
    name: 'Lilac Pink Kunzite — 15.2 Cts',
    original: null,
    sale: '$340',
    priceNum: 340,
    badge: '',
    stock: null,
    desc: 'A massive lilac-pink kunzite crystal with strong pleochroism. Shines with elegant violet tones from different angles, exhibiting high clarity.',
    origin: 'Afghanistan',
    treatment: 'None',
    cert: 'Local Lab'
  },
  {
    id: 109,
    img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&q=80',
    cat: 'Opals',
    name: 'Ethiopian Welo Opal — 5.8 Cts',
    original: '$220',
    sale: '$180',
    priceNum: 180,
    badge: '',
    stock: null,
    desc: 'A vibrant natural Welo opal with incredible broad-flash play-of-color. Shows bright neon greens, reds, and oranges from every perspective.',
    origin: 'Ethiopia',
    treatment: 'None',
    cert: 'Local Lab'
  },
  {
    id: 110,
    img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    cat: 'Peridot',
    name: 'Apple Green Peridot — 4.6 Cts',
    original: null,
    sale: '$150',
    priceNum: 150,
    badge: '',
    stock: null,
    desc: 'An apple-green peridot exhibiting high double-refraction and clean crystal quality. Sourced from the high-altitude Kohistan range.',
    origin: 'Pakistan',
    treatment: 'None',
    cert: 'GIA'
  },
  {
    id: 111,
    img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
    cat: 'Zircon',
    name: 'Blue Zircon Round Cut — 5.1 Cts',
    original: null,
    sale: '$210',
    priceNum: 210,
    badge: '',
    stock: null,
    desc: 'A bright blue zircon with high fire and dispersion, cut in a brilliant round pattern that rivals diamond brilliance under light.',
    origin: 'Cambodia',
    treatment: 'Heated',
    cert: 'GIA'
  },
  {
    id: 112,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    cat: 'Morganite',
    name: 'Peach Morganite Oval — 6.8 Cts',
    original: '$450',
    sale: '$380',
    priceNum: 380,
    badge: '',
    stock: null,
    desc: 'A romantic peach-pink morganite in a classic oval cut. Highly transparent with flawless clarity, perfect for rose gold custom jewelry settings.',
    origin: 'Madagascar',
    treatment: 'None',
    cert: 'IGI'
  },
  {
    id: 113,
    img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80',
    cat: 'Quartz',
    name: 'Clear Quartz Cluster — Fine Grade',
    original: null,
    sale: '$90',
    priceNum: 90,
    badge: '',
    stock: null,
    desc: 'A beautiful natural clear quartz crystal cluster, featuring multiple perfectly formed double-terminated points growing from a shared matrix.',
    origin: 'Pakistan',
    treatment: 'None',
    cert: 'None'
  },
  {
    id: 114,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    cat: 'Amethyst',
    name: 'Deep Purple Amethyst Geode',
    original: '$200',
    sale: '$160',
    priceNum: 160,
    badge: 'POPULAR',
    stock: null,
    desc: 'A premium deep purple amethyst cluster slice, exhibiting rich dark crystals with a natural protective agate rind around the edges.',
    origin: 'Uruguay',
    treatment: 'None',
    cert: 'None'
  },
  {
    id: 115,
    img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
    cat: 'Lapis Lazuli',
    name: 'Afghan Lapis Lazuli Polished',
    original: null,
    sale: '$120',
    priceNum: 120,
    badge: '',
    stock: null,
    desc: 'A fine polished block of authentic royal blue lapis lazuli from Badakhshan, Afghanistan, featuring beautiful gold pyrite specks and white calcite veins.',
    origin: 'Afghanistan',
    treatment: 'None',
    cert: 'None'
  }
];

async function main() {
  console.log('Seeding products database...');
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log('Seeding users...');
  const users = [
    {
      email: 'drtoolofficial@gmail.com',
      name: 'Admin Demo User',
      role: 'Admin'
    },
    {
      email: 'customer@mineralsuniverse.com',
      name: 'Customer Demo User',
      role: 'Customer'
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
