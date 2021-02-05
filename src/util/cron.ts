// /* eslint-disable @typescript-eslint/ban-ts-ignore */
// import { Request, Response, Router } from 'express';
// import { CronJob } from 'cron';
// import nodemailer from 'nodemailer';
// import fetch from 'node-fetch';
// import { encode } from 'base-64';
// import moment from 'moment';
// import { config } from 'secreta';
// import logger from './logger/logger';
// // import Loan from '../../__my-test__/loan/loan.model';

// const {
//   VTPASSBASEURL,
//   VTPASSUSERNAME,
//   VTPASSPASSWORD,
//   FLUTTERWAVE_SECRET,
//   PAYSTACK_SECRET,
// } = config;

// export const cronRouter = Router();

// // FIXME: change SMTP details, previous one is not working. this is test
// const transporter = nodemailer.createTransport({
//   host: 'mail.tobbyas.com',
//   port: 587,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: 'info@tobbyas.com',
//     pass: '2ao=4pW_hQf8',
//   },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });

// const sendMessage = ({
//   from = 'mail.tobbyas.com',
//   to = 'oluwatobi@tobbyas.com',
//   subject = 'New Notification',
//   text = 'This is auto-generated nofification',
// }) => {
//   const mailOptions = {
//     from,
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return logger.log('warn', `Error sending mail, error: ${error}`);
//     }
//     return logger.log('info', `email sent successfully ${info}`);
//   });
// };

// // @ts-ignore
// export const checkBalanceJobVtpass = new CronJob(
//   '0 0/2 * * *',
//   async () => {
//     try {
//       const response = await fetch(`${VTPASSBASEURL}/balance`, {
//         headers: {
//           // eslint-disable-next-line prefer-template
//           Authorization: 'Basic ' + encode(VTPASSUSERNAME + ':' + VTPASSPASSWORD),
//           'Content-Type': 'application/json',
//         },
//         method: 'GET',
//       });

//       const responseData = await response.json();
//       if (responseData.code === 1 && responseData.contents.balance < 5000) {
//         sendMessage({
//           text: `VTPASS balance is very low, please recharge. Balance: ${responseData.contents.balance}`,
//         });
//         return logger.log(
//           'info',
//           `VTPASS balance is very low, please recharge. Balance: ${responseData.contents.balance}`,
//         );
//       }
//       return logger.log(
//         'info',
//         `VTPASS balance is very ok. Balance: ${responseData.contents.balance}`,
//       );
//     } catch (error) {
//       return logger.log('warn', `Error requesting VTPASS balance, error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// // @ts-ignore
// export const checkBalanceJobFlutterwave = new CronJob(
//   '0 0/2 * * *',
//   async () => {
//     try {
//       const response = await fetch(`https://api.ravepay.co/v2/gpx/balance`, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         method: 'POST',
//         body: JSON.stringify({
//           currency: 'NGN',
//           seckey: FLUTTERWAVE_SECRET,
//         }),
//       });

//       const responseData = await response.json();
//       if (responseData.status === 'success' && responseData.data.AvailableBalance < 10000) {
//         sendMessage({
//           text: `Flutterwave balance is very low, please recharge Balance: ${responseData.data.AvailableBalance}`,
//         });
//         return logger.log(
//           'info',
//           `Flutterwave balance is very low, please recharge, Balance: ${responseData.data.AvailableBalance}`,
//         );
//       }
//       return logger.log(
//         'info',
//         `Flutterwave balance is very ok. Balance ${responseData.data.AvailableBalance}`,
//       );
//     } catch (error) {
//       return logger.log('warn', `Error requesting Flutterwave balance, error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// // @ts-ignore
// export const checkBalanceJobPaystack = new CronJob(
//   '0 0/2 * * *',
//   async () => {
//     try {
//       const response = await fetch(`https://api.paystack.co/balance`, {
//         headers: {
//           // eslint-disable-next-line prefer-template
//           Authorization: PAYSTACK_SECRET,
//           'Content-Type': 'application/json',
//         },
//         method: 'GET',
//       });

//       const responseData = await response.json();
//       if (responseData.status && responseData.data[0].balance < 1000000) {
//         sendMessage({
//           text: `Paystack balance is very low, please recharge. Balance: ${responseData.data[0].balance}`,
//         });
//         return logger.log(
//           'info',
//           `Paystack balance is very low, please recharge. Balance: ${responseData.data[0].balance}`,
//         );
//       }
//       return logger.log(
//         'info',
//         `Paystack balance is very ok, Balance: ${responseData.data[0].balance}`,
//       );
//     } catch (error) {
//       return logger.log('warn', `Error requesting Paystack balance, error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// // @ts-ignore
// export const checkDueLoans = new CronJob(
//   '0 0/6 * * *',
//   async () => {
//     try {
//       const query = { scheme: 'Buddy', status: 'disbursed' };
//       // @ts-ignore
//       let loans: any = await Loan.find(query);

