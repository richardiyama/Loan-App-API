import * as express from 'express';
import { LoanController } from './loan.controller';
import { inputValidator, isAuthenticated} from '../../util/middleware';
import {
  loanDropOffSchema,
  discontinueLoanSchema,
  loanStatusUpdateSchema,
  businessDetailsSchema,
  employeeDetailsSchema,
  uploadbusinessDetailsDocumentSchema,
  personalDetailsSchema,
  guarantorsDetailsSchema,
  meansOfIdentificationSchema,
  uploadDocumentSchema,
  calculateLoanSchema,
  setInterestRateSchema,
  loanEvaluationSchema
} from './loan.validator';
import {
  LoanSettingSchema, editLoanSettingsSchema, getLoansSchema, disburseLoanSchema, mobileNumberSchema, fetchLoanAdminSchema,BVNSchema,
} from './loan.validator';

export const loanRouter = express.Router();

/* @desc        Route to personal details post on taking loan
    @route       POST /api/v1/loans/personaldetails
    @access      Private
*/


loanRouter.post(
  '/personaldetails',
  inputValidator({ body: personalDetailsSchema }),
  isAuthenticated,
  new LoanController().personalDetails,
);

/* @desc        Route to business details post on taking loan
   @route       POST /api/v1/loans/businessdetails
   @access      Private
*/
loanRouter.post(
  '/businessdetails',
  inputValidator({ body: businessDetailsSchema}),
  isAuthenticated,
  new LoanController().businessDetails
);


/* @desc        Route to employee details post on taking loan
   @route       POST /api/v1/loans/employeedetails
   @access      Private
*/
loanRouter.post(
  '/employeedetails',
  inputValidator({ body: employeeDetailsSchema}),
  isAuthenticated,
  new LoanController().employeeDetails
);


/* @desc        Route to business details documents post on taking loan
   @route       POST /api/v1/loans/businessdetaildocuments
   @access      Private
*/
loanRouter.post(
  '/businessdetaildocuments',
  inputValidator({ body: uploadbusinessDetailsDocumentSchema}),
  isAuthenticated,
  new LoanController().uploadBusinessDetails
);


/* @desc        Route to guarantors details post on taking loan
   @route       POST /api/v1/loans/guarantorsdetails
   @access      Private
*/
loanRouter.post(
  '/guarantorsdetails',
  inputValidator({ body: guarantorsDetailsSchema }),
  isAuthenticated,
  new LoanController().guarantorsDetails,
);

/* @desc        Route to upload docs on taking loan
   @route       POST /api/v1/loans/uploaddocuments
   @access      Private
*/
loanRouter.post(
  '/uploaddocuments',
  inputValidator({ body: meansOfIdentificationSchema }),
  isAuthenticated,
  new LoanController().loanDocumentUpload,
);

/* @desc        Route to upload loan docs on taking loan
   @route       POST /api/v1/loans/uploadloandocuments
   @access      Private
*/
loanRouter.post(
  '/uploadloandocuments',
  inputValidator({ body: uploadDocumentSchema }),
  isAuthenticated,
  new LoanController().uploadDocuments,
);

/* @desc        Route to set loans interest rate template
   @route       POST /api/v1/loans/setInterestRate
   @access      Private
*/
loanRouter.post(
  '/setInterestRate',
  inputValidator({ body: setInterestRateSchema }),
  isAuthenticated,
  new LoanController().setInterestRateTemplate,
);

/* @desc        Route to get loans interest rate template
   @route       POST /api/v1/loans/setInterestRate
   @access      Private
*/
loanRouter.get(
  '/admin/getInterestRate',
  // isAuthenticated,
  // isPermitted(['user:read:own']),
  new LoanController().getInterestRateTemplate
);

/* @desc        Route to calulate loan principal and interest on taking loan
   @route       POST /api/v1/loans/calculateloan
   @access      Private
*/
loanRouter.post(
  '/calculateloan',
  inputValidator({ body: calculateLoanSchema }),
  isAuthenticated,
  new LoanController().CalculateAndApplyForLoan,
);

/* @desc        Route to calulate loan evaluation on taking loan
   @route       POST /api/v1/loans/loanevaluation
   @access      Private
*/
loanRouter.post(
  "/loanevaluation/:id",
  inputValidator({ params: loanEvaluationSchema }),
  new LoanController().loanEvaluation,
);


/* @desc        Route to get approved loan for a particular user on taking loan
   @route       POST /api/v1/loans/loanevaluation
   @access      Private
*/
loanRouter.get(
  "/approvedloan/",
  isAuthenticated,
  new LoanController().approvedLoan,
);

/* @desc        Route to get all pending loans for a particular user on taking loan
   @route       POST /api/v1/loans/loanevaluation
   @access      Private
*/
loanRouter.get(
  "/pendingloan/",

  new LoanController().pendingLoan,
);


// @desc        Route to CRC report
// @route       POST /api/v1/loans/crReport
// @access      Public
//loanRouter.post(
//  '/crReport',
// new LoanController().crcReport
//);

// @desc        Route to schedule
// @route       POST /api/v1/loans/schedule
// @access      Public
loanRouter.post(
  '/schedule',
  new LoanController().createSchedule
);

// @desc        Route to get loans
// @route       POST /api/v1/loans/fetch
// @access      Public
loanRouter.post(
  '/fetch',
  inputValidator({ body: getLoansSchema }),
  isAuthenticated,
  new LoanController().getLoan
);

loanRouter.post(
  '/admin/fetch',
  inputValidator({ body: fetchLoanAdminSchema }),
  //isAuthenticated,
  new LoanController().fetchAllLoans
);

