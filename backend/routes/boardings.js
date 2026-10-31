const router = require('express').Router();
const { authenticate, ownerOnly } = require('../middleware/auth');
const boardingController = require('../controllers/boardingController');

router.get('/', boardingController.getAllBoardings);
router.get('/mine', authenticate, ownerOnly, boardingController.getMyBoardings);
router.get('/:id', authenticate, boardingController.getBoardingById);
router.post('/', authenticate, ownerOnly, boardingController.createBoarding);
router.put('/:id', authenticate, ownerOnly, boardingController.updateBoarding);
router.delete('/:id', authenticate, ownerOnly, boardingController.deleteBoarding);

module.exports = router;
