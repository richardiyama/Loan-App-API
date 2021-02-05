// /* eslint-disable @typescript-eslint/ban-ts-ignore */
// /* eslint-disable no-await-in-loop */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable prefer-destructuring */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-shadow */
// import { Request, Response, Router } from 'express';
// import { MongoClient } from 'mongodb';

// // import User from '../api/user/regular-user/user.model';
// import Loan from '../../__my-test__/loan/loan.model';
// import Card from '../../__my-test__/payment/card.model';
// import LoanOffer from '../../__my-test__/loan/loan-offer.model';
// // import B2BUser from '../api/user/tenant/b2b-user.model';
// import PermissionV2 from '../api/permission/permission-v2.model';
// // import { config } from 'secreta';
// // const PAYBUDDY_MONGODB_URL = `mongodb://xadmin:Domdam%401976%23%23@172.105.84.55:30303?&ssl=false`;

// const PAYBUDDY_MONGODB_URL =
//   'mongodb://samthedonz:SamAT1994@cluster0-shard-00-00-n3h7d.mongodb.net:27017,cluster0-shard-00-01-n3h7d.mongodb.net:27017,cluster0-shard-00-02-n3h7d.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

// export const migrationRouter = Router();

// let database: any = null;
// let dbo: any = null;
// export const startDatabase = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     if (dbo !== null) {
//       return res.status(200).json({
//         status: true,
//         data: 'database already running',
//       });
//     }

//     MongoClient.connect(PAYBUDDY_MONGODB_URL, (err, db) => {
//       if (err) {
//         return res.status(500).json({
//           status: false,
//           data: 'database unable to start',
//         });
//       }
//       database = db;
//       dbo = db.db('test');

//       return res.status(200).json({
//         status: true,
//         data: 'database started successfully',
//       });
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// export const migrateUsers = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     // MongoClient.connect(PAYBUDDY_MONGODB_URL, (err, db) => {
//     //   if (err) throw err;
//     //   const dbo = db.db('paybuddy');
//     const query = {};
//     dbo
//       .collection('permissions-v2')
//       .find(query)
//       .toArray(async (err, result) => {
//         if (err) throw err;

//         // for (const item of result) {
//         //   // result = result[0]
//         //   // const item = result[0];
//         //   // result.map(async (item) => {
//         //   // FIXME: user needs to update their pin

//         //   // skip user if it exists
//         //   // const existingUser: any = await User.findOne({
//         //   //   scheme: item.scheme,
//         //   //   mobile: item.mobile,
//         //   // });
//         //   // if (existingUser) {
//         //   //   continue;
//         //   // }
//         //   try {
//         //     const update = {
//         //       // _id: item._id,
//         //       roles: undefined,
//         //       role: 'user',
//         //     };
//         //     // @ts-ignore
//         //     const user = await User.findOneAndUpdate(
//         //       { scheme: item.scheme, mobile: item.mobile },
//         //       update,
//         //       { new: true },
//         //     );
//         //     console.log('dkk');
//         //     // const user = new User({
//         //     //   _id: item._id,
//         //     //   scheme: item.scheme || 'spectrum',
//         //     //   firstName: item.fName,
//         //     //   lastName: item.sName,
//         //     //   mobile: item.mobile,
//         //     //   bvn: item.bvn || Math.floor(Math.abs(Math.random() * 100000000)),
//         //     //   pin: item.xPin || 'no pin yet',
//         //     //   gender: item.sex,
//         //     //   dob: item.dob,
//         //     //   email: item.email,
//         //     //   channel: item.channel,
//         //     //   qrCode: item.qrCode,
//         //     //   imgUrl: item.imgUrl,
//         //     //   isVisible: item.isVisible,
//         //     //   isActive: item.active,
//         //     //   createdAt: item.regDate,
//         //     //   isSynced: item.isSynced,
//         //     //   mobileVerified: item.isMobileVerified,
//         //     //   referralCode: item.referralCode,
//         //     //   roles: item.xroles,
//         //     //   createdBy: item.createdBy,
//         //     //   wallet: item.wallet,
//         //     //   accounts: item.accounts
//         //     // });

//         //     // await user.save();
//         //   } catch (error) {
//         //     console.log(error);
//         //     // skip duplicate record
//         //     const duplicate = /duplicate/;
//         //     const invalid = /validation/;
//         //     if (error.message.search(duplicate) || error.message.search(invalid)) {
//         //       continue;
//         //     }

//         //     return res.status(500).json({
//         //       status: false,
//         //       data: null,
//         //     });
//         //   }
//         //   // });
//         // }

