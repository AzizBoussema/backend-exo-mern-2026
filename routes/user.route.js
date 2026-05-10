const express = require("express");
const { getAllUsers, getOneUser, deleteUser, getMyProfile, updateMyProfile, toggleUserActive } = require("../controllers/users.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/all", isAdmin, getAllUsers);

// Routes statiques AVANT les routes dynamiques
router.get('/profile/me', isAuth, getMyProfile);
router.put('/profile/me', isAuth, updateMyProfile);

// Routes dynamiques après
router.get('/:id', isAdmin, getOneUser);
router.put('/:id/toggle-active', isAdmin, toggleUserActive);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
