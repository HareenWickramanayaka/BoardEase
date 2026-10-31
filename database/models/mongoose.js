let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  try {
    mongoose = require('../../backend/node_modules/mongoose');
  } catch (err) {
    throw new Error(
      'Mongoose not found. Make sure backend dependencies are installed via npm install in the backend directory.'
    );
  }
}

module.exports = mongoose;