//         await new PermissionV2({
//           name: 'Default permissions',
//           permissions: [
//             { action: 'loans-menu', isPermitted: false, label: 'Loans menu' },
//             { action: 'accounts_cards-menu', isPermitted: false, label: 'Accounts/cards menu' },
//             { action: 'clients-menu', isPermitted: false, label: 'Clients menu' },
//             { action: 'commissions-menu', isPermitted: false, label: 'Commissions menu' },
//             { action: 'verification-menu', isPermitted: false, label: 'Verification menu' },
//             {
//               action: 'roles_permissions-menu',
//               isPermitted: false,
//               label: 'Roles permissions menu',
//             },
//             { action: 'client_dashboard-page', isPermitted: false, label: 'Client dashboard page' },
//             {
//               action: 'client_management-page',
//               isPermitted: false,
//               label: 'Client management page',
//             },
//             { action: 'loans_dashboard-page', isPermitted: false, label: 'Loans dashboard page' },
//             { action: 'loans_management-page', isPermitted: false, label: 'Loans management page' },
//             {
//               action: 'verification_BVNLookup-page',
//               isPermitted: false,
//               label: 'BVN look-up page',
//             },
//             {
//               action: 'verification_accountLookup-page',
//               isPermitted: false,
//               label: 'Account look-up Page',
//             },
//             { action: 'edit_user-button', isPermitted: false, label: 'Edit user button' },
//             { action: 'delete_user-button', isPermitted: false, label: 'Delete user button' },
//             { action: 'disburse_loan-button', isPermitted: false, label: 'Disburse loan button' },
//             { action: 'update_loan-button', isPermitted: false, label: 'Update loan button' },
//             { action: 'export_user-button', isPermitted: false, label: 'Export user button' },
//           ],
//         }).save();

//         // db.close();
//         console.log('all migration finished');
//         return res.status(200).json({
//           status: true,
//           data: 'migration completed',
//         });
//       });
//     // });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// export const migrateLoans = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     // MongoClient.connect(PAYBUDDY_MONGODB_URL, (err, db) => {
//     //   if (err) throw err;
//     //   const dbo = db.db('paybuddy');
//     dbo
//       .collection('xloans')
//       .find({})
//       .toArray(async (err, result) => {
//         if (err) throw err;

//         // const item = result[0];
//         for (const item of result) {
//           const existingLoan: any = await Loan.findOne({
//             scheme: item.scheme,
//             mobile: item.userMobile,
//             status: 'pending',
//           });

//           if (existingLoan) {
//             continue;
//           }
//           // const fullName = item.userFullname.split(' ');
//           let dueDate;
//           if (item.details[0].dueDate === '') {
//             dueDate = new Date();
//           } else {
//             const b = item.details[0].dueDate.split(' ');
//             dueDate = `${b[2].substring(0, 4)}-${b[1]}-${b[0]}T01:18:36.036+00:00`;
//           }

//           const loan = new Loan({
//             _id: item._id,
//             fullName: item.userFullname,
//             scheme: item.scheme,
//             mobile: item.userMobile,
//             status:
//               // eslint-disable-next-line no-nested-ternary
//               item.status === undefined
//                 ? 'pending'
//                 : item.status.toLowerCase() === 'rejected'
//                 ? 'declined'
//                 : item.status.toLowerCase(),
//             reason: 'no comment',
//             disbursementDate: item.disbursementDate || undefined,
//             narration: '',
//             details: [
//               {
//                 principal: {
//                   currency: 'NGN',
//                   amount: item.details[0].principal,
//                 },
//                 interest: {
//                   currency: 'NGN',
//                   amount: item.details[0].interest - item.details[0].principal,
//                 },
//                 repayment: {
//                   currency: 'NGN',
//                   amount: item.details[0].interest,
//                 },
//                 time: item.details[0].duration,
//                 rate: item.details[0].perc * 100,
//                 dueDate,
//               },
//             ],
//             disburseAccount: {
//               accountNumber: item.disburseAccount.account_no,
//               accountName: item.disburseAccount.account_name,
//               bankCode: item.disburseAccount.account_code,
//             },
//             createdAt: item.createdAt,
//           });

//           try {
//             await loan.save();
//           } catch (error) {
//             console.log(error);
//             // skip duplicate record
//             const duplicate = /duplicate/;
//             const invalid = /validation/;
//             if (error.message.search(duplicate) || error.message.search(invalid)) {
//               continue;
//             }

