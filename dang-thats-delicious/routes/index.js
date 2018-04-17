const express = require('express');
const router = express.Router();
const {
  storeController,
  userController,
  authController,
  reviewController
} = require('../controllers');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.updatePassword)
);

router.get('/map', storeController.mapPage);
router.get('/hearts', catchErrors(storeController.getHearts));
router.post(
  '/reviews/:id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);
router.get('/top', catchErrors(storeController.getTopStores));

/*
API
*/
const apiPath = '/api';
router.get(`${apiPath}/search`, catchErrors(storeController.searchStores));
router.get(`${apiPath}/stores/near`, catchErrors(storeController.mapStores));
router.post(
  `${apiPath}/stores/:id/heart`,
  authController.isLoggedIn,
  catchErrors(storeController.getHearts)
);

module.exports = router;
