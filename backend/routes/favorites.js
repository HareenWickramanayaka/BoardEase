const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const favoriteController = require('../controllers/favoriteController');

router.use(authenticate);

router.use((req, res, next) => {
  if (req.user.role === 'student') {
    return next();
  }

  return res.status(403).json({
    message: 'Only students can save homes.',
  });
});

router.get('/', favoriteController.getFavorites);
router.post('/:id', favoriteController.toggleFavorite);

module.exports = router;
