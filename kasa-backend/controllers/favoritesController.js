const { addFavorite, removeFavorite, listFavoritesForUser } = require('../services/favoritesService');
const statusFromError = require('../utils/statusFromError');

async function addForProperty(req, res) {
  const db = req.app.locals.db;
  try {
    const userId = req.user && req.user.id;
    const propertyId = req.params.id;
    const result = await addFavorite(db, userId, propertyId);
    res.status(200).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

async function removeForProperty(req, res) {
  const db = req.app.locals.db;
  try {
    const userId = req.user && req.user.id;
    const propertyId = req.params.id;
    const result = await removeFavorite(db, userId, propertyId);
    res.status(200).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

async function listForUser(req, res) {
  const db = req.app.locals.db;
  try {
    const userId = req.params.id;
    const list = await listFavoritesForUser(db, userId);
    res.json(list);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

module.exports = { addForProperty, removeForProperty, listForUser };
