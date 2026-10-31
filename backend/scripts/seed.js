const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const seed = require('../../database/seed/seed');

seed()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  });
