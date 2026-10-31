const mongoose = require('../../database/models/mongoose');
const { Boarding } = require('../../database/models');

const validTypes = ['Single Room', 'Shared Room', 'Annex', 'Studio'];
const validGenders = ['Any', 'Male', 'Female'];

const fields = [
  'title',
  'city',
  'location',
  'description',
  'price',
  'deposit',
  'type',
  'gender',
  'beds',
  'baths',
  'availableSpots',
  'amenities',
  'image',
  'images',
  'phone',
  'featured',
];

function validate(data) {
  if (!data.title || data.title.trim().length < 5) {
    return 'Title must have at least 5 characters.';
  }

  if (!data.city?.trim() || !data.location?.trim()) {
    return 'City and location are required.';
  }

  if (!data.description || data.description.trim().length < 20) {
    return 'Description must have at least 20 characters.';
  }

  if (!Number.isFinite(Number(data.price)) || Number(data.price) < 1000) {
    return 'Monthly rent must be at least LKR 1,000.';
  }

  if (!validTypes.includes(data.type) || !validGenders.includes(data.gender)) {
    return 'Select valid boarding type and gender preference.';
  }

  const allImages =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.image
        ? [data.image]
        : [];

  if (allImages.length === 0) {
    return 'At least one photo is required.';
  }

  for (const img of allImages) {
    if (!/^https?:\/\//i.test(img || '') && !img.startsWith('data:image/')) {
      return 'Enter valid image URLs starting with http:// or https://, or upload image files.';
    }
  }

  if (!/^\+?[0-9\s-]{9,15}$/.test(data.phone || '')) {
    return 'Enter a valid contact number.';
  }

  for (const key of ['beds', 'baths', 'availableSpots', 'deposit']) {
    if (data[key] !== undefined && (!Number.isFinite(Number(data[key])) || Number(data[key]) < 0)) {
      return `Invalid ${key} value.`;
    }
  }

  if (Number(data.beds) < 1 || Number(data.baths) < 1) {
    return 'Beds and bathrooms must be at least 1.';
  }

  if (!Array.isArray(data.amenities)) {
    return 'Amenities must be a list.';
  }

  return null;
}

function normalize(body) {
  const result = {};

  for (const field of fields) {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
  }

  for (const field of ['price', 'deposit', 'beds', 'baths', 'availableSpots']) {
    if (result[field] !== undefined) {
      result[field] = Number(result[field]);
    }
  }

  if (body.images !== undefined) {
    if (Array.isArray(body.images)) {
      result.images = body.images.filter((image) => typeof image === 'string' && image.trim());
    } else if (typeof body.images === 'string' && body.images.trim()) {
      result.images = [body.images.trim()];
    }
  }

  if ((!result.images || result.images.length === 0) && result.image) {
    result.images = [result.image];
  }

  if ((!result.image || !result.image.trim()) && result.images && result.images.length > 0) {
    result.image = result.images[0];
  }

  result.featured = false;

  return result;
}

function isId(id) {
  return mongoose.isValidObjectId(id);
}

exports.getAllBoardings = async (req, res, next) => {
  try {
    const { search, city, type, gender, maxPrice, sort } = req.query;
    const query = {};

    if (search?.trim()) {
      const searchValue = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .slice(0, 80);

      query.$or = ['title', 'city', 'location'].map((key) => ({
        [key]: {
          $regex: searchValue,
          $options: 'i',
        },
      }));
    }

    if (city) {
      query.city = {
        $regex: city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    }

    if (type && validTypes.includes(type)) {
      query.type = type;
    }

    if (gender && validGenders.includes(gender)) {
      query.gender = {
        $in: [gender, 'Any'],
      };
    }

    if (maxPrice && Number.isFinite(Number(maxPrice))) {
      query.price = {
        $lte: Number(maxPrice),
      };
    }

    const sorts = {
      newest: { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
    };

    const results = await Boarding.find(query)
      .select('-phone -description -deposit')
      .sort(sorts[sort] || sorts.newest);

    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getMyBoardings = async (req, res, next) => {
  try {
    const results = await Boarding.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getBoardingById = async (req, res, next) => {
  try {
    if (!isId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid listing ID.',
      });
    }

    const item = await Boarding.findById(req.params.id).populate('owner', 'name email');

    if (!item) {
      return res.status(404).json({
        message: 'Boarding not found.',
      });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.createBoarding = async (req, res, next) => {
  try {
    const data = normalize(req.body);
    const error = validate(data);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const created = await Boarding.create({
      ...data,
      owner: req.user.id,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.updateBoarding = async (req, res, next) => {
  try {
    if (!isId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid listing ID.',
      });
    }

    const item = await Boarding.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Boarding not found.',
      });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You can edit only your own listings.',
      });
    }

    const data = {
      ...item.toObject(),
      ...normalize(req.body),
    };

    const error = validate(data);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    Object.assign(item, normalize(req.body));
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.deleteBoarding = async (req, res, next) => {
  try {
    if (!isId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid listing ID.',
      });
    }

    const item = await Boarding.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Boarding not found.',
      });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You can delete only your own listings.',
      });
    }

    await item.deleteOne();

    res.json({
      message: 'Boarding deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
