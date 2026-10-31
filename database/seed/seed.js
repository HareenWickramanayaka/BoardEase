const path = require('path');

// Ensure dependencies can be resolved if run from database/ or backend/
module.paths.push(path.join(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const mongoose = require('../models/mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Boarding = require('../models/Boarding');

const image = {
  a: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
  b: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85',
  c: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85',
  d: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=1200&q=85',
  e: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
  f: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=85',
  g: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&q=85',
  h: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85'
};

const examples = [
  [
    'Sunlit Studio near Ruhuna University',
    'Matara',
    'Wellamadama',
    18000,
    'Studio',
    'Any',
    image.a,
    1,
    1,
    'A bright, peaceful studio with a private bathroom and study desk, just a short ride from campus.',
    ['Wi-Fi', 'Attached Bath', 'Study Desk', 'Parking']
  ],
  [
    'The Palm House - Girls Boarding',
    'Matara',
    'Nupe',
    12500,
    'Shared Room',
    'Female',
    image.b,
    2,
    1,
    'A secure, welcoming boarding home with furnished rooms and easy access to Matara town.',
    ['Wi-Fi', 'Security', 'Laundry', 'Kitchen']
  ],
  [
    'Coastal Corner Student Stay',
    'Galle',
    'Karapitiya',
    14500,
    'Single Room',
    'Any',
    image.c,
    1,
    1,
    'Simple, comfortable student accommodation near the hospital and regular bus routes.',
    ['Wi-Fi', 'Study Desk', 'Kitchen']
  ],
  [
    'The Green Nest Annex',
    'Colombo',
    'Nugegoda',
    34000,
    'Annex',
    'Any',
    image.d,
    2,
    1,
    'Independent annex with a spacious living area, good natural light and public transport nearby.',
    ['Wi-Fi', 'Parking', 'Kitchen', 'Attached Bath']
  ],
  [
    'Campus View Boarding',
    'Matara',
    'Dondra',
    10500,
    'Shared Room',
    'Male',
    image.e,
    2,
    1,
    'Affordable shared accommodation with a calm environment and practical facilities for students.',
    ['Wi-Fi', 'Laundry', 'Study Desk']
  ],
  [
    'Urban Hideaway Room',
    'Colombo',
    'Dehiwala',
    22000,
    'Single Room',
    'Female',
    image.f,
    1,
    1,
    'Cozy private room in a quiet residential neighbourhood with convenient transport connections.',
    ['Wi-Fi', 'Security', 'Kitchen', 'Attached Bath']
  ],
  [
    'Hillcrest Student Residence',
    'Kandy',
    'Peradeniya',
    16000,
    'Single Room',
    'Any',
    image.g,
    1,
    1,
    'Furnished room close to Peradeniya with reliable utilities and a peaceful study environment.',
    ['Wi-Fi', 'Study Desk', 'Parking']
  ],
  [
    'Seaside Shared Living',
    'Galle',
    'Unawatuna',
    13000,
    'Shared Room',
    'Male',
    image.h,
    2,
    1,
    'Friendly shared residence with airy rooms, kitchen access and easy commuting options.',
    ['Wi-Fi', 'Kitchen', 'Laundry']
  ]
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Ensure backend/.env exists and is configured.');
  }

  await mongoose.connect(mongoUri);

  const creds = [
    {
      name: 'Nimal Perera',
      email: 'owner@boardease.lk',
      password: 'Owner123!',
      role: 'owner'
    },
    {
      name: 'Kasun Silva',
      email: 'student@boardease.lk',
      password: 'Student123!',
      role: 'student'
    }
  ];

  for (const c of creds) {
    const user = await User.findOne({
      email: c.email
    });

    if (!user) {
      await User.create({
        ...c,
        password: await bcrypt.hash(c.password, 10)
      });
    }
  }

  const owner = await User.findOne({
    email: creds[0].email
  });

  const count = await Boarding.countDocuments({
    owner: owner._id
  });

  if (count === 0) {
    await Boarding.insertMany(
      examples.map((x, i) => ({
        title: x[0],
        city: x[1],
        location: x[2],
        price: x[3],
        type: x[4],
        gender: x[5],
        image: x[6],
        images: [x[6]],
        beds: x[7],
        baths: x[8],
        description: x[9],
        amenities: x[10],
        owner: owner._id,
        phone: '0771234567',
        deposit: x[3],
        availableSpots: (i % 3) + 1,
        featured: i < 3
      }))
    );

    console.log('Inserted 8 sample boarding listings.');
  } else {
    console.log('Listings already exist; not duplicated.');
  }

  console.log(
    'Demo accounts: owner@boardease.lk / Owner123! and student@boardease.lk / Student123!'
  );

  await mongoose.disconnect();
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Database seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding error:', err.message);
      process.exit(1);
    });
}

module.exports = seed;
