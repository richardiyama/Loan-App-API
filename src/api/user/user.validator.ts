/* eslint-disable import/prefer-default-export */
import joi from '@hapi/joi';

/////// IBRAHIM STARTING PART//////////

export const userBVNSchema = joi.object({
  bvn: joi.string().length(11).required()
});

export const userRegisterationScheman = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dateOfBirth: joi.string().required(),
  email: joi.string().email().required(),
  gender: joi.string().required(),
  role: joi.string().required(),
  securityQuestion: joi.string().required(),
  securityAnswer: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
  transactionPin: joi.string().length(4).required(),
  confirmTransactionPin: joi.string().length(4).required(),
  phone: joi.string().required(),
  bvn: joi.string().required(),
  LGA_ofOrigin: joi.string().required(),
  maritalStatus: joi.string().required(),
  levelOfAccount: joi.string().required(),
  profileCompletion: joi.number().required()
})


export const userUpdateSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  dateOfBirth: joi.string(),
  email: joi.string().email(),
  gender: joi.string(),
  role: joi.string(),
  password: joi.string(),
  phone: joi.string(),
  bvn: joi.string(),
  LGA_ofOrigin: joi.string(),
  maritalStatus: joi.string(),
  levelOfAccount: joi.string(),
  profileCompletion: joi.number()
})

export const forgetPasswordSendOTPSchema = joi.object({
  mobileNumber: joi.string().length(11).required(),
});

export const resetPasswordSchema = joi.object({
  mobileNumber: joi.string().length(11).required(),
  newPassword: joi.string().required(),
  confirmNewPass: joi.string().required(),
});

export const sendFwOtpSchema = joi.object({
  firstName: joi.string(),
  mobileNumber: joi.string().length(11).required(),
});

export const otpSchema = joi.object({
  mobileNumber: joi.string().required(),
  userOTP: joi.string().length(6).required(),
});

export const loginUserSchema = joi.object({
  phone: joi.string().length(11).required(),
  password: joi.string().required(),
});





const CommissionSchema = joi.object({
  name: joi.string(),
  percentage: joi.number().min(1).max(100),
});

export const ninNumberSchema = joi.object({
  mobileNumber: joi.string().required(),
  nin: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dob: joi.string(),
});
export const ninPhoneSchema = joi.object({
  mobileNumber: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dob: joi.string(),
});

export const driverLicenceSchema = joi.object({
  mobileNumber: joi.string().required(),
  licenseNumber: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dob: joi.string(),
});

export const addressSchema = joi.object({
  lga: joi.string().required(),
  address: joi.string().required().allow(''),
  state: joi.string().required(),
  street: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  idType: joi.string().required(),
  idNumber: joi.string().required(),
  city: joi.string().required(),
  landmark: joi.string(),
  dob: joi.string(),
  webHookUrl: joi.string(),
  mobileNumber: joi.string(),
});

const applicantSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string().required(),
  dob: joi.string(),
  mobileNumber: joi.string(),
  idType: joi.string().required(),
  idNumber: joi.string().required(),
})

export const guarantorSchema = joi.object({
  lga: joi.string().required(),
  state: joi.string().required(),
  email: joi.string().email().required(),
  mobileNumber: joi.string().required().length(11),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  applicant: applicantSchema,
  landmark: joi.string(),
  verifyAddress: joi.boolean(),
  street: joi.string().required(),
  webHookUrl: joi.string(),
  acceptableIdType: joi.array().items(joi.string()).required(),
});

export const secureLogin = joi.object({
  mobileNumber: joi.string().length(11).required(),
  password: joi.string().required(),
  secQstnAns: joi.string().required()
});

export const newPasswordSchema = joi.object({
  mobileNumber: joi.string().length(11).required(),
  resetCode: joi.string().required(),
  newPassword: joi.string().required()
});

export const newPinSchema = joi.object({
  mobileNumber: joi.string().length(11).required(),
  resetCode: joi.string().required(),
  newPin: joi.string().required().length(4)
});

