const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, 
    resetPassword, getUserDetails, updatePassword, 
    updateProfile, getAllUsers, getOneUser, 
    updateUserRole, deleteUser } = require('../controller/user_controller');
    
const { isAuthentactedUser, authorizedRoles } = require('../middleware/auth');
const { route } = require('./productRoute');
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').get(isAuthentactedUser,logoutUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/profile').get(isAuthentactedUser,getUserDetails);

router.route('/password/update').put(isAuthentactedUser,updatePassword);

router.route('/profile/update').put(isAuthentactedUser,updateProfile);

router.route('/admin/users').get(isAuthentactedUser,authorizedRoles('admin'),getAllUsers);

router.route('/admin/user/:id')
.get(isAuthentactedUser,authorizedRoles('admin'),getOneUser)

.put(isAuthentactedUser,authorizedRoles('admin'),updateUserRole)

.delete(isAuthentactedUser,authorizedRoles('admin'),deleteUser);

module.exports = router;