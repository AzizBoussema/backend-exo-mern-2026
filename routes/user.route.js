const express = require("express");
const { getAllUsers, getOneUser, deleteUser, getMyProfile, updateMyProfile } = require("../controllers/users.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/all", isAdmin, getAllUsers);
//getOne User 
router.get('/:id', isAdmin, getOneUser)
//delete user 
router.delete('/:id', isAdmin, deleteUser)

// Routes pour les utilisateurs connectés
router.get('/profile/me', isAuth, getMyProfile);
router.put('/profile/me', isAuth, updateMyProfile);

module.exports = router;
