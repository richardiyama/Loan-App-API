/* eslint-disable import/prefer-default-export */
import express from 'express';

import { UserController } from './user.controller';
import { otpWithEmailSchema, sendFwOtpSchema, userSearchSchema, changePasswordV2, changePinV2, getSecQustn, secureLogin, resetCodeKirusa, userUpdateSchema } from './user.validator';
import {
  ninNumberSchema,
  driverLicenceSchema,
  ninPhoneSchema,
  addressSchema,
  guarantorSchema,
  deleteUserSchema,
  loginUserSchema,
  newPasswordSchema,
  phoneNumberSchema,
  otpSchema,
  mobileNumberSchema,
  newPinSchema,
  changePinSchema,
  userBVNSchema,
  userRegisterationScheman,
  forgetPasswordSendOTPSchema,
  resetPasswordSchema,
} from './user.validator';


import {
  inputValidator,
  isAuthenticated,
  // isPermitted,
} from '../../util/middleware';

export const userRouter = express.Router();

// @desc        Route to BVN verification
// @route       POST /api/v1/user/verifybvn
// @access      Public
userRouter.post(
  '/verifybvn',
  inputValidator({ body: userBVNSchema }),
  new UserController().userBVNVerification,
);

// @desc        Route for admin to update user
// @route       POST /api/v1/user/admin/update-user
// @access      Public
userRouter.post(
  '/admin/update-user/:userId',
  isAuthenticated,
  inputValidator({ body: userUpdateSchema }),
  new UserController().adminUpdateUser
);

// @desc        Route to user's registration
// @route       POST /api/v1/user/register
// @access      Public
userRouter.post(
  '/register',
  inputValidator({ body: userRegisterationScheman }),
  new UserController().userRegistration,
);

// @desc        Route to send OTP to user when they forgot password
// @route       POST /api/v1/user/forgetpassword
// @access      Public
userRouter.post(
  '/forgetpassword',
  inputValidator({ body: forgetPasswordSendOTPSchema }),
  new UserController().userForgotPasswordSendOTP,
);

// @desc        Route to reset user's password after they forgot password.
// @route       POST /api/v1/user/resetpassword
// @access      Public
userRouter.post(
  '/resetpassword',
  inputValidator({ body: resetPasswordSchema }),
  new UserController().resetPassword,
);

// @desc        Route to send OTP to user
// @route       POST /api/v1/user/registersendotp
// @access      Public
userRouter.post(
  '/registersendotp',
  inputValidator({ body: sendFwOtpSchema }),
  new UserController().registerSendOTPKirusa,
);

// @desc        Route to verify OTP sent to user
// @route       POST /api/v1/user/register
// @access      Public
userRouter.post(
  '/verifyregisterOTP',
  inputValidator({ body: otpSchema }),
  new UserController().verifyOTP
);

// @desc        Route to login user
// @route       POST /api/v1/user/login
// @access      Public
userRouter.post(
  '/login',
  inputValidator({ body: loginUserSchema }),
  new UserController().loginUser
);

userRouter.post(
  '/secureLogin',
  inputValidator({ body: secureLogin }),
  new UserController().secureLogin
);

userRouter.post(
  '/admin/login',
  inputValidator({ body: loginUserSchema }),
  new UserController().adminLogin
);

userRouter.post(
  '/admin/logout',
  inputValidator({ body: phoneNumberSchema }),
  new UserController().adminLogoutUser
);

userRouter.post(
  '/addressVerification/v1',
  inputValidator({ body: addressSchema }),
  new UserController().userAddressVerificationNifty
);
userRouter.post(
  '/addressVerification',
  inputValidator({ body: addressSchema }),
  new UserController().userAddressVerification
);

userRouter.post(
  '/guarantorVerification',
  inputValidator({ body: guarantorSchema }),
  new UserController().userGuarantorVerification
);

userRouter.post(
  '/ninVerification/nin',
  inputValidator({ body: ninNumberSchema }),
  new UserController().ninVerification
);

