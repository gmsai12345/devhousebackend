const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const { getProfileId } = require('../controllers/authController');
const {
  createGroup,
  getGroup,
  createMessage,
  getGroupMessage,
  setSeenMessages,
  getUserGroup,
  getNotifications,
} = require('../controllers/group');

const {messagePhoto} = require('../controllers/messageController');

// router
// .route('/')
// .get(protect, getProfileId, getUserGroup)
// .post(protect, getProfileId, createGroup);
router
.route('/')
.get(getProfileId, getUserGroup)
.post( getProfileId, createGroup);

router.route('/notifications').get(getProfileId, getNotifications);
router.route('/:groupId').get(getProfileId, getGroup);
router
.route('/:groupId/message')
.post(getProfileId, createMessage)
.get(getProfileId, getGroupMessage);

router
.route('/:groupId/message/photo/:to')
.post(upload.single('image'), messagePhoto)


router.route('/:groupId/seen').patch(getProfileId, setSeenMessages);
// router.route('/like/:id').post(protect, likePost);
module.exports = router;
