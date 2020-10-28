const express = require('express');
const { check } = require('express-validator');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const teamController = require('../controllers/teamController');
const placeController = require('../controllers/placeController');
const workController = require('../controllers/workController');
const typeWorkController = require('../controllers/typeWorkController');
const activityController = require('../controllers/activityController');
const workActivityController = require('../controllers/workActivtyController');
const notificationController = require('../controllers/notificationController');
const mapController = require('../controllers/mapController');
const auth = require('../middleware/auth');
const router = express.Router();

module.exports = (io) => {
    //USERS
    router.post('/api/v1/user', auth, userController.insertUser);
    router.get('/api/v1/user', auth, userController.getUsers);
    router.get('/api/v1/user/filter/:name', auth, userController.getUsers);
    router.get('/api/v1/usersField', auth, userController.getUsersFieldManager);
    router.get('/api/v1/user/:id', auth, userController.getUser);
    router.put('/api/v1/user/:id', auth, userController.updateUser);
    router.delete('/api/v1/user/:id', auth, userController.deleteUser);
    //AUTH
    router.post('/api/v1/auth', [
        check('email', 'Email no válido').isEmail(),
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
    router.post('/api/v1/places', auth, placeController.masiveInsert);
    router.get('/api/v1/place', auth, placeController.getPlaces);
    router.get('/api/v1/place-search/:search', auth, placeController.getPlacesBySearch);
    router.get('/api/v1/place/:id', auth, placeController.getPlace);
    router.put('/api/v1/place/:id', auth, placeController.updatePlace);
    router.delete('/api/v1/place/:id', auth, placeController.deletePlace);
    router.delete('/api/v1/place-reset', auth, placeController.resetPlaces);
    router.post('/api/v1/place/file', auth, placeController.masiveInsert);
    //WORK
    router.post('/api/v1/work', auth, (req, res) => workController.insertWork(req, res, io) );
    router.get('/api/v1/work', auth, workController.getWorks);
    router.get('/api/v1/work-search/:search', auth, workController.getWorksBySearch);
    router.get('/api/v1/work-count/:filterZone', auth, workController.getCountWorks);
    router.get('/api/v1/work/:id', auth, workController.getWork);
    router.get('/api/v1/work/user/:id', auth, workController.getWorksByUser);
    router.put('/api/v1/work/:id', auth, workController.updateWork);
    router.put('/api/v1/work-status/:id', auth, workController.changeStatusWork);
    router.delete('/api/v1/work/:id', auth, workController.deleteWork);
    router.delete('/api/v1/work-reset', auth, workController.resetWorks);
    //TYPE WORK
    router.post('/api/v1/type-work', auth, typeWorkController.insertTypeWork);
    router.get('/api/v1/type-work', auth, typeWorkController.getTypesWork);
    router.get('/api/v1/type-work/:id', auth, typeWorkController.getTypeWorkById);
    router.put('/api/v1/type-work/:id', auth, typeWorkController.updateTypeWorkById);
    router.delete('/api/v1/type-work/:id', auth, typeWorkController.deleteTypeWorkById);
    //ACTIVITY
    router.post('/api/v1/activity', auth, activityController.insertActivity);
    router.get('/api/v1/activity/:typeWorkId', auth, activityController.getActivities);
    // router.get('/api/v1/activity/:id', auth, activityController.g);
    router.put('/api/v1/activity/:id', auth, activityController.updateActivity);
    router.delete('/api/v1/activity/:id', auth, activityController.deleteActivity);
    //WORK ACTIVITY
    router.get('/api/v1/work-activity/:workId', auth, workActivityController.getActivitiesByWork);
    router.get('/api/v1/reset-work-activity', auth, workActivityController.resetWorkActivities);
    // router.get('/api/v1/activity/:id', auth, activityController.g);
    router.put('/api/v1/work-activity/:id', auth, workActivityController.updateWorkActivity);
    // NOTIFICATION
    router.get('/api/v1/notification', auth, notificationController.getNotifications);
    // MAP
    router.get('/api/v1/map-coords', auth, mapController.getUsersCoords);
    return router;
}