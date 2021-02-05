/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import express, { Request, Response, Application } from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import { connectMongo } from './@core/database/database.mongo';
import logger from './util/logger/logger';

// import routes
import { userRouter } from './api/user/user.route';
import { financeRouter } from './api/finance/finance.route';
import { cardRouter } from './api/card/card.route';
import { loanRouter } from './api/loan/loan.route';
import { transactionRouter } from './api/transaction/transaction.route';
import { branchRouter } from './api/branch/branch.route';
import { accountRouter } from './api/account/account.route';
import { billsRouter } from './api/bills/bills.route';
import { verificationRouter } from "./api/verification/verification.route";
import { walletRouter } from "./api/wallet/wallet.route";
import beneficiaryRouter from './api/beneficiary/beneficiary.route';
import { uploadRouter } from "./api/upload/upload.route";
import { emailRouter } from "./api/email/email.route";
import economicActivityRouter from './api/Economic-Activity/economic-activity.route';
import { feedbackRouter } from './api/feedback/feedback.route';
import { migrationsRouter } from './api/migration/migration.route';
import { permissionRouter } from './api/permission/permission.route';
import { agencyRouter } from './api/agency/agency.route';
//let httpsCa = require("https").globalAgent.options.ca;
//const sslRootCas = require("ssl-root-cas");
//httpsCa = sslRootCas;
//console.log(httpsCa);


// import { loanJobsService } from './api/AgendaJobs/agenda.controller';
// const a = new loanJobsService().processLoanJobs()

// console.log(a, "oooooooo");





// NOTE: for migration only, remove after all migrations

// NOTE: to run automate tasks at intervals
// import { cronRouter } from './util/cron';

// set up error handler
process.on('uncaughtException', (e: any) => {
  logger.log('error', e);
  process.exit(1);
});

process.on('unhandledRejection', (e: any) => {
  logger.log('error', e);
  process.exit(1);
});

// Create Express server
const app: Application = express();

// connect mongoDB
connectMongo();
// Express configuration
app.set('port', process.env.PORT || 5222);
app.use(cors());
app.use(compression());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true, limit: '50mb',
  parameterLimit: 100000,
}));
app.use(helmet());

// serve static files
// app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/uploads', express.static(path.join(__dirname, './public')))
// add route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/finances', financeRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/cards', cardRouter);
app.use('/api/v1/branches', branchRouter);
app.use('/api/v1/loans', loanRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/bills', billsRouter);
app.use('/api/v1/verify', verificationRouter);
app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/beneficiaries', beneficiaryRouter);
app.use('/api/v1/files', uploadRouter);
app.use('/api/v1/emails', emailRouter);
app.use("/api/v1/economicActivities", economicActivityRouter);
app.use("/api/v1/feedbacks", feedbackRouter);
app.use("/api/v1/migrations", migrationsRouter);
app.use("/api/v1/permission", permissionRouter);
app.use("/api/v1/agency", agencyRouter);


// NOTE: expose to provide on-the-fly start and stop of automated tasks
// app.use('/api/v2/crons', cronRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to RUBAC API',
  });
});

app.get('/docs', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './public/docs/redoc.html'));
});

export default app;
