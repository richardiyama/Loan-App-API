
import joi from '@hapi/joi';


export const uploadToDisk = joi.object({
  userImage: joi.string().required(),
  phoneNumber: joi.string().required()
  // mobileNumber: joi.string().required(),
  // ref: joi.string().allow("")
});

export const userDoc = joi.object({
  folder: joi.string().required(),
  filename: joi.string().required(),
  userMobile: joi.string().required()
});