//             return res.status(500).json({
//               status: false,
//               data: null,
//             });
//           }
//           // });
//         }
//         database.close();
//         // db.close();
//         console.log('all migration finished');
//         return res.status(200).json({
//           status: true,
//           data: 'migration completed',
//         });
//       });
//     // });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// export const migrateCards = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     // MongoClient.connect(PAYBUDDY_MONGODB_URL, (err, db) => {
//     //   if (err) throw err;
//     //   const dbo = db.db('paybuddy');
//     dbo
//       .collection('account_cards')
//       .find({})
//       .toArray(async (err, result) => {
//         if (err) throw err;

//         // const item = result[0];
//         for (const item of result) {
//           const existingCard: any = await Card.findOne({
//             scheme: item.scheme,
//             accountNumber: item.account_no,
//           });

//           if (existingCard) {
//             continue;
//           }
//           // const fullName = item.userFullname.split(' ');
//           // let dueDate;
//           // if (item.details[0].dueDate === '') {
//           //   dueDate = new Date();
//           // } else {
//           //   const b = item.details[0].dueDate.split(' ');
//           //   dueDate = `${b[2].substring(0, 4)}-${b[1]}-${b[0]}T01:18:36.036+00:00`;
//           // }

//           const card = new Card({
//             scheme: item.scheme,
//             mobile: item.userMobile,
//             bankCode: item.bank_code,
//             accountNumber: item.account_no,
//             authorizationCode: item.authorization_code,
//             bin: item.bin,
//             last4: item.last4,
//             expMonth: item.exp_month,
//             expYear: item.exp_year,
//             channel: item.channel,
//             cardType: item.card_type,
//             bank: item.bank,
//             countryCode: item.country_code,
//             brand: item.brand,
//             default: item.default,
//             createdAt: item.createdAt,
//           });

//           try {
//             await card.save();
//           } catch (error) {
//             console.log(error);
//             // skip duplicate record
//             const duplicate = /duplicate/;
//             const invalid = /validation/;
//             if (error.message.search(duplicate) || error.message.search(invalid)) {
//               continue;
//             }

//             return res.status(500).json({
//               status: false,
//               data: null,
//             });
//           }
//           // });
//         }
//         database.close();
//         // db.close();
//         console.log('all migration finished');
//         return res.status(200).json({
//           status: true,
//           data: 'migration completed',
//         });
//       });
//     // });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// export const migrateLoanOffers = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     // MongoClient.connect(PAYBUDDY_MONGODB_URL, (err, db) => {
//     //   if (err) throw err;
//     //   const dbo = db.db('paybuddy');
//     dbo
//       .collection('xloanTemplate')
//       .find({})
//       .toArray(async (err, result) => {
//         if (err) throw err;

//         // const item = result[0];
//         for (const item of result) {
//           // const existingCard: any = await LoanOffer.findOne({
//           //   scheme: item.scheme,
//           // });

//           // if (existingCard) {
//           //   continue;
//           // }
//           // const fullName = item.userFullname.split(' ');
//           // let dueDate;
//           // if (item.details[0].dueDate === '') {
//           //   dueDate = new Date();
//           // } else {
//           //   const b = item.details[0].dueDate.split(' ');
//           //   dueDate = `${b[2].substring(0, 4)}-${b[1]}-${b[0]}T01:18:36.036+00:00`;
//           // }

//           const loanOffer = new LoanOffer({
//             scheme: item.scheme,
//             title: item.title,
//             description: item.description,
//             minAmount: item.loanAmtFrom,
//             maxAmount: item.loanAmtTo,
//             durationFrom: item.tenorFrom,
//             durationTo: item.tenorTo,
//             rate: item.interest,
//             minEarning: item.minSalary,
//             isCollateralRequired: item.isCollateralRequired,
//             requirements: item.requirements,
//             createAt: item.createAt,
//           });

//           try {
//             await loanOffer.save();
//           } catch (error) {
//             console.log(error);
//             // skip duplicate record
//             const duplicate = /duplicate/;
//             const invalid = /validation/;
//             if (error.message.search(duplicate) || error.message.search(invalid)) {
//               continue;
//             }

//             return res.status(500).json({
//               status: false,
//               data: null,
//             });
//           }
//           // });
//         }
//         database.close();
//         // db.close();
//         console.log('all migration finished');
//         return res.status(200).json({
//           status: true,
//           data: 'migration completed',
//         });
//       });
//     // });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// migrationRouter.get('/startDatabase', startDatabase);

// migrationRouter.get('/users', migrateUsers);

// migrationRouter.get('/loans', migrateLoans);

// migrationRouter.get('/cards', migrateCards);

// migrationRouter.get('/loans/offers', migrateLoanOffers);
