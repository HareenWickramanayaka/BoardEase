const mongoose = require('../../database/models/mongoose');
const { User, Boarding } = require('../../database/models');

exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');

    if (!user) {
      return res.status(404).json({
        message: 'Account not found.',
      });
    }

    res.json(user.favorites.map(String));
  } catch (e) {
    next(e);
  }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid boarding ID.',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found.',
      });
    }

    const id = req.params.id;

    if (user.favorites.some((x) => String(x) === id)) {
      user.favorites = user.favorites.filter((x) => String(x) !== id);
    } else {
      if (!(await Boarding.exists({ _id: id }))) {
        return res.status(404).json({
          message: 'Boarding not found.',
        });
      }

      user.favorites.push(id);
    }

    await user.save();
    res.json(user.favorites.map(String));
  } catch (e) {
    next(e);
  }
};