export const changePinSchema = joi.object({
  userId: joi.string().required(),
  newPin: joi.string().required().length(4),
  currentPin: joi.string().required().length(4),
  password: joi.string().required()
});

export const changePinV2 = joi.object({
  userId: joi.string().required(),
  newPin: joi.string().required().length(4),
  secQstnAns: joi.string().required()
});

export const changePasswordSchema = joi.object({
  userId: joi.string().required(),
  newPassword: joi.string().required(),
  currentPassword: joi.string().required(),
});

export const changePasswordV2 = joi.object({
  userId: joi.string().required(),
  newPassword: joi.string().required(),
  secQstnAns: joi.string().required()
});



export const userSearchSchema = joi.object({
  fullName: joi.string().required()
});

export const updateUserSchema = joi.object({
  firstName: joi.string(),
  middleName: joi.string(),
  lastName: joi.string(),
  gender: joi.string(),
  dateOfBirth: joi.date(),
  address: joi.string(),
  emailAddress: joi.string().email(),
  mobileNumber: joi
    .string()
    .pattern(/^[+][\d]+/, { name: 'numbers' })
    .required(),
  initialDeposit: joi.string(),
  photoImage: joi.string(),
  signatureImage: joi.string(),
  bvn: joi.number(),
  branchCode: joi.string(),
  productCode: joi.string(),
  password: joi.string().required(),
  pin: joi.string(),
  accountNumber: joi.array().items(joi.string()),
});

export const deleteUserSchema = joi.object({
  mobileNumber: joi.string().length(11).required(),
});

// export const getUsersSchema = joi.object({});

export const phoneNumberSchema = joi.object({
  mobileNumber: joi.string().required(),
});

export const getSecQustn = joi.object({
  userId: joi.string(),
  mobileNumber: joi.string()
});

export const otpWithEmailSchema = joi.object({
  mobileNumber: joi.string().required(),
  firstName: joi.string().required(),
  emailAddress: joi.string().required()
});

// export const resetPasswordSchema = joi.object({
//   mobileNumber: joi
//     .string()
//     .pattern(/^[+][\d]+/, { name: 'numbers' })
//     .required(),
//   resetCode: joi.string().required(),
//   password: joi.string().required(),
// });

export const registerB2BUserSchema = joi.object({
  company: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  address: joi.string().empty(''),
  mobile: joi
    .string()
    .pattern(/^[+][\d]+/, { name: 'numbers' })
    .required(),
  email: joi.string().email().required(),
  expiresAt: joi.date(),
  account: joi.object({
    accountNumber: joi.string(),
    bankCode: joi.string(),
  }),
});



export const resetCodeKirusa = joi.object({
  firstName: joi.string(),
  mobileNumber: joi.string().length(11).required(),
  email: joi.string().email(),
  isAccount: joi.string()
});

export const sendKirusaOtpSchema = joi.object({
  firstName: joi.string(),
  mobileNumber: joi.string().length(11).required()
});

export const validateFwOtpSchema = joi.object({
  otp: joi.string().length(6),
  mobileNumber: joi.string().length(11).required(),
  reference: joi.string()
});

export const updateB2BUserSchema = joi.object({
  company: joi.string().required(),
  mobile: joi.string().pattern(/^[+][\d]+/, { name: 'numbers' }),
  email: joi.string().email(),
  commission: joi.array().items(CommissionSchema),
  firstName: joi.string(),
  lastName: joi.string(),
  createdAt: joi.date(),
  updatedAt: joi.date(),
  expiresAt: joi.date(),
  address: joi.string(),
  account: joi.object({
    accountNumber: joi.string(),
    bankCode: joi.string(),
  }),
});

export const searchSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  mobile: joi.string().pattern(/^[+][\d]+/, { name: 'numbers' }),
  bvn: joi.number(),
  email: joi.string(),
  channel: joi.string(),
  createdAt: joi.date(),
});

export const exportUserSchema = joi.object({
  startDate: joi.date(),
  endDate: joi.date(),
});

export const mobileNumberSchema = joi.object({
  full: joi.boolean()
});

export const reportProviderSchema = joi.object({});