userRouter.post(
  '/ninVerification/mobile',
  inputValidator({ body: ninPhoneSchema }),
  new UserController().ninVerificationByMobileNumber
);

userRouter.post(
  '/driverLicenseVerification',
  inputValidator({ body: driverLicenceSchema }),
  new UserController().driverLicenseVerification
);

userRouter.delete(
  '/delete',
  inputValidator({ body: deleteUserSchema }),
  isAuthenticated,
  // isPermitted(['user:delete:any']),
  new UserController().deleteUser
);

userRouter.get(
  '/',
  inputValidator({ query: mobileNumberSchema }),
  isAuthenticated,
  new UserController().getUser
);

userRouter.post(
  '/admin/global/wallet',
  isAuthenticated,
  new UserController().getGlobalUserWallet
);

userRouter.post(
  '/admin/accountTypes/count',
  isAuthenticated,
  new UserController().getAccountRegistrationType
);

userRouter.post(
  '/admin',
  // isAuthenticated,
  // isPermitted(['user:read:own']),
  new UserController().getUsers
);

userRouter.post(
  '/admin/getAdmin',
  // isAuthenticated,
  // isPermitted(['user:read:own']),
  new UserController().fetchAdmin
);

userRouter.get(
  '/logout',
  isAuthenticated,
  new UserController().logoutUser
);

userRouter.get(
  '/sendOTP',
  inputValidator({ query: phoneNumberSchema }),
  new UserController().sendOTP
);

userRouter.post(
  '/sendOTPKirusa',
  inputValidator({ body: sendFwOtpSchema }),
  new UserController().sendOTPWithKirusa
);


userRouter.get(
  '/sendResetCode',
  inputValidator({ query: phoneNumberSchema }),
  new UserController().sendResetCode
);

userRouter.get(
  '/secQuestion',
  inputValidator({ query: getSecQustn }),
  new UserController().fetchSecQuestion
);


userRouter.post(
  '/sendResetCodeKirusa',
  inputValidator({ body: resetCodeKirusa }),
  new UserController().sendResetCodeKirusa
);

userRouter.put(
  '/resetPassword',
  inputValidator({ body: newPasswordSchema }),
  new UserController().resetPassword
);
userRouter.put(
  '/resetPin',
  inputValidator({ body: newPinSchema }),
  new UserController().resetPin
);

userRouter.put(
  '/changePin',
  inputValidator({ body: changePinSchema }),
  new UserController().changePin
);

userRouter.put(
  '/changePinV2',
  inputValidator({ body: changePinV2 }),
  new UserController().changePinV2
);

userRouter.post(
  '/searchUser',
  inputValidator({ body: userSearchSchema }),
  new UserController().searchUser
);

userRouter.post(
  '/queryUserByMobile',
  inputValidator({ body: phoneNumberSchema }),
  new UserController().searchUserByMobileNumberMatch
);

// userRouter.put(
//   '/changePassword',
//   inputValidator({ body: changePasswordSchema }),
//   new UserController().changePassword
// );

userRouter.put(
  '/changePasswordV2',
  inputValidator({ body: changePasswordV2 }),
  new UserController().changePasswordV2
);

userRouter.post(
  '/sendOtpSmsAndEmail',
  inputValidator({ body: otpWithEmailSchema }),
  new UserController().sendOtpSmsAndEmail
);

// userRouter.post(
//   '/sendOtpFw',
//   inputValidator({ body: sendFwOtpSchema }),
//   new UserController().sendFWOTP
// );

// userRouter.post(
//   '/sendOtpFwV2',
//   inputValidator({ body: sendFwOtpSchema }),
//   new UserController().sendFWOTPV2
// );

userRouter.post(
  '/admin/countUsers',
  new UserController().countUsers
);

userRouter.post(
  '/admin/account/summary',
  new UserController().getAccountSummary
);

userRouter.post(
  '/admin/account/referral',
  new UserController().getAccountOpenedByReferralByDateRange
);

userRouter.get(
  '/admin/loggedInUsers',
  new UserController().getCurrentlyLoggedInUsers
);

userRouter.post(
  "/webhook",
  new UserController().webHookData
)
