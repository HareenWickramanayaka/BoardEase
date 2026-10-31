const router = require('express').Router();
const { authenticate, ownerOnly } = require('../middleware/auth');
const requestController = require('../controllers/requestController');

router.use(authenticate);

router.post('/', requestController.createRequest);
router.get('/student', requestController.getStudentRequests);
router.get('/owner', ownerOnly, requestController.getOwnerRequests);
router.patch('/:id/status', ownerOnly, requestController.updateRequestStatus);

module.exports = router;
