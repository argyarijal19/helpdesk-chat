const router = require('express').Router();

const {getFriends, messageUploadToDB, messageGet, imageMessageSend} = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends);
router.post('/send-message', authMiddleware, messageUploadToDB);
router.get('/get-message/:id', authMiddleware, messageGet);
router.post('/image-message-send', authMiddleware, imageMessageSend);



module.exports = router;