//       // filter loans that is is due
//       loans = loans.filter((loan) => {
//         return moment() > moment(loan.details[loan.details.length - 1].dueDate);
//       });

//       if (loans.length > 0) {
//         // IDEA: send message to respective loan defaulters
//         sendMessage({
//           text: `There are ${loans.length} due loans, please check on admin portal`,
//         });
//         return logger.log(
//           'info',
//           `There are some ${loans.length} due loans, please check on admin portal`,
//         );
//       }
//       return logger.log('info', `There is no due loan`);
//     } catch (error) {
//       return logger.log('warn', `Error getting due loans, error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// // @ts-ignore
// export const checkAboutToDueLoans = new CronJob(
//   '0 0/6 * * *',
//   async () => {
//     try {
//       const query = { scheme: 'Buddy', status: 'disbursed' };
//       // @ts-ignore
//       let loans: any = await Loan.find(query);

//       // filter loans that is not yet due and 2 days before due
//       loans = loans.filter((loan) => {
//         return (
//           moment() < moment(loan.details[loan.details.length - 1].dueDate) &&
//           moment() > moment(loan.details[loan.details.length - 1].dueDate).subtract(2, 'days')
//         );
//       });

//       if (loans.length > 0) {
//         // IDEA: send message to respective loan defaulters
//         sendMessage({
//           text: `There are ${loans.length} due loans, please check on admin portal`,
//         });
//         return logger.log(
//           'info',
//           `There are some ${loans.length} due loans, please check on admin portal`,
//         );
//       }
//       return logger.log('info', `There is no due loan`);
//     } catch (error) {
//       return logger.log('warn', `Error getting due loans, error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// // @ts-ignore
// export const remitDueLoans = new CronJob(
//   '0 0/2 * * *',
//   async () => {
//     try {
//       const query = { scheme: 'Buddy', status: 'disbursed' };
//       // @ts-ignore
//       let loans: any = await Loan.find(query);

//       // filter loans that is not yet due and 2 hours before due
//       loans = loans.filter((loan) => {
//         return (
//           moment() < moment(loan.details[loan.details.length - 1].dueDate) &&
//           moment() > moment(loan.details[loan.details.length - 1].dueDate).subtract(2, 'hours')
//         );
//       });

//       if (loans.length > 0) {
//         // FIXME: deduct money from respective loan defaulters card

//         sendMessage({
//           text: `There are ${loans.length} due loans, please check on admin portal`,
//         });
//         return logger.log(
//           'info',
//           `There are some ${loans.length} due loans, please check on admin portal`,
//         );
//       }
//       return logger.log('info', `There is no due loan`);
//     } catch (error) {
//       return logger.log('warn', `Error remiting loans error: ${error}`);
//     }
//   },
//   null,
//   true,
//   'America/Los_Angeles',
// );

// const startAllJobs = () => {
//   checkBalanceJobVtpass.start();
//   checkBalanceJobFlutterwave.start();
//   checkBalanceJobPaystack.start();
//   checkDueLoans.start();
//   checkAboutToDueLoans.start();
//   remitDueLoans.start();
// };

// const stopAllJobs = () => {
//   checkBalanceJobVtpass.stop();
//   checkBalanceJobFlutterwave.stop();
//   checkBalanceJobPaystack.stop();
//   checkDueLoans.stop();
//   checkAboutToDueLoans.stop();
//   remitDueLoans.stop();
// };

// // startAlljobs
// startAllJobs();

// export const startCron = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     // job.start();
//     startAllJobs();

//     return res.status(200).json({
//       status: true,
//       message: 'cron jobs successfully started',
//       data: 'cron jobs successfully started',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// export const stopCron = async (req: Request, res: Response): Promise<any> => {
//   // const obj = req.body;
//   try {
//     stopAllJobs();

//     return res.status(200).json({
//       status: true,
//       message: 'cron jobs successfully stopped',
//       data: 'cron jobs successfully stopped',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       data: null,
//     });
//   }
// };

// cronRouter.get('/start', startCron);
// cronRouter.get('/stop', stopCron);
