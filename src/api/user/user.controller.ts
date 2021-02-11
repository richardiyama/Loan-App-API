/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
// import { Request, Response } from 'express';
// import fetch from 'node-fetch';
// import randomatic from 'randomatic';
import User from './user.model';
import logger from '../../util/logger/logger';
// import Loan from '../loan/loan.model';
// import UserTransaction from '../transaction/transaction.model';
// import Role from '../permission/role.model';
import { UserService } from './user.service';
import { Request, Response, NextFunction } from "express";
import { IResponse } from '../account/account.interface';
import { UniversalsController } from '../../@core/common/universals.controller';





export class UserController extends UniversalsController {

  public userBVNVerification = async (req: Request, res: Response) => {
    const { body, ip, method, originalUrl, hostname } = req;
    try {
      const response = await new UserService().processUserBVNVerification({ ip, method, originalUrl, hostname }, body);
      this.controllerResponseHandler(response, res)
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }


  public userRegistration = async (req: Request, res: Response): Promise<void> => {
    const { body, ip, method, originalUrl, hostname } = req;
    try {
      const response = await new UserService().processUserRegisteration(body, { ip, method, originalUrl, hostname });
      this.controllerResponseHandler(response, res)
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }


  public adminUpdateUser = async (req: Request, res: Response): Promise<void> => {
    const { body, ip, method, originalUrl, hostname, params } = req;
    try {
      const response = await new UserService().processUpdateUser(params, body, { ip, method, originalUrl, hostname });
      this.controllerResponseHandler(response, res)
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public userForgotPasswordSendOTP = async (req: Request, res: Response): Promise<void> => {
    const { ip, method, originalUrl, hostname, body } = req;
    try {
      const response = await new UserService().processForgotPasswordSendOTP(
        { ip, method, originalUrl, hostname },
        body,
      );
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await new UserService().processResetPassword(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public registerSendOTPKirusa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, method, originalUrl, hostname, body } = req;
    try {
      const response: IResponse = await new UserService().processRegisterSendOTPKirusa(
        { ip, method, originalUrl, hostname },
        body,
      );
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().verifyOTP(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processLogin(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };


  public sendResetCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processSendResetCode(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().sendOTP(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public sendOtpSmsAndEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processSendOTPSMSAndEmail(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public sendResetCodeKirusa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, method, originalUrl, hostname, body } = req;
    try {
      const response: IResponse = await new UserService().processSendResetCodeKirusa({ ip, method, originalUrl, hostname }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public sendOTPWithKirusa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, method, originalUrl, hostname, body } = req;
    try {
      const response: IResponse = await new UserService().processSendOTPWithKirusa({ ip, method, originalUrl, hostname }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  public countUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processCountUsers(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getAccountSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processGetAccountSummary(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getAccountOpenedByReferralByDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processAccountOpenedByReferralByDateRange(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getAccountRegistrationType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processAccountRegistrationType(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  public getCurrentlyLoggedInUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processCurrentlyLoggedInUsers(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query, method, originalUrl, ip, user } = req;
    try {
      const response: IResponse = await new UserService().processGetUser(user, query, { method, originalUrl, ip });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public searchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processSearchUsers(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
  public searchUserByMobileNumberMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processSearchUsersByMobile(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processGetUsers(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
  public fetchAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body, query, originalUrl, method, ip } = req;
      const response: IResponse = await new UserService().processFetchAdmin(body, query, originalUrl, method, ip);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public fetchSecQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ip, originalUrl, method } = req;
      const response: IResponse = await new UserService().processSecQuestion({ ip, originalUrl, method }, req.query);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }



  public resetPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processResetPin(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public changePin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processChangePin(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public changePasswordV2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, originalUrl, method } = req;
    const clientDetails = { ip, originalUrl, method }
    try {
      const response: IResponse = await new UserService().processChangePasswordV2(clientDetails, req.body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public changePinV2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, originalUrl, method } = req;
    const clientDetails = { ip, originalUrl, method }
    try {
      const response: IResponse = await new UserService().processChangePinV2(clientDetails, req.body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public secureLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, originalUrl, method } = req;
    const clientDetails = { ip, originalUrl, method }
    try {
      const response: IResponse = await new UserService().processSecureLogin(clientDetails, req.body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public adminLogoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processAdminLogout(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processAdminLogin(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public userAddressVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processUserAddressVerification(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
  public userAddressVerificationNifty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processUserAddressVerificationNifty(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
  public getGlobalUserWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processGlobalUserWallet(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public userGuarantorVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processUserGuarantorVerification(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
  public ninVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processNINVerification(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };


  public ninVerificationByMobileNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processNINVerificationByMobileNumber(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
  public driverLicenseVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new UserService().processDriverLicenseVerification(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public webHookData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new UserService().processWebHookData(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }


  public deleteUser = async (req: Request, res: Response): Promise<any> => {
    const obj = req.body;
    try {
      const query = { phone: obj.mobileNumber };

      const user: any = await User.findOneAndDelete(query);
      console.log(user);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'user not found',
          data: 'user not exist',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'user deleted successfully',
        data: {
          mobileNumber: user.mobileNumber,
        },
      });
    } catch (error) {
      logger.log('warn', `internal server error: ${error}`);

      return res.status(500).json({
        status: false,
        message: 'if this persit, please contact support',
        data: null,
      });
    }
  };




  // FIXME: implement true logout feature, create DB collection where all blacklisted token will be and check token in middleware
  public logoutUser = async (req: Request, res: Response): Promise<any> => {
    const obj = req.query;
    try {
      let query = {};
      if (Object.keys(obj).length > 0) {
        // populate query with obj fields and values
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'mobileNumber') {
            // @ts-ignore
            query = { ...query, [key]: `+${value.trim()}` };
          } else {
            query = { ...query, [key]: value };
          }
        }
      } else {
        return res.status(400).json({
          status: false,
          message: `invalid payload. mobileNumber is required`,
          data: null,
        });
      }
      const update = {
        auth: {
          accessToken: null,
          kind: null,
        },
      };
      const user: any = await User.findOneAndUpdate(query, update, { new: true });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'user not found',
          data: 'user not found',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'user logged out successfully',
        data: 'user logged out',
      });
    } catch (error) {
      logger.log('warn', `internal server error: ${error}`);

      return res.status(500).json({
        status: false,
        message: 'if this persit, please contact support',
        data: null,
      });
    }
  };
}




// export const search = async (req, res): Promise<any> => {
//   const obj: any = req.body;

//   // setting default limit to 50 and page to 1 if req.limit and/or req.page is undefined
//   const limit = req.limit || 50;
//   const page = req.page || 1;

//   const options = {
//     page,
//     limit,

//     sort: { createdAt: 'desc' },
//     collation: {
//       locale: 'en',
//     },
//     projection: {
//       pin: 0,
//     },
//   };

//   try {
//     let users: any;
//     if (obj.mobile) {
//       obj.mobile = `\\${obj.mobile}`;
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, mobile: { $regex: obj.mobile, $options: 'i' } },
//         options,
//       );
//     } else if (obj.firstName) {
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, firstName: { $regex: obj.firstName, $options: 'i' } },
//         options,
//       );
//     } else if (obj.lastName) {
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, lastName: { $regex: obj.lastName, $options: 'i' } },
//         options,
//       );
//     } else if (obj.bvn) {
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, bvn: { $regex: obj.bvn, $options: 'i' } },
//         options,
//       );
//     } else if (obj.email) {
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, email: { $regex: obj.email, $options: 'i' } },
//         options,
//       );
//     } else if (obj.createdAt) {
//       let startDate: any = new Date(obj.createdAt).setHours(0, 0, 0);
//       let endDate: any = new Date(obj.createdAt).setHours(23, 59, 59);

//       startDate = new Date(startDate);
//       endDate = new Date(endDate);

//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, createdAt: { $gte: startDate, $lte: endDate } },
//         options,
//       );
//     } else {
//       // @ts-ignore
//       users = await User.paginate(
//         { scheme: obj.scheme, channel: { $regex: obj.channel, $options: 'i' } },
//         options,
//       );
//     }
//     return res.status(200).json({
//       status: true,
//       message: 'search successful',
//       data: users.docs,
//       meta: {
//         total: users.totalDocs,
//         skipped: users.page * users.limit,
//         perPage: users.limit,
//         page: users.page,
//         pageCount: users.totalPages,
//         hasNextPage: users.hasNextPage,
//         hasPrevPage: users.hasPrevPage,
//       },
//     });
//   } catch (error) {
//     logger.log('warn', `internal server error: ${error}`);
//     return res.status(500).json({
//       status: false,
//       message: 'if this persit, please contact support',
//       data: null,
//     });
//   }
// };

// export const exportUser = async (req: Request, res: Response): Promise<any> => {
//   const obj: any = req.body;
//   try {
//     obj.startDate = new Date(obj.startDate).setHours(0, 0, 0);
//     obj.endDate = new Date(obj.endDate).setHours(23, 59, 59);

//     obj.startDate = new Date(obj.startDate);
//     obj.endDate = new Date(obj.endDate);

//     const users = await User.aggregate([
//       {
//         $match: {
//           scheme: obj.scheme,
//           createdAt: {
//             $gte: obj.startDate,
//             $lte: obj.endDate,
//           },
//         },
//       },
//       {
//         $project: {
//           pin: 0,
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: true,
//       message: 'search successful',
//       data: users,
//     });
//   } catch (error) {
//     logger.log('warn', `internal server error: ${error}`);
//     return res.status(500).json({
//       status: false,
//       message: 'if this persit, please contact support',
//       data: null,
//     });
//   }
// };

// export const reportProvider = async (req: Request, res: Response): Promise<any> => {
//   // const obj: any = req.body;
//   // try {
//   // const day = 1000 * 60 * 60 * 24;
//   const users = await User.aggregate([
//     {
//       $group: {
//         _id: '$scheme',
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   // FIXME: total value, double calculation
//   const loans = await Loan.aggregate([
//     { $unwind: '$details' },
//     {
//       $group: {
//         _id: '$scheme',
//         count: { $sum: 1 },
//         value: { $sum: '$details.principal.amount' },
//       },
//     },
//     {
//       $group: {
//         _id: 0,
//         item: { $push: { scheme: '$_id', count: '$count', value: '$value' } },
//       },
//     },
//     {
//       $project: { item: 1, _id: 0 },
//     },
//   ]);

//   const transactions = await UserTransaction.aggregate([
//     {
//       $facet: {
//         groupByScheme: [
//           {
//             $group: {
//               _id: '$scheme',
//               count: { $sum: 1 },
//               value: { $sum: '$amount' },
//             },
//           },
//         ],
//         all: [
//           {
//             $group: { _id: null, count: { $sum: 1 }, value: { $sum: '$amount' } },
//           },
//         ],
//         // FIXME: groupByMonth will also return transactions for previous years month
//         groupByMonth: [
//           {
//             $group: {
//               _id: { $month: '$createdAt' },
//               count: { $sum: 1 },
//               value: { $sum: '$amount' },
//             },
//           },
//         ],
//       },
//     },
//   ]);

//   return res.status(200).json({
//     status: true,
//     message: 'search successful',
//     data: {
//       users,
//       loans,
//       transactions,
//     },
//   });
//   // } catch (error) {
//   //   logger.log('warn', `internal server error: ${error}`);
//   //   return res.status(500).json({
//   //     status: false,
//   //     message: 'if this persit, please contact support',
//   //     data: null,
//   //   });
//   // }
// };

// export const reportTenant = async (req: Request, res: Response): Promise<any> => {
//   const obj: any = req.body;
//   try {
//     const users = await User.aggregate([
//       {
//         $facet: {
//           total: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             {
//               $group: {
//                 _id: '$scheme',
//                 count: { $sum: 1 },
//               },
//             },
//           ],
//           groupByMonth: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             {
//               $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } },
//             },
//           ],
//           groupByChannel: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             {
//               $group: { _id: '$channel', count: { $sum: 1 } },
//             },
//           ],
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: true,
//       message: 'search successful',
//       data: {
//         users,
//       },
//     });
//   } catch (error) {
//     logger.log('warn', `internal server error: ${error}`);
//     return res.status(500).json({
//       status: false,
//       message: 'if this persit, please contact support',
//       data: null,
//     });
//   }
// };

// export const reportLoans = async (req: Request, res: Response): Promise<any> => {
//   const obj: any = req.body;
//   try {
//     // FIXME: total value, double calculation,
//     // unwind destructures the details and array and make the total to cummulate for every entry instead one entry only (the last entry)

//     const loans = await Loan.aggregate([
//       {
//         $facet: {
//           groupByStatus: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             { $unwind: '$details' },
//             {
//               $group: {
//                 _id: '$status',
//                 count: { $sum: 1 },
//                 value: { $sum: '$details.principal.amount' },
//               },
//             },
//           ],
//           groupByMonth: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             {
//               $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } },
//             },
//           ],
//           groupByChannel: [
//             {
//               $match: {
//                 scheme: obj.scheme,
//               },
//             },
//             {
//               $group: { _id: '$channel', count: { $sum: 1 } },
//             },
//           ],
//         },
//       },
//     ]);

//     const theLoan = await Loan.find({ scheme: obj.scheme });
//     // @ts-ignore
//     const badLoan = checkLoan('badLoan', theLoan);

//     return res.status(200).json({
//       status: true,
//       message: 'search successful',
//       data: {
//         loans,
//       },
//     });
//   } catch (error) {
//     logger.log('warn', `internal server error: ${error}`);
//     return res.status(500).json({
//       status: false,
//       message: 'if this persit, please contact support',
//       data: null,
//     });
//   }
// };
