const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/doctor/:doctorId', bookingController.getBookingsByDoctor);
router.get('/patient/:patientId', bookingController.getBookingsByPatient);
router.put('/cancel/:id', bookingController.cancelBooking);
router.get('/:id', bookingController.getBookingById);
//router.delete('/cleanup', bookingController.cleanupOldBookings);

module.exports = router;
