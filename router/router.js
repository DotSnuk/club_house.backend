const { Router } = require('express');
const router = Router();
const controller = require('../controller/controller');

router.post('/createUser', controller.createUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logout);
router.post('/postPost', controller.postPost);
router.post('/postAdmin', controller.postAdmin);
router.get('/auth/status', controller.authStatus);
router.get('/getForums', controller.getForums);
router.get('/getForumWithId/:id', controller.getForumWithId);
router.get('/getPosts/:id', controller.getPosts);
// router.use('/success', controller.successLogin);
// router.use('/failed', controller.failedLogin);

router.get('/', (req, res) => {});

module.exports = router;
