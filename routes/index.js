const express = require('express');
const { check } = require('express-validator');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const teamController = require('../controllers/teamController');
const placeController = require('../controllers/placeController');
const auth = require('../middleware/auth');
const router = express.Router();

module.exports = () => {
    //USERS
    router.post('/api/v1/user', auth, userController.insertUser);
    router.get('/api/v1/user', auth, userController.getUsers);
    router.get('/api/v1/usersField', auth, userController.getUsersFieldManager);
    router.get('/api/v1/user/:id', auth, userController.getUser);
    router.put('/api/v1/user/:id', auth, userController.updateUser);
    router.delete('/api/v1/user/:id', auth, userController.deleteUser);
    //AUTH
    router.post('/api/v1/auth', [
        check('email', 'Email no valido').isEmail(),
        check('password', 'El password debe tener minimo 6 caracteres').isLength({min: 6})
    ], authController.authUser);
    router.get('/api/v1/auth', auth, authController.getUserAuth);
    //TEAM
    router.post('/api/v1/team', auth, [
        check('name', 'El nombre no puede estar vacío').not().isEmpty()
    ], teamController.insertTeam);
    router.get('/api/v1/team', auth, teamController.getTeams);
    router.get('/api/v1/team/:id', auth, teamController.getTeam);
    router.put('/api/v1/team/:id', auth, teamController.updateTeam);
    router.delete('/api/v1/team/:id', auth, teamController.deleteTeam);
    //PLACE
    router.post('/api/v1/place', auth, [
        check('code_site', 'El código no puede estar vacío').not().isEmpty(),
        check('name', 'El nombre no puede estar vacío').not().isEmpty()
    ], placeController.insertPlace);
    router.get('/api/v1/place', auth, placeController.getPlaces);
    router.get('/api/v1/place/:id', auth, placeController.getPlace);
    router.put('/api/v1/place/:id', auth, placeController.updatePlace);
    router.delete('/api/v1/place/:id', auth, placeController.deletePlace);
    router.post('/api/v1/place/file', auth, placeController.insertMasivePlaces);
    return router;
}