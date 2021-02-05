// import Loan from './loan.model';
// import { config } from "secreta";
import { LoanService } from './newloan.service';
// const { ONEPIPE_API_SECRET, ONEPIPE_URL, ONEPIPE_AUTH } = config;
// import fetch from 'node-fetch';
import { Request, Response, NextFunction } from "express";
import { UniversalsController } from '../../@core/common/universals.controller';

// import { UniversalsService } from '../../@core/common/universals. service';


export class LoanController extends UniversalsController {

  public personalDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processLoanPersonalDetails(req)
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public uploadBusinessDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    try {
     
      const response = await new LoanService().processUploadBusinessDocumentFile(req,res)
      
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public uploadDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processUploadDocumentFile(req,res)
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public businessDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processLoanBusinessDetails(req,res)
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public employeeDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processLoanEmployeeDetails(req,res)
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public guarantorsDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processLoanGuarantorsDetails(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public loanDocumentUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processDocumentUpload(req,res);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getInterestRateTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processGetLoanInterestRateTemplate(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
  public setInterestRateTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processSetLoanInterestRateTemplate(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public CalculateAndApplyForLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processCalculateAndApplyForLoan(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public loanEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processLoanEvaluation(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public approvedLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processApprovedLoan(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public pendingLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processPendingLoan(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

 // public requestLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //  const { originalUrl, ip, method } = req;
   // try {
  //    const response = await new LoanService().processRequestLoan({ originalUrl, ip, method }, req.body);
   //   this.controllerResponseHandler(response, res);
  //  } catch (error) {
   //   this.controllerErrorHandler(req, res, error);
   // }
  //}

  public loanWebloan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { originalUrl, ip, method, body, headers } = req;
    try {
      const response = await new LoanService().processLoanWebhook({ originalUrl, ip, method, headers }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  // public generateHeader = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   const { originalUrl, ip, method, body, headers } = req;
  //   console.log(headers, "jjjjjjjjjjjj");

  //   try {
  //     const response = await new LoanService().processGenerateHeader({ originalUrl, ip, method }, body);
  //     this.controllerResponseHandler(response, res);
  //   } catch (error) {
  //     this.controllerErrorHandler(req, res, error);
  //   }
  // }

  //public requestLoanV2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //  const { originalUrl, ip, method, body, hostname } = req;
  //  try {
  //    const response = await new LoanService().processRequestLoanV2({ originalUrl, ip, method, hostname }, body);
    //  this.controllerResponseHandler(response, res);
   // } catch (error) {
     // this.controllerErrorHandler(req, res, error);
   // }
  //}

  public discontinueLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { originalUrl, ip, method, body } = req;
    try {
      const response = await new LoanService().processDiscontinueLoan({ originalUrl, ip, method }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public processLoanStatusUpdateRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { originalUrl, ip, method, body, headers, url } = req;
    try {
      const response = await new LoanService().requestLoanStatusUpdate({ originalUrl, ip, method, headers, url }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public processLoanStatusUpdateApproval = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { originalUrl, ip, method, body, headers, url } = req;
    try {
      const response = await new LoanService().approveLoanStatusUpdate({ originalUrl, ip, method, headers, url }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processGetLoans(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fetchAllLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processFetchAllLoans(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public disburseLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processDisburseLoan(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public checkExistingLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new LoanService().processCheckExistingLoan(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public createSchedule = async (req, res): Promise<void> => {
    try {
      const response = await new LoanService().createSchedule(200000, "12 months");
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public editLoanSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processEditLoanSettings(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getLoanSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processGetLoanSettings(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getLoanSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processGetLoanSummary(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  public updateLoanSettingsFee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processUpdateLoanSettingsFee(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public updateLoanRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, method, originalUrl, body } = req;
    try {
      const response = await new LoanService().processUpdateLoanRequest({ ip, method, originalUrl }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  //public crcReport = async (req: Request, res: Response): Promise<void> => {
 //   const { originalUrl, ip, method, body } = req;
  //  const { bvn, address } = body
  //  try {
    //  const response = await new LoanService().processCrcReport({ originalUrl, ip, method }, bvn, address);
    //  this.controllerResponseHandler(response, res);
  //  } catch (error) {
    //  this.controllerErrorHandler(req, res, error);
   // }
//  }
  public fetchLoanSettingsFee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().processFetchLoanSettingsFee(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getCustomerCreditReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new LoanService().getCustomerCreditReport(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  // public crcReport = async (req, res): Promise<void> => {
  //   try {
  //     const response = await new LoanService().processCrcReport(req);
  //     this.controllerResponseHandler(response, res);
  //   } catch (error) {
  //     this.controllerErrorHandler(req, res, error);
  //   }
  // }

  // public getLoanScore = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
  //     const response = await new LoanService().findCustomerByBvn(req.query.bvn);
  //     if (response && response.SearchResult[0] && response.StatusCode === 200) {
  //       const scoreResponse = await new LoanService().getLoanScore(response.SearchResult[0].RegistryID)
  //       res.status(scoreResponse.statusCode || scoreResponse.StatusCode).json({ status: scoreResponse.Success, message: "Query was successful", data: scoreResponse });
  //     } else {
  //       return res.status(response.statusCode).json({ status: false, message: "Could not get loan score", data: response })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // };

   //public customerReport = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
      // const response = await new LoanService().findCustomerByBvn(req.query.bvn);
      // if (response && response.SearchResult[0] && response.StatusCode === 200) {
      //   const scoreResponse = await new LoanService().customerReport(response.SearchResult[0].RegistryID);
       //  res.status(scoreResponse.statusCode || scoreResponse.StatusCode).json({ status: scoreResponse.Success, message: "Query was successful", data: scoreResponse });
    //   } else {
       //  return res.status(response.statusCode || response.StatusCode).json({ status: false, message: "Could not get customer report", data: response })
     //  }
   //  } catch (error) {
  //    res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
//   }

 // public findCustomerByBVN = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //try {
  // let response = await new LoanService().findCustomerByBvn(req.query.bvn);
  // res.status(response.statusCode || response.StatusCode).json({ status: response.Success, message: "Query was successful", data: response });
 //    } catch (error) {
//      res.status(500).json({ status: false, message: "Internal server error", data: null })
 //    }
  // };

  // public findCustomerSummary = async (req: Request, res: Response, next: NextFunction) => {
  //   // query should be  customer surname and phone number or DOB as string separated by comma e.g "udeogu,08182447114"
  //   try {
  //     let response = await new LoanService().findCustomerSummary(req.query.search);
  //     res.status(response.StatusCode || response.statusCode).json({ status: response.Success, message: "Query was successful", data: response });
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // };

  // public findCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
  //     let response = await new LoanService().findCustomer(req.query.search);
  //     res.status(response.StatusCode || response.statusCode).json({ status: response.Success, message: "Query was successful", data: response });
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // };

  // public checkAccountPerformance = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   const { bvn, loanAmount } = req.body;
  //   try {
  //     let response = await new LoanService().findCustomerByBvn(bvn);
  //     if (response && response.SearchResult[0] && response.StatusCode === 200) {
  //       const performanceResponse = await new LoanService().checkAccountPerformance(response.SearchResult[0].RegistryID, loanAmount);
  //       res.status(performanceResponse.StatusCode).json({ status: performanceResponse.Success, message: "Query was successful", data: performanceResponse });
  //     } else {
  //       return res.status(response.StatusCode).json({ status: false, message: "Could not check performance", data: response })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // };

  // public getAccountStatusSummary = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   const { bvn, loanAmount } = req.body;
  //   try {
  //     let response = await new LoanService().findCustomerByBvn(bvn);
  //     if (response && response.SearchResult[0] && response.StatusCode === 200) {
  //       const performanceResponse = await new LoanService().getAccountStatusSummary(response.SearchResult[0].RegistryID, loanAmount);
  //       console.log(performanceResponse, "performanceResponse")
  //       res.status(performanceResponse.StatusCode).json({ status: performanceResponse.Success, message: "Query was successful", data: performanceResponse });
  //     } else {
  //       return res.status(response.StatusCode).json({ status: false, message: "Could not check performance", data: response })
  //     }
  //   } catch (error) {
  //     res.status(error.response.data.StatusCode).json(error.response.data);
  //   }
  // };

  // public getSBC = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   const { sbc } = req.body;
  //   try {
  //     const response = await new LoanService().getSBCDefinition();
  //     console.log(response, 'getSBCDefinition');
  //     res.send(response)
  //     if (response && response.SBCDefinition.length > 0 && response.StatusCode === 200) {
  //       // res.send(response)
  //       const sbcResponse = await new LoanService().getSBC(response.SearchResult[0].RegistryID, sbc);
  //       res.status(sbcResponse.StatusCode).json({ status: sbcResponse.Success, message: "Query was successful", data: sbcResponse });
  //     } else {
  //       return res.status(response.StatusCode).json({ status: false, message: "Could not check performance", data: response })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // };

  //public getOnePipeLoanScore = async (req, res) => {
  //   const { amount, customerRef, firstName, lastName, email, mobile } = req.body
  //   const ref = await new UniversalsService().getBaseUserRandomNumber();
  //   console.log('Ref: ' + ref);
  //   if (ref) {
  //     const signature = new UniversalsService().onePipeSignature(ref, ONEPIPE_API_SECRET);
  //     console.log('signature: ' + signature);
  //     if (signature) {
  //       var obj = {
  //         request_ref: ref,
  //         transaction: {
  //           amount,
  //           transaction_desc: "Get customer's loan score",
  //           transaction_ref: ref,
  //           currency: "NGN",
  //           algo_code: "markovstats1.0",
  //           customer: {
  //             customer_ref: customerRef,
  //             firstname: firstName,
  //             surname: lastName,
  //             email,
  //             mobile_no: mobile
  //           }
  //         }
  //       };

  //       const response = await fetch(`${ONEPIPE_URL}/v1/loans/score`, {
  //         headers: {
  //           'Authorization': ONEPIPE_AUTH,
  //           "Content-Type": "application/json",
  //           "Signature": signature
  //         },
  //         method: 'POST',
  //         body: JSON.stringify(obj),
  //       });

  //       const responseData = await response.json();
  //       console.log(responseData, 'data')
  //       res.send(responseData)
  //       // request.post({
  //       //   url: `${ONEPIPE_URL}v1/loans/score`,
  //       //   headers: {
  //       //     'Authorization': authorization,
  //       //       "Content-Type": "application/json",
  //       //       "Signature": signature
  //       //   },
  //       //   json:obj
  //       //   }, function(error, response, body){
  //       //         console.log('==================================');
  //       //       console.log('Res: '+JSON.stringify(response.body));
  //       //       console.log('==================================');
  //       //       console.log(response.body, 'call res');

  //       // if(response.body){
  //       //   if(response.body.status){
  //       //     if(response.body.status!="Failed"){
  //       //       if(response.body.data){
  //       //         if(response.body.data.score.confidence<10){response.body.data.score.confidence=response.body.data.score.confidence*10;}
  //       //         res.send(response.body);
  //       //       }
  //       //       else{
  //       //         res.send({"status":"Failed"})
  //       //       }
  //       //     }
  //       //     else{
  //       //       res.send({"status":"Failed"})
  //       //     }
  //       //   }
  //       //   else{
  //       //     res.send({"status":"Failed"})
  //       //   }
  //       // }
  //       // else{
  //       //   res.send({"status":"Failed"})
  //       // }
  //       // });
  //     }
  //     else {
  //       //No signature
  //     }

  //   }
  //   else {
  //     //No ref number
  //   }
  //}

}