// @desc        Route to get loans
// @route       POST /api/v1/loans/fetch
// @access      Public
loanRouter.get(
  '/settings',
  isAuthenticated,
  new LoanController().getLoanSettings
);

// @desc        Route to get loans settings
// @route       POST /api/v1/loans/admin/settings
// @access      Private
loanRouter.get(
  '/admin/settings',
  isAuthenticated,
  new LoanController().fetchLoanSettingsFee
);


loanRouter.post(
  '/admin/summary',
  isAuthenticated,
  new LoanController().getLoanSummary
);

// @desc        Route to get loans
// @route       POST /api/v1/loans/fetch
// @access      Public
loanRouter.post(
  '/admin/settings',
  inputValidator({ body: LoanSettingSchema }),
  isAuthenticated,
  new LoanController().updateLoanSettingsFee
);

// @desc        Route to get loans
// @route       POST /api/v1/loans/fetch
// @access      Public
loanRouter.put(
  '/edit',
  isAuthenticated,
  inputValidator({ body: editLoanSettingsSchema }),
  new LoanController().editLoanSettings
);


// @desc        Route to mock request for loan
// @route       POST /api/v1/loans/requestLoan
// @access      Public
//loanRouter.post(
  //'/requestLoan',
 // isAuthenticated,
 // inputValidator({ body: loanRequestSchema }),
 // new LoanController().requestLoan
//);

// @desc        Route to mock request for loan
// @route       POST /api/v1/loans/requestLoanV2
// @access      Public
//loanRouter.post(
//  '/requestLoanV2',
 // isAuthenticated,
//  inputValidator({ body: loanDropOffSchema }),
//  new LoanController().requestLoanV2
//);

// @desc        Route to stop loan request
// @route       POST /api/v1/loans/discontinue
// @access      Public
loanRouter.post(
  '/discontinue',
  isAuthenticated,
  inputValidator({ body: discontinueLoanSchema }),
  new LoanController().discontinueLoan
);

// @desc        Route to stop loan request
// @route       POST /api/v1/loans/discontinue
// @access      Public
loanRouter.post(
  '/admin/requestStatusUpdate',
  isAuthenticated,
  inputValidator({ body: loanStatusUpdateSchema }),
  new LoanController().processLoanStatusUpdateRequest
);
// @desc        Route to stop loan request
// @route       POST /api/v1/loans/discontinue
// @access      Public
loanRouter.post(
  '/admin/approveStatusUpdate',
  isAuthenticated,
  inputValidator({ body: loanStatusUpdateSchema }),
  new LoanController().processLoanStatusUpdateApproval
);





// @desc        Route to request for loan
// @route       POST /api/v1/loans/startLoanRequest
// @access      Public
loanRouter.post(
  '/updateLoanRequest',
  isAuthenticated,
  inputValidator({ body: loanDropOffSchema }),
  new LoanController().updateLoanRequest
);

// @desc        Route to mock request for loan
// @route       POST /api/v1/loans/requestLoan
// @access      Public
loanRouter.post(
  '/disburse',
  isAuthenticated,
  inputValidator({ body: disburseLoanSchema }),
  new LoanController().disburseLoan
);


// @desc        Route to check if a customer has an existing loan
// @route       POST /api/v1/loans/existingLoan
// @access      Public

loanRouter.post(
  '/existingLoan',
  isAuthenticated,
  inputValidator({ body: mobileNumberSchema }),
  new LoanController().checkExistingLoan
);



// @desc        Route to get a customers Loan Score details by BVN
// @route       GET /api/v1/customer/getLoanScore
// @access      Public
// loanRouter.get(
//   '/getLoanScore',
//   inputValidator({ query: BVNSchema }),
//   new LoanController().getLoanScore
// );

// @desc        Route to get a customers details by BVN
// @route       GET /api/v1/customer/FindByBVN
// @access      Public
loanRouter.post(
   '/findByBVN',
   inputValidator({ body: BVNSchema }),
   new LoanController().getCustomerCreditReport
 );

// @desc        Route to check if the customer's account is performing
// @route       POST /api/v1/customer/isPerforming
// @access      Public
// loanRouter.post(
//   '/checkPerformance',
//   inputValidator({ body: checkPerformanceSchema }),
//   new LoanController().checkAccountPerformance
// );

// loanRouter.get(
//   '/getSBC',
//   new LoanController().getSBC
// );

// @desc        Endpoint to Gets the number of accounts, in a specific account status,
//              for account owners with specified IDs.An empty list of AccountStatusSummaries
//              implies that the specified account owner has no accounts in CreditRegistry.
// @route       get /api/v1/customer/getAccountStatusSummary
// @access      Public
// loanRouter.get(
//   '/getAccountStatusSummary',
//   inputValidator({ body: checkPerformanceSchema }),
//   new LoanController().getAccountStatusSummary
// );

// @desc        Route to find customer summary
// @route       POST /api/v1/customer/findCustomerSummary
// @access      Public
// loanRouter.get(
//   '/findCustomerSummary',
//   inputValidator({ query: searchSchema }),
//   new LoanController().findCustomerSummary
// );

// @desc        Route to find customer
// @route       POST /api/v1/customer/findCustomer
// @access      Public
// loanRouter.get(
//   '/findCustomer',
//   inputValidator({ query: searchSchema }),
//   new LoanController().findCustomerSummary
// );

// loanRouter.get(
//   '/customerReport',
//   inputValidator({ query: BVNSchema }),
//   new LoanController().customerReport
// );
