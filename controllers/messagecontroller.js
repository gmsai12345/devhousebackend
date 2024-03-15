const Message = require('../models/Messages');
const uploadPhotoCloudinary = async (file) => {
    // if (file.mimetype.slice(0, 5) === 'video') {
    //   return next(new AppError('Please upload valid image', 400));
    // }
    const { public_id, secure_url } = await fileUpload(file);
  
    return {
      public_id,
      secure_url,
    };
  };
exports.messagePhoto = catchAsync(async (req, res, next) => {
    const photo = await uploadPhotoCloudinary(req.file);
    if (!message) {
      return next(new AppError('Message should not empty', 400));
    }
    const newMessage = await Message.create({
      message: photo,
      sender: req.profile,
      groupId: req.params.groupId,
      to: req.params.to,
    });
  
    const populatedMessage = await newMessage
      .populate({
        path: 'sender',
        select: 'username user name photo _id',
      })
      .execPopulate();
    return res.status(201).json({
      status: 'success',
      message: populatedMessage,
    });
  });