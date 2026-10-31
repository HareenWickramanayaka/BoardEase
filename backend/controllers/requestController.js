const mongoose = require('../../database/models/mongoose');
const { BookingRequest, Boarding } = require('../../database/models');

exports.createRequest = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit accommodation requests.' });
    }

    const { boardingId, message, moveInDate } = req.body;

    if (!mongoose.isValidObjectId(boardingId)) {
      return res.status(400).json({ message: 'Invalid boarding ID.' });
    }

    if (!message || message.trim().length < 5) {
      return res.status(400).json({ message: 'Please provide a message with at least 5 characters.' });
    }

    const parsedDate = new Date(moveInDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Please select a valid move-in date.' });
    }

    const boarding = await Boarding.findById(boardingId);
    if (!boarding) {
      return res.status(404).json({ message: 'Boarding listing not found.' });
    }

    // Check if student already has a pending request for this boarding
    const existing = await BookingRequest.findOne({
      student: req.user.id,
      boarding: boardingId,
      status: 'pending',
    });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending request for this boarding.' });
    }

    const newRequest = await BookingRequest.create({
      student: req.user.id,
      boarding: boarding._id,
      owner: boarding.owner,
      message: message.trim(),
      moveInDate: parsedDate,
      status: 'pending',
    });

    const populated = await BookingRequest.findById(newRequest._id)
      .populate('boarding', 'title city location price image type')
      .populate('owner', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.getStudentRequests = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view their accommodation requests.' });
    }

    const requests = await BookingRequest.find({ student: req.user.id })
      .populate('boarding', 'title city location price image type phone')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.getOwnerRequests = async (req, res, next) => {
  try {
    const requests = await BookingRequest.find({ owner: req.user.id })
      .populate('boarding', 'title city location price image type')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid request ID.' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'." });
    }

    const request = await BookingRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Accommodation request not found.' });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update requests for your own listings.' });
    }

    request.status = status;
    await request.save();

    const updated = await BookingRequest.findById(id)
      .populate('boarding', 'title city location price image type')
      .populate('student', 'name email');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
