import { config } from 'secreta';
import moment from 'moment';
//import { encode } from 'base-64';
//import EconomicActivity from '../Economic-Activity/economic-activitity.model';
import Loan from './loan.model';
import Contacts from './contacts.model';
import InterestRate from './interestRate.model';
import { IResponse } from '../account/account.interface';
import { BaseLoanService } from './baseloan.service';
import LoanSetting from './settingsloan.model';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import FeeSetting from '../audit/fee-settings.model';
import User from '../user/user.model';
import * as AWS from "aws-sdk";

// require('https').globalAgent.options.ca = require('ssl-root-cas').create();



const { BASE_URL, CRED_PASSWORD, SUB_ID, EmailAddress, ACCION_API_URL, ACCESSKEYID, SECRETACCESSKEY } = config;

export class LoanService extends BaseLoanService {
  // private headers: any = {
  //   Authorization: 'Basic ' + encode(ACCION_CRC_USERNAME + ':' + ACCION_CRC_PASSWORD),
  //   'Content-Type': 'application/json',
  // };

  public processLoanPersonalDetails = async (req: any): Promise<IResponse> => {
    try {
      const user = req.user;
      const { address, residentialStatus, maritalStatus } = req.body;
      // const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      //if(loanInProgress.length > 0){
      //return this.failureResponse('You have a loan in progress')
      // }
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }
      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { address },
        {
          new: true,
          upsert: true,
          projection: { password: 0, transactionPin: 0, securityAnswer: 0 },
        },
      );
      const loanAddress = await Loan.create({ address, residentialStatus, maritalStatus, userId: user._id, loanStatus: 'In-progress' });
      if (updateUser && loanAddress) {
        return this.successResponse('saved');
      };
      return this.failureResponse('User address not saved');
    } catch (error) {
      return this.failureResponse('Failed', error);
    }
  }

  public processUploadBusinessDocumentFile = async (req, res): Promise<any> => {

    try {
      const { key, imageData, folder, fileName } = req.body;
      const base64Data = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      const type = imageData.split(';')[0].split('/')[1];
      console.log(type);
      const spacesEndpoint = new AWS.Endpoint(`ams3.digitaloceanspaces.com/${folder}`);
      console.log(spacesEndpoint)
      const s3 = new AWS.S3({
        // @ts-ignore
        endpoint: spacesEndpoint,
        accessKeyId: ACCESSKEYID,
        secretAccessKey: SECRETACCESSKEY
      });

      console.log(s3);

      // const s3 = new AWS.S3({
      //   // @ts-ignore
      //   endpoint: spacesEndpoint,
      //   accessKeyId: "UZ7GMAUK5GPDYTMDM6CQ",
      //   secretAccessKey: "TDyykJZH386f1QLYqRVKn6gCQspY/aigCe2MGwRDZ80"
      // });
      const params = {
        Bucket: 'rubikpay',
        Key: `${key}/${fileName}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
      };

      if (params) {
        s3.upload(params, (err, data) => {
          console.log(params, "entered herhehrhehrh")


          if (err) return res.status(400).json({ status: false, message: "File upload failed", data: null })
          data.Location = data.Location.replace("ams3", "ams3.cdn");
          //requiredBody = data.location
          //  filePath = data.Location
          // window.filePath = filePath
          console.log(data.Location, "data.Location")
        });

        return this.successResponse(`https://rubikpay.ams3.cdn.digitaloceanspaces.com/${folder}/${key}/${fileName}`);

      }
      // res.setHeader('Content-Type', 'application/json');


    } catch (error) {
      //console.log(error, "error")
      return this.failureResponse('Failed', error);
    }
  }


  public processUploadDocumentFile = async (req, res): Promise<any> => {
    try {
      const { key, imageData, folder, fileName } = req.body;
      const base64Data = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      const type = imageData.split(';')[0].split('/')[1];
      console.log(type);
      const spacesEndpoint = new AWS.Endpoint(`ams3.digitaloceanspaces.com/${folder}`);
      console.log(spacesEndpoint)
      const s3 = new AWS.S3({
        // @ts-ignore
        endpoint: spacesEndpoint,
        accessKeyId: ACCESSKEYID,
        secretAccessKey: SECRETACCESSKEY
      });

      console.log(s3);

      // const s3 = new AWS.S3({
      //   // @ts-ignore
      //   endpoint: spacesEndpoint,
      //   accessKeyId: "UZ7GMAUK5GPDYTMDM6CQ",
      //   secretAccessKey: "TDyykJZH386f1QLYqRVKn6gCQspY/aigCe2MGwRDZ80"
      // });
      const params = {
        Bucket: 'rubikpay',
        Key: `${key}/${fileName}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
      };

      if (params) {
        s3.upload(params, (err, data) => {
          console.log(params, "entered herhehrhehrh")


          if (err) return res.status(400).json({ status: false, message: "File upload failed", data: null })
          data.Location = data.Location.replace("ams3", "ams3.cdn");
          //requiredBody = data.location
          //  filePath = data.Location
          // window.filePath = filePath
          console.log(data.Location, "data.Location")
        });

        return this.successResponse(`https://rubikpay.ams3.cdn.digitaloceanspaces.com/${folder}/${key}/${fileName}`);

      }
      // res.setHeader('Content-Type', 'application/json');


    } catch (error) {
      //console.log(error, "error")
      return this.failureResponse('Failed', error);
    }
  }





  public processLoanBusinessDetails = async (req: any, res: any): Promise<IResponse> => {
    const { companyName, companyState, companyCity, monthlyTurnOver, natureOfBusiness, referenceNumber, businessLocation, businessProof, accountStatement } = req.body;

    // const businessProof = req.file.location;
    //const accountStatement = req..location;
    const user = req.user;
    //const businessDocuments = req.files
    //editing the files path
    // for (let i of files) {
    // const slashCount = i.path.search(/\\/);
    // for (let j = 0; j < slashCount; j++) {
    //  i.path = i.path.replace('\\', '/');
    // }
    // } // The path to uploaded files are in the files var
    try {
      // const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      // if (loanInProgress.length > 0) {
      //  return this.failureResponse('You have a loan in progress');
      // }
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }


      const loan = await Loan.findOneAndUpdate(
        { userId: user._id, loanStatus: 'In-progress' },
        { businessDetails: { companyName, companyState, companyCity, monthlyTurnOver, natureOfBusiness, referenceNumber, businessLocation, businessProof, accountStatement } }, { new: true }
      );

      if (loan) {


        return this.successResponse('Business details saved');
      }

      return this.failureResponse('Error saving business details');
    } catch (error) {
      return this.failureResponse('Failed', error);
    }
  }

  public processLoanEmployeeDetails = async (req: any, res: any): Promise<IResponse> => {
    const { companyName, companyState, companyCity, salaryRange, salaryPayDay, offerLetter, accountStatement } = req.body;

    // const businessProof = req.file.location;
    //const accountStatement = req..location;
    const user = req.user;
    //const businessDocuments = req.files
    //editing the files path
    // for (let i of files) {
    // const slashCount = i.path.search(/\\/);
    // for (let j = 0; j < slashCount; j++) {
    //  i.path = i.path.replace('\\', '/');
    // }
    // } // The path to uploaded files are in the files var
    try {
      // const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      // if (loanInProgress.length > 0) {
      //  return this.failureResponse('You have a loan in progress');
      // }
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }


      const loan = await Loan.findOneAndUpdate(
        { userId: user._id, loanStatus: 'In-progress' },
        { employeeLoanDetails: { companyName, companyState, companyCity, salaryRange, salaryPayDay, offerLetter, accountStatement } }, { new: true }
      );

      if (loan) {


        return this.successResponse('Employee details saved');
      }

      return this.failureResponse('Error saving employee details');
    } catch (error) {
      return this.failureResponse('Failed', error);
    }
  }



  public processLoanGuarantorsDetails = async (req) => {
    try {
      const user = req.user;
      const { guarantorOne, guarantorTwo, contacts } = req.body;
      const bodyArray: any[] = [guarantorOne, guarantorTwo];
      for (const obj of bodyArray) {
        for (const key in obj) {
          if (!obj[key]) {
            return this.failureResponse("One or more guarantors' field is not provided");
          }
        }
      }
      // const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      // if (loanInProgress.length > 0) {
      // return this.failureResponse('You have a loan in progress');
      //}
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }
      const loan = await Loan.findOneAndUpdate(
        { userId: user._id, loanStatus: 'In-progress' },
        {
          guarantorsDetails: {
            guarantorOne,
            guarantorTwo,
          },
        },
        { new: true },
      );
      const userContacts = await Contacts.create({ userId: user._id, contacts });
      if (loan && userContacts) {
        return this.successResponse('Guarantors details saved');
      }
      return this.failureResponse('Error saving guarantors details');
    } catch (error) {
      console.log(error);
      return this.failureResponse(error);
    }
  }

  public processApprovedLoan = async (req) => {
    try {
      const user = req.user;
      const approvedLoan = await Loan.find({ userId: user._id, loanStatus: 'Approved' });


      if (approvedLoan.length > 0) {
        return this.successResponse('Approved', approvedLoan);
      }
      return this.failureResponse('No loan yet');
    } catch (error) {
      console.log(error);
      return this.failureResponse(error);
    }
  }

  public processPendingLoan = async (req) => {
    try {

      const pendingLoan = await Loan.find({ loanStatus: 'Pending' });


      if (pendingLoan.length > 0) {
        return this.successResponse('Pending', pendingLoan);
      }
      return this.failureResponse('No Pending loan yet');
    } catch (error) {
      console.log(error);
      return this.failureResponse(error);
    }
  }

 

  public processLoanEvaluation = async (id: any) => {
    try {
    let businessScore:any
    let employeeScore:any
    let loanEvaluation:any 
    const checkUser =  await User.findOne({ _id: id });
    let result = await this.getBusinessLoanScore(id)
    //console.log(result)
    let resultTwo = await this.getCustomerScore(id)
    let resultThree = await this.getEmployeeLoanScore(id)
    //console.log(resultTwo)
    if(checkUser){
      
      if(checkUser.role === "Business Owner"){
      // console.log(checkUser.role)
     businessScore = result + resultTwo
     loanEvaluation = await this.scoreSelfEmployedGrading(businessScore)
       
      }

      if(checkUser.role === "Employee"){
        // console.log(checkUser.role)
       employeeScore = resultThree + resultTwo
       loanEvaluation = await this.scoreEmployedGrading(employeeScore)
         
        }
        console.log(employeeScore)
      console.log(loanEvaluation)
    }
  
     
    


      return this.successResponse("Documents uploaded successfully")

    } catch (error) {
      return this.failureResponse(error);
    }

  }

  public getBusinessLoanScore = async (id:any) => {
    try{
     // console.log(id)
    let loanDetailsScore: any
      await Loan.find({ userId: id, loanStatus: 'Pending' }).cursor().eachAsync(async (model) => {
      const result = model.toJSON()
      let businessLocationScore = await this.businessLocationScore(result.businessDetails.businessLocation);
      let residentialStatusScore = await this.BusinessResidentialStatus(result.residentialStatus);
      let businessLicScore = await this.licenseScore(result.businessDetails.referenceNumber);
      
      let natureOfBusinessScore = await this.natureOfBusiness(result.businessDetails.natureOfBusiness);
     // let x = result.businessDetails.monthlyTurnOver;
     let crcStatusScore = await this.crcStatus("Bad");
     let refferralScore = await this.businessReferral("Yes");
     
     const loanScore = await Loan.findOneAndUpdate(
      { userId: id, loanStatus: 'In-progress' },
      {
        loanCompute: {
          businessLocationScore,
          residentialStatusScore,
          businessLicScore, 
          natureOfBusinessScore,
          crcStatusScore,
          refferralScore
        },
      },
      { new: true },
    );
      
      
     // let getMonthlyTurnOver = await this.monthlyTurnOver(x)
     console.log(natureOfBusinessScore)
     if(loanScore)
     loanDetailsScore = businessLocationScore + residentialStatusScore + businessLicScore + natureOfBusinessScore + crcStatusScore + refferralScore
    });

    return loanDetailsScore
    } catch (error) {
      return "An error occurred"
    }
 


  }

  public getEmployeeLoanScore = async (id:any) => {
    try{
     // console.log(id)
    let loanDetailsScore: any
      await Loan.find({ userId: id, loanStatus: 'Pending' }).cursor().eachAsync(async (model) => {
      const result = model.toJSON()
     
      let employeeResidentialStatusScore = await this.residentialStatus(result.residentialStatus);
      let crcStatusScore = await this.crcStatus("Good");
      let employementTypeScore = await this.employementType("Government");
      let refferralScore = await this.employeeReferer("No");

      const loanScore = await Loan.findOneAndUpdate(
        { userId: id, loanStatus: 'In-progress' },
        {
          loanCompute: {
            employeeResidentialStatusScore,
            employementTypeScore, 
            crcStatusScore,
            refferralScore
          },
        },
        { new: true },
      );
    
     // let x = result.businessDetails.monthlyTurnOver;
      
      
     // let getMonthlyTurnOver = await this.monthlyTurnOver(x)
     if(loanScore){
     loanDetailsScore =  employeeResidentialStatusScore + crcStatusScore + employementTypeScore + refferralScore
     }
    });

    return loanDetailsScore
    } catch (error) {
      return "An error occurred"
    }
 


  }

  public getCustomerScore = async (id:any) => {
    try{
      let customerDetailsScore:any
     // console.log(id)
  
       await User.findOne({ _id: id }).cursor().eachAsync(async (model) => {
        const result = model
       // console.log(result.gender)
       // console.log(result.dateOfBirth)
        let genderScore = await this.genderScore(result.gender)
     //   console.log(getGender)
        let maritalStatusScore =await this.maritialScore(result.maritalStatus)
       // console.log(getMaritalStatusScore)
        let getAgeScore = await this.ageScore(this._calculateAge(result.dateOfBirth))
       // console.log(getAgeScore)
       const loanScore = await Loan.findOneAndUpdate(
        { userId: id, loanStatus: 'In-progress' },
        {
          loanCompute: {
            genderScore,
            maritalStatusScore, 
            getAgeScore
          },
        },
        { new: true },
      );
        
        if(loanScore)
        {
       customerDetailsScore = genderScore + getAgeScore + maritalStatusScore
        }
      });
      return customerDetailsScore
    } catch (error) {
      return "An error occurred"
    }
 


  }
  public processDocumentUpload = async (req: any, res: any) => {
    try {
      const user = req.user;
      // const {utility,identification} = req.file.location
      const { identificationName, cardNumber, utility, identification } = req.body;

      //const uploadedDocument = req.files

      // const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      //if (loanInProgress.length > 0) {
      // return this.failureResponse('You have a loan in progress');
      // }
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }

      const loan = await Loan.findOneAndUpdate(
        { userId: user._id, loanStatus: 'In-progress' },
        {
          meansOfIdentification: {
            identificationName,
            cardNumber,
            utility,
            identification
          },
        },
        { new: true },
      );
      if (loan) {

        return this.successResponse("Documents uploaded successfully")

      }

      return this.failureResponse('Failed to upload', 'Internal server error');
    } catch (error) {

      return this.failureResponse('Failed to upload', error);
    }
  }

  public processGetLoanInterestRateTemplate = async (req: any) => {


    try {
      const template: any = await InterestRate.find();
      if (!template) return this.failureResponse("Loan interest Rate Template was not found");
      return this.successResponse("Loan interest Rate Template found", template);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };


  public processSetLoanInterestRateTemplate = async (req) => {
    const user = req.user;
    const { tenor, interestRate, processingFee, forWhom } = req.body;
    console.log(user.role);

    try {
      if (forWhom === user.role) {
        if (tenor === 30) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('30 Days business owner user interest rate updated succesfully');
          }
          return this.failureResponse('Failed to update interest rate at business owner 30 Days');
        } else if (tenor === 60) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('60 Days business owner  user interest rate updated succesfully');
          }
          this.failureResponse('Failed to update interest rate at business owner 60 Days');
        } else if (tenor === 90) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('90 Days business owner user interest rate updated succesfully');
          }
          return this.failureResponse('Failed to update interest rate at business 90 Days');
        }
      } if (forWhom === user.role) {
        if (tenor === 14) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('14 Days employee user interest rate updated succesfully');
          }
          return this.failureResponse('Failed to update interest rate at employee type for 14 Days');
        } else if (tenor === 21) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('21 Days employee user interest rate updated succesfully');
          }
          return this.failureResponse('Failed to update interest rate at individual type for 21 Days');
        } else if (tenor === 30) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('30 Days employee user interest rate updated succesfully');
          }
          this.failureResponse('Failed to update interest rate at employee type for 30 Days');
        }

        else if (tenor === 60) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('60 Days employee user interest rate updated succesfully');
          }
          this.failureResponse('Failed to update interest rate at employee type for 60 Days');
        }
        else if (tenor === 90) {
          const template = await InterestRate.findOneAndUpdate(
            { tenor, type: user.role },
            {
              tenor,
              interestRate,
              processingFee,
            },
            { new: true, upsert: true },
          );
          if (template) {
            return this.successResponse('90 Days employee user interest rate updated succesfully');
          }
          this.failureResponse('Failed to update interest rate at employee type for 90 Days');
        }
      }

      console.log(processingFee)
      return this.failureResponse("Failed to save!!");
    } catch (error) {
      return this.failureResponse(error);
    }
  }

  public processCalculateAndApplyForLoan = async (req) => {
    const user = req.user;
    const { principal, tenor, forWhom } = req.body;
    try {
      //const loanInProgress = await Loan.find({ userId: user._id, loanStatus: 'In-progress' });
      //if (loanInProgress.length > 0) {
      // return this.failureResponse('You have a loan in progress');
      // }
      const pendingLoan = await Loan.find({ userId: user._id, loanStatus: 'Pending' });
      if (pendingLoan.length > 0) {
        return this.failureResponse('You have a loan currently pending.');
      }
      if (forWhom === user.role) {
        const [interestTemplate]: any = await InterestRate.find({ tenor, type: user.role });

        const { processingFee, interestRate, tenor: LoanTenure } = interestTemplate;
        const loan: any = await Loan.findOneAndUpdate(
          { userId: user._id, loanStatus: 'In-progress' },
          {
            loanStatus: 'Pending',
            loanDetails: {
              principal,
              processingFee,
              interestRate,
              LoanTenure,
              totalInterestRate: tenor * interestRate,
              totalInterestAmount: (principal / 100) * (tenor * interestRate),
              totalRepayment:
                principal + (principal / 100) * (tenor * interestRate) + processingFee,
            },
          },
          { new: true },
        );
        if (loan) {
         await this.processLoanEvaluation(user._id)
          return this.successResponse("You have successfully placed your loan and it's in progress for approval", loan)
        }
      } else if (forWhom === user.role) {
        const [interestTemplate]: any = await InterestRate.find({ tenor, type: user.role });
        const { processingFee, interestRate, tenor: LoanTenure } = interestTemplate;
        const loan: any = await Loan.findOneAndUpdate(
          { userId: user._id, loanStatus: 'In-progress' },
          {
            loanStatus: 'Pending',
            loanDetails: {
              principal,
              processingFee,
              interestRate,
              LoanTenure,
              totalInterestRate: tenor * interestRate,
              totalInterestAmount: (principal / 100) * (tenor * interestRate),
              totalRepayment:
                principal + (principal / 100) * (tenor * interestRate) + processingFee,
            },
          },
          { new: true },
        );
        if (loan) {
          return this.successResponse(
            'You have successfully placed your loan, and is in progress for approval',
            loan,
          );
        }
      }
      return this.failureResponse("Failed to place a loan");
    } catch (error) {
      return this.failureResponse(error);
    }
  }


  public processLoanWebhook = async (metaData, body) => {
    // const { signature, timestamp, ref } = metaData.headers;
    // const {disburseId, } = body;
    // console.log(signature, timestamp, ref, "Signature, Timestamp, RefSignature, Timestamp, Ref");
    // try {
    //   const hash = await crypto.createHmac("sha512", LWH_KEY).update(`${LWH_PASSWORD}:${timestamp}:${ref}:${LWH_USERNAME}`).digest("hex");
    //   if (hash !== signature) return this.failureResponse();
    //   const loan = Loan.fin

    //   return this.successResponse()
    // } catch (error) {
    //   return this.serviceErrorHandler(metaData, error)
    // }
  }

  // public processGenerateHeader = async (metaData, body) => {
  //   try {
  //     const header = await this.myHeaders();
  //     console.log(await this.myHeaders(), "******************************")
  //     return this.successResponse(null, header);
  //   } catch (error) {
  //     return this.serviceErrorHandler(metaData, error)
  //   }
  // }


  public processGetLoans = async (req): Promise<IResponse> => {
    const obj = req.body;
    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' } };

    try {
      let query = {};
      for (const [key, value] of Object.entries(obj)) {
        query = { ...query, [key]: value };
      }
      // @ts-ignore
      const loans: any = await Loan.paginate(query, options);
      const data = {
        docs: loans.docs,
        meta: {
          total: loans.totalDocs,
          skipped: loans.page * loans.limit,
          perPage: loans.limit,
          page: loans.page,
          pageCount: loans.totalPages,
          hasNextPage: loans.hasNextPage,
          hasPrevPage: loans.hasPrevPage,
        }
      }
      return this.successResponse("Loans fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processUpdateLoanSettingsFee = async (req): Promise<IResponse> => {
    const { interestRate, insuranceFee, adminFee } = req.body;

    try {
      await FeeSetting.updateOne({}, {
        $set: {
          loan: {
            interestRate,
            insuranceFee,
            adminFee,
          }
        }
      });
      return this.successResponse("Loan Fees updated", null)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processFetchLoanSettingsFee = async (req): Promise<IResponse> => {
    try {
      const loanFees = await FeeSetting.findOne({}, { loan: 1 });
      return this.successResponse("Loan Fees fetched", loanFees)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processFetchAllLoans = async (req): Promise<IResponse> => {

    let { startDate, endDate, mobileNumber, channel, actionBy, applicationStatus, process, minAmount, maxAmount, customerName, loanID } = req.body;

    const query = {};

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (mobileNumber) query["mobileNumber"] = { "$regex": mobileNumber, $options: "i" };
    if (channel) query["channel"] = channel
    if (actionBy) query["actionBy"] = actionBy
    if (applicationStatus) query["applicationStatus"] = applicationStatus
    if (applicationStatus === "inProgress") {
      query["applicationStatus"] = { $in: ['inProgress', 'discontinued'] }
    }
    if (process) query["recommended.process"] = process
    if (minAmount && maxAmount) {
      query["recommended.recommendedAmount"] = { $gte: minAmount, $lt: maxAmount }
    } else if (minAmount) {
      query["recommended.recommendedAmount"] = { $gte: minAmount }
    } else if (maxAmount) {
      query["recommended.recommendedAmount"] = { $lte: maxAmount }
    }
    if (customerName) query["userRequest.name"] = { "$regex": customerName, $options: "i" };
    if (loanID) query["_id"] = Types.ObjectId(loanID);

    const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' } };

    try {
      // @ts-ignore
      const loans: any = await Loan.paginate(query, options);
      const data = {
        docs: loans.docs,
        meta: {
          total: loans.totalDocs,
          skipped: loans.page * loans.limit,
          perPage: loans.limit,
          page: loans.page,
          pageCount: loans.totalPages,
          hasNextPage: loans.hasNextPage,
          hasPrevPage: loans.hasPrevPage,
        }
      }
      return this.successResponse("Loans fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };


  public processGetLoanSettings = async (req) => {
    try {
      const loanSetting: any = await LoanSetting.findOne();
      if (!loanSetting) return this.failureResponse("Loan settings was not found");
      return this.successResponse("Loan settings found", loanSetting);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetLoanSummary = async (req) => {
    try {

      const { startDate, endDate } = req.body;
      const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };

      const loanReport = await Loan.aggregate([
        { $match: query },
        {
          $facet: {
            totalLoan: [
              {
                $group: {
                  _id: "",
                  volume: {
                    $sum: 1
                  },
                  requestedValue: {
                    $sum: "$userRequest.amount"
                  },
                  recommendedValue: {
                    $sum: "$recommended.recommendedAmount"
                  },
                }
              },
            ],
            pending: [
              { $match: { "applicationStatus": "pending" } },
              {
                $group: {
                  _id: "",
                  volume: {
                    $sum: 1
                  },
                  requestedValue: {
                    $sum: "$userRequest.amount"
                  },
                  recommendedValue: {
                    $sum: "$recommended.recommendedAmount"
                  },
                }
              }
            ],
            disbursed: [
              { $match: { "applicationStatus": "disbursed" } },
              {
                $group: {
                  _id: "",
                  volume: {
                    $sum: 1
                  },
                  requestedValue: {
                    $sum: "$userRequest.amount"
                  },
                  recommendedValue: {
                    $sum: "$recommended.recommendedAmount"
                  },
                }
              }
            ],
            unapproved: [
              { $match: { "applicationStatus": "rejected", "actionBy": "system" } },
              {
                $group: {
                  _id: "",
                  volume: {
                    $sum: 1
                  },
                  requestedValue: {
                    $sum: "$userRequest.amount"
                  },
                  recommendedValue: {
                    $sum: "$recommended.recommendedAmount"
                  },
                }
              }
            ],
            declined: [
              { $match: { "applicationStatus": "rejected", "actionBy": "user" } },
              {
                $group: {
                  _id: "",
                  volume: {
                    $sum: 1
                  },
                  requestedValue: {
                    $sum: "$userRequest.amount"
                  },
                  recommendedValue: {
                    $sum: "$recommended.recommendedAmount"
                  },
                }
              }
            ],
          }
        }
      ])
      return this.successResponse("Loan Summary fetched", loanReport);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processEditLoanSettings = async (req) => {
    const { settingsId } = req.body;
    const { adminFee, interestRate, insuranceFee } = req.body;
    const _id = Types.ObjectId(settingsId);
    try {
      // let query = {};
      // for (const [key, value] of Object.entries(obj)) {
      //   query = { ...query, [key]: value };
      // }
      const loanSetting: any = await LoanSetting.findOneAndUpdate({ _id }, { adminFee, interestRate, insuranceFee }, { new: true });
      if (!loanSetting) return this.failureResponse("Loan settings was not found");
      return this.successResponse("Loan settings found", loanSetting);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processCheckExistingLoan = async (req) => {
    const { mobileNumber, channel } = req.body;
    // const _id = Types.ObjectId(userId);
    try {
      const accionLoanCheckUrl = `${ACCION_API_URL}/loan/checkExistingLoan`;
      const response = await this.apiCall(accionLoanCheckUrl, { mobileNumber }, await this.setHeader(channel), "POST", req.hostname);
      let responseData = await response.json();
      // const user = User.updateOne({_id}, {existingLoan:responseData.existingLoan});
      // if(!user) return this.failureResponse("User was not found");
      if (!responseData || !responseData?.existingLoan) return this.failureResponse("Check failed");
      return this.successResponse("User checked", responseData);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  // public processRequestLoan = async (clientId, body): Promise<IResponse> => {
  // const { monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses, otherIncome,
  //  address, houseHoldExpenses, economicActivity, rankOfSales, gender, economicActivityOther, maritalStatus,
  //  educationLevel, businessLocation, amount, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  //businessActivity, userId, bvn, name, dateOfBirth, tenure, mobileNumber, email, area, postalCode,
  // businessActivityOther, economicSector, channel, grossMargin, noOfDependent, houseOwnership } = body;
  // try {
  //if (amount > 150000) {
  //new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
  //  await Loan.create({
  //  userId, mobileNumber, channel, applicationStatus: "pending",
  // userRequest: {
  //  economicActivityOther, name, dateOfBirth, mobileNumber, address, email, area, postalCode, economicActivity,
  // rankOfSales, monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  //houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  // educationLevel, businessLocation, amount, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  // bvn, userId, economicSector, grossMargin, noOfDependent, houseOwnership
  // }, reason: "Loan request above 150,000 naira", actionBy: "system"
  //});
  // return this.successResponse("Your loan request has been registered, you will receive a call from us soon");
  // }
  // const crcReport = await this.processCrcReport(clientId, bvn, address);
  // const genderScore = await this.genderScore(gender);
  // const maritalScore = await this.maritialScore(maritalStatus);
  // const educationScore = await this.educationScore(educationLevel);
  //const establishmentScore = await this.establishmentScore(businessLocation);
  // const licenseScore = await this.licenseScore(validBusinessLicense);
  // const knowAMFBScore = await this.knowAMFBScore(knowAMFB);
  // const ageScore = await this.ageScore(age);
  // const timeAtLocationScore = await this.timeAtLocationScore(timeAtLocationinMnth);
  // const businessActivityScore = await this.businessLocationScore(businessLocation);
  //  const model = 3.3756 + genderScore + maritalScore + educationScore + establishmentScore +
  // licenseScore + knowAMFBScore + ageScore + timeAtLocationScore + businessActivityScore;
  // const probability = (1 / (1 + Math.exp(-model)));
  // const score = probability * 1000;
  // const scoreGrade = await this.scoreEmployedGrading(score);
  // const strategy = await this.getStrategy(scoreGrade);
  // const grossProfit = monthlySales - costOfGoods;
  // const totalOpsExpenses = monthlyFixedExpenses + monthlyVarExpenses + otherFinancialExpenses;
  //  const netProfit = grossProfit - totalOpsExpenses;
  //const monthlyHouseholdSurplus = netProfit + otherIncome - houseHoldExpenses;
  // const adjmonthlyHouseholdSurplus = 0.65 * monthlyHouseholdSurplus;
  //  const grossProfitMargin = grossProfit / monthlySales;
  // const grossMarginRange = await this.grossMarginRange(grossProfitMargin);
  //const netMargin = netProfit / monthlySales;
  // const householdExpenseRatio = houseHoldExpenses / monthlySales;
  //const operationExpenseRatio = totalOpsExpenses / monthlySales;
  //const ecoActivityLimits: any = await EconomicActivity.findOne({ economicActivity, rankOfSales });
  // const { grossMarginLimits, netMarginLimits, householdExpenseRatioLimits } = ecoActivityLimits;
  // const { limit1: grossLm1, limit2: grossLm2, limit3: grossLm3, limit4: grossLm4 } = grossMarginLimits;
  // const { limit1: netLm1, limit2: netLm2, limit3: netLm3, limit4: netLm4 } = netMarginLimits;
  // const { limit1: householdLm1, limit2: householdLm2, limit3: householdLm3, limit4: householdLm4 } = householdExpenseRatioLimits;
  // const grossProfitEamClass = await this.eamClassification(grossLm1, grossLm2, grossLm3, grossLm4, grossProfitMargin);
  // const netMarginEamClass = await this.eamClassification(netLm1, netLm2, netLm3, netLm4, netMargin)
  // const householdEamClass = await this.eamClassification(householdLm1, householdLm2, householdLm3, householdLm4, householdExpenseRatio);
  // const msmeScore = ((grossProfitEamClass.score * 0.35) + (netMarginEamClass.score * 0.35) + (householdEamClass.score * 0.3)) * 100;
  // let recommended = await this.recommendationV2(msmeScore, strategy, amount, tenure);
  //  const { reason, message, recommendation, schedule } = await this.finalDecision(clientId, email, crcReport,
  //  recommended, msmeScore, score, monthlyHouseholdSurplus, amount, name);
  //  recommended = recommendation;
  // const registerLoan = await Loan.create({
  // userId, mobileNumber, channel, applicationStatus: "pending", offerAccepted: false, reason,
  // actionBy: "system", userRequest: {
  // economicActivityOther, name, dateOfBirth, address, email, area, postalCode, economicActivity, rankOfSales,
  // monthlySales, amount, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  // houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  // educationLevel, businessLocation, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth, bvn,
  // economicSector, grossMargin, noOfDependent, houseOwnership
  //      }, loanCompute: {
  //crcReport: crcReport.data, genderScore, maritalScore, educationScore, establishmentScore, licenseScore,
  // knowAMFBScore, ageScore, timeAtLocationScore, businessActivityScore, model, probability, score, scoreGrade,
  // strategy, grossProfit, totalOpsExpenses, netProfit, monthlyHouseholdSurplus, adjmonthlyHouseholdSurplus,
  // grossProfitMargin, netMargin, householdExpenseRatio, operationExpenseRatio, ecoActivityLimits,
  //grossProfitEamClass, netMarginEamClass, householdEamClass, msmeScore, grossMarginRange
  // }, schedule, recommended
  //    });
  //    if (!registerLoan) return this.failureResponse("Application was not recorded, please try again shortly");
  // return this.successResponse(message, { recommended, schedule, loanId: registerLoan._id });
  // } catch (error) {
  //   return this.serviceErrorHandler(clientId, error);
  //    }
  //   }

  public processUpdateLoanRequest = async (metaData, body) => {
    const { channel, loanId, ...rest } = body;
    const _id = Types.ObjectId(loanId);
    try {
      const loan = await Loan.updateOne({ _id }, { channel, userRequest: rest });
      if (!loan) return this.preconditionFailed("Autosave failed/Loan was not found");
      return this.successResponse("Autosaved");
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public requestLoanStatusUpdate = async (metaData, body) => {

    const { existingAdminMobileNumber, loanId, status, pin } = body;
    const { headers, originalUrl, method, ip } = metaData;
    const logAudit = await this.logAuditActivity(headers, originalUrl, method, ip, existingAdminMobileNumber, `Request Loan Status Update to ${status}`, pin);
    if (logAudit.status !== true) return this.failureResponse(logAudit.message)

    const _id = Types.ObjectId(loanId);
    try {
      const loan = await Loan.updateOne({ _id }, {
        $set: {
          manualLoanUpdate: {
            maker: logAudit.data.fullName,
            status: status,
          }
        }
      });
      if (!loan) return this.failureResponse("Loan update failed")
      return this.successResponse("Loan status request sent");
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public approveLoanStatusUpdate = async (metaData, body) => {

    const { existingAdminMobileNumber, loanId, status, pin } = body;
    const { headers, originalUrl, method, ip } = metaData;

    const logAudit = await this.logAuditActivity(headers, originalUrl, method, ip, existingAdminMobileNumber, `Approve Loan Status Update to ${status}`, pin);
    if (logAudit.status !== true) return this.failureResponse(logAudit.message)
    const _id = Types.ObjectId(loanId);
    try {
      const loan = await Loan.updateOne({ _id }, {
        $set: {
          "manualLoanUpdate.authorizer": logAudit.data.fullName,
          applicationStatus: status,
        }
      });
      if (!loan) return this.failureResponse("Loan update failed")
      return this.successResponse("Loan status updated");
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public processDiscontinueLoan = async (metaData, body) => {
    const { loanId, channel } = body;
    const _id = Types.ObjectId(loanId);
    try {
      const loan = await Loan.updateOne({ _id }, { channel, applicationStatus: "discontinued" });
      if (!loan) return this.preconditionFailed("Action failed/Loan was not found");
      const user = await User.updateOne({ "loanDropOff.loanId": _id }, { $unset: { loanDropOff: 1 } });
      if (!user) return this.preconditionFailed("Action failed/User was not found");
      return this.successResponse("Success");
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  //public processRequestLoanV2 = async (clientId, body): Promise<IResponse> => {
  //  const { monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses, otherIncome,
  //    address, houseHoldExpenses, economicActivity, rankOfSales, gender, economicActivityOther, maritalStatus,
  //   educationLevel, businessLocation, amount, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  //  businessActivity, userId, bvn, name, dateOfBirth, tenure, mobileNumber, email, area, postalCode,
  //  businessActivityOther, economicSector, channel, grossMargin, noOfDependent, houseOwnership, loanId } = body;
  //  const _id = Types.ObjectId(loanId);
  //   try {
  //    if (amount > 150000) {
  //      clientId.hostname == "api.accionmfb.com" && await new EmailService().zohoMail(clientId, "digitalloanalerts@accionmfb.com", "loan-notification", { name, mobileNumber, process: "Manual", amount }, "New Loan Request Alert");

  //     await new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
  //     const loan = await Loan.updateOne({ _id }, {
  //      userId, mobileNumber, channel, applicationStatus: "pending",
  //       userRequest: {
  //       economicActivityOther, name, dateOfBirth, mobileNumber, address, email, area, postalCode, economicActivity,
  //         rankOfSales, monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  //         houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  //         educationLevel, businessLocation, amount, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  //        bvn, userId, economicSector, grossMargin, noOfDependent, houseOwnership
  //     }, reason: "Loan request above 150,000 naira", actionBy: "system"
  //    });

  // if (!loan) return this.preconditionFailed("Loan failed");
  //   await User.updateOne({ "loanDropOff.loanId": _id }, { $unset: { loanDropOff: 1 } })
  //   return this.successResponse("Your loan request has been registered, you will receive a call from us soon");
  //  }
  //  const crcReport = await this.processCrcReport(clientId, bvn, address);
  // const genderScore = await this.genderScore(gender);
  // const maritalScore = await this.maritialScore(maritalStatus);
  //  const educationScore = await this.educationScore(educationLevel);
  //   const establishmentScore = await this.establishmentScore(businessLocation);
  //   const licenseScore = await this.licenseScore(validBusinessLicense);
  //   const knowAMFBScore = await this.knowAMFBScore(knowAMFB);
  //    const ageScore = await this.ageScore(age);
  //   const timeAtLocationScore = await this.timeAtLocationScore(timeAtLocationinMnth);
  //     const businessActivityScore = await this.businessLocationScore(businessLocation);
  //   const model = 3.3756 + genderScore + maritalScore + educationScore + establishmentScore +
  //     licenseScore + knowAMFBScore + ageScore + timeAtLocationScore + businessActivityScore;
  //   const probability = (1 / (1 + Math.exp(-model)));
  //     const score = probability * 1000;
  // const scoreSelfGrade = await this.scoreSelfEmployedGrading (score);
  //    const scoreEmployedGrade = await this.scoreEmployedGrading (score);
  //const strategySelf = await this.getStrategy(scoreSelfGrade);
  //   const strategy = await this.getStrategy(scoreEmployedGrade)
  //   const grossProfit = monthlySales - costOfGoods;
  //   const totalOpsExpenses = monthlyFixedExpenses + monthlyVarExpenses + otherFinancialExpenses;
  //    const netProfit = grossProfit - totalOpsExpenses;
  //    const monthlyHouseholdSurplus = netProfit + otherIncome - houseHoldExpenses;
  //  const adjmonthlyHouseholdSurplus = 0.65 * monthlyHouseholdSurplus;
  //    const grossProfitMargin = grossProfit / monthlySales;
  //    const grossMarginRange = await this.grossMarginRange(grossProfitMargin);
  //    const netMargin = netProfit / monthlySales;
  //    const householdExpenseRatio = houseHoldExpenses / monthlySales;
  //    const operationExpenseRatio = totalOpsExpenses / monthlySales;
  //     const ecoActivityLimits: any = await EconomicActivity.findOne({ economicActivity, rankOfSales });
  //    const { grossMarginLimits, netMarginLimits, householdExpenseRatioLimits } = ecoActivityLimits;
  //     const { limit1: grossLm1, limit2: grossLm2, limit3: grossLm3, limit4: grossLm4 } = grossMarginLimits;
  //    const { limit1: netLm1, limit2: netLm2, limit3: netLm3, limit4: netLm4 } = netMarginLimits;
  //    const { limit1: householdLm1, limit2: householdLm2, limit3: householdLm3, limit4: householdLm4 } = householdExpenseRatioLimits;
  //      const grossProfitEamClass = await this.eamClassification(grossLm1, grossLm2, grossLm3, grossLm4, grossProfitMargin);
  //     const netMarginEamClass = await this.eamClassification(netLm1, netLm2, netLm3, netLm4, netMargin)
  //     const householdEamClass = await this.eamClassification(householdLm1, householdLm2, householdLm3, householdLm4, householdExpenseRatio);
  //    const msmeScore = ((grossProfitEamClass.score * 0.35) + (netMarginEamClass.score * 0.35) + (householdEamClass.score * 0.3)) * 100;
  //   let recommended = await this.recommendationV2(msmeScore, strategy, amount, tenure);
  //   const { reason, message, recommendation, schedule } = await this.finalDecisionV2(clientId, email, crcReport,
  //      recommended, msmeScore, score, monthlyHouseholdSurplus, amount, name);
  //    recommended = recommendation;

  //    const registerLoan = await Loan.updateOne({ _id }, {
  //       userId, mobileNumber, channel, applicationStatus: "pending", offerAccepted: false, reason,
  //     actionBy: "system", userRequest: {
  //      economicActivityOther, name, dateOfBirth, address, email, area, postalCode, economicActivity, rankOfSales,
  //        monthlySales, amount, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  //       houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  //      educationLevel, businessLocation, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth, bvn,
  //     economicSector, grossMargin, noOfDependent, houseOwnership
  //   }, loanCompute: {
  //    crcReport: crcReport.data, genderScore, maritalScore, educationScore, establishmentScore, licenseScore,
  //    knowAMFBScore, ageScore, timeAtLocationScore, businessActivityScore, model, probability, score, scoreEmployedGrade,
  //    strategy, grossProfit, totalOpsExpenses, netProfit, monthlyHouseholdSurplus, adjmonthlyHouseholdSurplus,
  //     grossProfitMargin, netMargin, householdExpenseRatio, operationExpenseRatio, ecoActivityLimits,
  //     grossProfitEamClass, netMarginEamClass, householdEamClass, msmeScore, grossMarginRange
  //        }, schedule, recommended
  //     });
  //      if (!registerLoan) return this.preconditionFailed("Application was not recorded, please try again shortly");
  //    await User.updateOne({ "loanDropOff.loanId": _id }, { $unset: { loanDropOff: 1 } })
  //    clientId.hostname == "api.accionmfb.com" && await new EmailService().zohoMail(clientId, "digitalloanalerts@accionmfb.com", "loan-notification", { name, mobileNumber, process: "Automatic", amount }, "New Loan Request Alert");
  //    return this.successResponse(message, { recommended, schedule, loanId: registerLoan._id });
  /// /   } catch (error) {
  //    return this.serviceErrorHandler(clientId, error);
  //    }
  //   }

  // public processRequestLoan2 = async (clientId, body): Promise<IResponse> => {
  //  const { monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses, otherIncome,
  //   address, houseHoldExpenses, economicActivity, rankOfSales, gender, economicActivityOther, maritalStatus,
  //   educationLevel, businessLocation, amount, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  //  businessActivity, userId, bvn, name, dateOfBirth, tenure, mobileNumber, email, area, postalCode,
  //   businessActivityOther, economicSector, channel, grossMargin, noOfDependent, houseOwnership } = body;
  //try {
  //  if (amount > 150000) {
  //   new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
  //   await Loan.create({
  //    userId, mobileNumber, channel, applicationStatus: "pending",
  //    userRequest: {
  //      economicActivityOther, name, dateOfBirth, mobileNumber, address, email, area, postalCode, economicActivity,
  //      rankOfSales, monthlySales, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  //      houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  //     educationLevel, businessLocation, amount, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth,
  //      bvn, userId, economicSector, grossMargin, noOfDependent, houseOwnership
  //    }, reason: "Loan request above 150,000 naira", actionBy: "system"
  //   });
  //   return this.successResponse("Your loan request has been registered, you will receive a call from us soon");
  //   }
  //  const crcReport = await this.processCrcReport(clientId, bvn, address);
  // const genderScore = await this.genderScore(gender);
  // const maritalScore = await this.maritialScore(maritalStatus);
  //    const educationScore = await this.educationScore(educationLevel);
  //    const establishmentScore = await this.establishmentScore(businessLocation);
  //   const licenseScore = await this.licenseScore(validBusinessLicense);
  //  const knowAMFBScore = await this.knowAMFBScore(knowAMFB);
  //  const ageScore = await this.ageScore(age);
  //   const timeAtLocationScore = await this.timeAtLocationScore(timeAtLocationinMnth);
  //    const businessLocationScore = await this.businessLocationScore(businessLocation);
  //    const model = 3.3756 + genderScore + maritalScore + educationScore + establishmentScore +
  //   licenseScore + knowAMFBScore + ageScore + timeAtLocationScore + businessLocationScore;
  //  const probability = (1 / (1 + Math.exp(-model)));
  //     const score = probability * 1000;
  //     const scoreGrade = await this.scoreEmployedGrading(score);
  //    const strategy = await this.getStrategy(scoreGrade);
  //    const grossProfit = monthlySales - costOfGoods;
  //   const totalOpsExpenses = monthlyFixedExpenses + monthlyVarExpenses + otherFinancialExpenses;
  //     const netProfit = grossProfit - totalOpsExpenses;
  //    const monthlyHouseholdSurplus = netProfit + otherIncome - houseHoldExpenses;
  //     const adjmonthlyHouseholdSurplus = 0.65 * monthlyHouseholdSurplus;
  //     const grossProfitMargin = grossProfit / monthlySales;
  //    const grossMarginRange = await this.grossMarginRange(grossProfitMargin);
  //    const netMargin = netProfit / monthlySales;
  //   const householdExpenseRatio = houseHoldExpenses / monthlySales;
  //    const operationExpenseRatio = totalOpsExpenses / monthlySales;
  //    const ecoActivityLimits: any = await EconomicActivity.findOne({ economicActivity, rankOfSales });
  //    const { grossMarginLimits, netMarginLimits, householdExpenseRatioLimits } = ecoActivityLimits;
  //   const { limit1: grossLm1, limit2: grossLm2, limit3: grossLm3, limit4: grossLm4 } = grossMarginLimits;
  //  const { limit1: netLm1, limit2: netLm2, limit3: netLm3, limit4: netLm4 } = netMarginLimits;
  //   const { limit1: householdLm1, limit2: householdLm2, limit3: householdLm3, limit4: householdLm4 } = householdExpenseRatioLimits;
  //   const grossProfitEamClass = await this.eamClassification(grossLm1, grossLm2, grossLm3, grossLm4, grossProfitMargin);
  //  const netMarginEamClass = await this.eamClassification(netLm1, netLm2, netLm3, netLm4, netMargin)
  //  const householdEamClass = await this.eamClassification(householdLm1, householdLm2, householdLm3, householdLm4, householdExpenseRatio);
  //   const msmeScore = ((grossProfitEamClass.score * 0.35) + (netMarginEamClass.score * 0.35) + (householdEamClass.score * 0.3)) * 100;
  // let recommended = await this.recommendationV2(msmeScore, strategy, amount, tenure);
  //    const { reason, message, recommendation, schedule } = await this.finalDecisionV2(clientId, email, crcReport,
  //      recommended, msmeScore, score, monthlyHouseholdSurplus, amount, name);
  //   recommended = recommendation;

  //   const registerLoan = await Loan.create({
  //    userId, mobileNumber, channel, applicationStatus: "pending", offerAccepted: false, reason,
  //   actionBy: "system", userRequest: {
  //     economicActivityOther, name, dateOfBirth, address, email, area, postalCode, economicActivity, rankOfSales,
  //    monthlySales, amount, costOfGoods, monthlyFixedExpenses, monthlyVarExpenses, otherFinancialExpenses,
  //    houseHoldExpenses, otherIncome, businessActivity, businessActivityOther, gender, maritalStatus,
  //    educationLevel, businessLocation, tenure, validBusinessLicense, knowAMFB, age, timeAtLocationinMnth, bvn,
  //    economicSector, grossMargin, noOfDependent, houseOwnership
  //   }, loanCompute: {
  //    crcReport: crcReport.data, genderScore, maritalScore, educationScore, establishmentScore, licenseScore,
  //    knowAMFBScore, ageScore, timeAtLocationScore, businessLocationScore, model, probability, score, scoreGrade,
  //    strategy, grossProfit, totalOpsExpenses, netProfit, monthlyHouseholdSurplus, adjmonthlyHouseholdSurplus,
  //    grossProfitMargin, netMargin, householdExpenseRatio, operationExpenseRatio, ecoActivityLimits,
  //     grossProfitEamClass, netMarginEamClass, householdEamClass, msmeScore, grossMarginRange
  //   }, schedule, recommended
  //  });
  //  if (!registerLoan) return this.failureResponse("Application was not recorded, please try again shortly");
  //  return this.successResponse(message, { recommended, schedule, loanId: registerLoan._id });
  //  } catch (error) {
  //   return this.serviceErrorHandler(clientId, error);
  //  }
  // }

  public finalDecision = async (clientId, email: string, crcReport, recommended, msmeScore, score,
    monthlyHouseholdSurplus, amount, name) => {
    const crReport = crcReport.data.allGood;
    const { status, message: crMsg } = crReport
    let schedule;
    let reason;
    let message = "Your loan request has been registered, you will receive a call from us soon";
    const { recommendedAmount, recommendedTerm } = recommended;
    if (status == true) {
      if (recommended.process === "automatic") {
        schedule = await this.createSchedule(recommendedAmount, recommendedTerm);
        if (monthlyHouseholdSurplus < schedule.loanSchedule[0].monthlyRepay) {
          new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
          recommended.process = "manual";
          reason = "Household surplus is less than monthly repayment amount"
        } else {
          new EmailService().zohoMail(clientId, email, "loan-success", { userFullName: name, loanAmount: amount },
            "Loan Application");
          message = "Loan application was successful";
          reason = "Requirements were met";
        }
      } else {
        new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
        reason = `Manual Underwriting (msmeScore: ${msmeScore}, score strategy: ${score} )`;
      }
    } else {
      recommended.process = "manual";
      new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
      reason = `Manual Underwriting(${crMsg})`
    }
    return { message, reason, recommendation: recommended, schedule };
  }

  public finalDecisionV2 = async (clientId, email: string, crcReport, recommended, msmeScore, score,
    monthlyHouseholdSurplus, amount, name) => {
    const crReport = crcReport.data.allGood;
    const { status, message: crMsg } = crReport
    let schedule;
    let reason;
    let message = "Your loan request has been registered, you will receive a call from us soon";
    let { recommendedAmount, recommendedTerm } = recommended;
    if (status == true) {
      if (recommended.process === "automatic") {
        schedule = await this.createSchedule(recommendedAmount, recommendedTerm);
        if ((monthlyHouseholdSurplus < schedule.loanSchedule[0].monthlyRepay) && (+recommendedTerm.split(" ")[0] === 3)) {
          const manual = await this.manual(clientId, email, name)
          recommended.process = manual.process;
          reason = manual.reason;
        } else if ((monthlyHouseholdSurplus < schedule.loanSchedule[0].monthlyRepay) && (+recommendedTerm.split(" ")[0] === 1)) {
          const recommendNewTenure = await this.recommendNewTenure(recommendedAmount, monthlyHouseholdSurplus,
            clientId, email, amount, "2 Months", name);
          const { status, reason: _reason, message: _message, schedule: _schedule } = recommendNewTenure
          schedule = _schedule;
          recommended.recommendedTerm = "2 Months";
          if (status === true) {
            message = _message;
            reason = _reason;
          } else {
            const recommendNewTenure = await this.recommendNewTenure(recommendedAmount, monthlyHouseholdSurplus,
              clientId, email, amount, "3 Months", name);
            const { status, reason: _reason, message: _message, schedule: _schedule } = recommendNewTenure
            schedule = _schedule;
            recommended.recommendedTerm = "3 Months";
            if (status === true) {
              message = _message;
              reason = _reason;
            } else {
              const manual = await this.manual(clientId, email, name)
              recommended.process = manual.process;
              reason = manual.reason;
            }
          }
        } else if ((monthlyHouseholdSurplus < schedule.loanSchedule[0].monthlyRepay) && (+recommendedTerm.split(" ")[0] === 2)) {
          const recommendNewTenure = await this.recommendNewTenure(recommendedAmount, monthlyHouseholdSurplus,
            clientId, email, amount, "3 Months", name);
          const { status, reason: _reason, message: _message, schedule: _schedule } = recommendNewTenure
          schedule = _schedule;
          recommended.recommendedTerm = "3 Months";
          if (status === true) {
            message = _message;
            reason = _reason;
          } else {
            const manual = await this.manual(clientId, email, name)
            recommended.process = manual.process;
            reason = manual.reason;
          }
        } else {
          const automatic = await this.automatic(clientId, email, amount, name);
          message = automatic.message;
          reason = automatic.reason;
        }
      } else {
        new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
        reason = `Manual Underwriting (msmeScore: ${msmeScore}, score strategy: ${score} )`;
      }
    } else {
      recommended.process = "manual";
      new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
      reason = `Manual Underwriting(${crMsg})`
    }
    return { message, reason, recommendation: recommended, schedule };
  }

  public recommendNewTenure = async (recommendedAmount, monthlyHouseholdSurplus, clientId, email, amount,
    recommendedTerm, name): Promise<{ reason: string, message: string, status: boolean, schedule: any }> => {
    const schedule = await this.createSchedule(recommendedAmount, recommendedTerm);
    let reason;
    let message;
    let status = false
    if ((monthlyHouseholdSurplus > schedule.loanSchedule[0].monthlyRepay)) {
      const automatic = await this.automatic(clientId, email, amount, name);
      message = automatic.message;
      reason = automatic.reason;
      status = true
    }
    return { reason, message, status, schedule }
  }

  public automatic = async (clientId, email, amount, name): Promise<{ message: string, reason: string }> => {
    new EmailService().zohoMail(clientId, email, "loan-success", { userFullName: name, loanAmount: amount },
      "Loan Application");
    const message = "Loan application was successful";
    const reason = "Requirements were met";
    return { message, reason };
  }

  public manual = async (clientId, email, name): Promise<{ process: string, reason: string }> => {
    new EmailService().zohoMail(clientId, email, "manual", { userFullName: name }, "Loan Application");
    const reason = "Household surplus is less than monthly repayment amount"
    return { process: "manual", reason };
  }


  public processDisburseLoan = async (req): Promise<IResponse> => {
    const { loanId, pin: xpin, drawDownAccount, offerAccepted, rejectionReason, channel } = req.body;
    const _id = Types.ObjectId(loanId);
    try {
      if (offerAccepted) {
        const loan: any = await Loan.findOne({ _id }).lean();
        if (!loan) return this.failureResponse("No loan found");
        let { userId, schedule, recommended, userRequest, createdAt } = loan;
        const isUser = await this.isUser(null, userId);
        if (!isUser.status) return this.failureResponse(isUser.message);
        const { status, data } = isUser;
        const { firstName, lastName, emailAddress, bvn, gender } = data;
        if (!status) return this.failureResponse("User was not found");
        const isValidPin = await bcrypt.compare(xpin, data.pin);
        if (!isValidPin) return this.failureResponse("Wrong pin");
        const customer = await this.customerDetails(drawDownAccount, channel, req.hostname);
        schedule = schedule[0];
        const { recommendedAmount, recommendedTerm } = recommended;
        if (createdAt.toDateString() < new Date().toDateString()) {
          const newSchedule = await this.createSchedule(recommendedAmount, recommendedTerm);
          const loan = await Loan.updateOne({ _id }, { schedule: newSchedule })
          if (!loan) return this.failureResponse("Failed to update schedule");
          schedule = newSchedule;
        }
        const loanSchedule = schedule.loanSchedule;
        const adminFee = schedule.adminFee;
        const insuranceFee = schedule.insuranceFee;
        const totalRepaymentAmount = schedule.totalRepaymentAmount;
        const maturityDate = moment(loanSchedule[loanSchedule.length - 1].dueDate);
        const maturityDateDisburse = maturityDate.format("YYYYMMDD");
        const maturityDateEmail = maturityDate.format("YYYY-MM-DD");
        const valueDate = moment().format('YYYYMMDD');
        const disburseDate = moment().format("YYYY-MM-DD");
        const reqBody = {
          customerId: customer?.customerId, currency: "NGN", valueDate, drawDownAccount, maturityDate: maturityDateDisburse,
          category: "21078", interestRate: `${schedule.interestRate * 100}`, amount: schedule.disburseAmount,
          branchCode: "NG0010074", frequency: loanSchedule.length
        }
        const accionDisburseLoanUrl = `${ACCION_API_URL}/loan/disburseDigitalLoan`;
        const response = await this.apiCall(accionDisburseLoanUrl, reqBody, await this.setHeader(channel), "POST", req.hostname);
        let responseData = await response.json();
        if (!responseData || responseData.responseCode !== "00") return this.failureResponse("Failed to disburse");
        await Loan.findOneAndUpdate({ _id }, {
          disburseId: responseData.contractNumber,
          applicationStatus: "disbursed", offerAccepted
        });
        new EmailService().zohoMail(req, emailAddress, "emailSchedule", {
          userFullname: `${firstName} ${lastName}`,
          address: userRequest.address, disburseId: responseData.contractNumber, loanAmount: recommendedAmount,
          tenure: loanSchedule.length, interest: `${schedule.interestRate * 100}`, bvn, maturityDate: maturityDateEmail,
          valueDate: moment(loanSchedule[0].dueDate).format("YYYY-MM-DD"),
          disburseDate, adminFee, insuranceFee, totalRepaymentAmount, loanSchedule, loanId: _id,
          pronoun: await this.checkGender(gender), accountNumber: drawDownAccount
        },
          `${firstName} ${lastName}, Your Loan has been disbursed!!!`);

        return this.successResponse("Loan disbursed", responseData);
      } else {
        const loan: any = await Loan.findOneAndUpdate({ _id }, {
          rejectionReason, applicationStatus: "rejected",
          offerAccepted, actionBy: "user"
        });
        if (!loan) return this.failureResponse("No loan found");
        return this.successResponse("Offer rejected successfully")
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public createSchedule = async (recommendedAmount: number, recommendedTenure: string) => {
    const loanSetting: any = await FeeSetting.findOne();
    let { interestRate, adminFee, insuranceFee } = loanSetting.loan;
    const disburseAmount = recommendedAmount - (recommendedAmount * (adminFee + insuranceFee));
    adminFee = +(recommendedAmount * adminFee).toFixed(2);
    insuranceFee = +(recommendedAmount * insuranceFee).toFixed(2);
    const tenure = +recommendedTenure.split(" ")[0];
    const formular1 = Math.pow((1 + interestRate), tenure) - 1;
    const formular2 = Math.pow((1 + interestRate), tenure) * interestRate;
    //const monthlyRepay = +(disburseAmount / (formular1 / formular2)).toFixed(2);
    const monthlyRepay = +(recommendedAmount / (formular1 / formular2)).toFixed(2);
    const totalRepaymentAmount = +(monthlyRepay * tenure).toFixed(2);
    const totalInterestAccruable = +(totalRepaymentAmount - disburseAmount).toFixed(2);
    let outstandingBalance = disburseAmount;
    const interest = +(outstandingBalance * interestRate).toFixed(2);
    const principal = +(monthlyRepay - interest).toFixed(2);
    outstandingBalance = +(outstandingBalance - principal).toFixed(2);
    const dueDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    let loanSchedule = [{ interest, principal, monthlyRepay, dueDate, outstandingBalance }];
    for (let i = 0; i < tenure - 1; i++) {
      const interest = +(outstandingBalance * interestRate).toFixed(2);
      const principal1 = +(monthlyRepay - interest).toFixed(2);
      outstandingBalance = +(outstandingBalance - principal1).toFixed(2) < 1 ? 0 : +(outstandingBalance - principal1).toFixed(2);
      const dueDate = new Date(new Date().setMonth(new Date().getMonth() + (2 + i)));
      loanSchedule.push({ interest, principal: principal1, dueDate, monthlyRepay, outstandingBalance })
    }
    return { disburseAmount, totalRepaymentAmount, interestRate, adminFee, insuranceFee, totalInterestAccruable, loanSchedule }
  }

  //private checkCreditRegistry = async (req, crData): Promise<IResponse> => {
  // let reportRetrieved = true
  // try {
  //  if (!crData || crData?.result === "Failed" || crData?.reason === "NO-HIT") {
  //     reportRetrieved = false;
  //   }
  //  return this.successResponse(null, reportRetrieved);
  // } catch (error) {
  //  return this.serviceErrorHandler(req, error);
  //  }
  // }

  public processCrcReportV2 = async (clientId, searchInput: string, inputAddress: string) => {
    // const reqBody = { searchType: "BVN", infoType: "All", searchInput };
    try {
      let allGood = { status: true, message: "" }
      const crcData = { allGood };
      return this.successResponse("Report generated", crcData);
    } catch (error) {
      return this.serviceErrorHandler(clientId, error);
    }
  }



  //public processCrcReport = async (clientId, searchInput: string, inputAddress: string) => {
  //const reqBody = { searchType: "BVN", infoType: "All", searchInput };
  // try {
  //  let accionCrcUrl = `${ACCION_CRC_URL}`;
  //  const response = await this.apiCall(accionCrcUrl, reqBody, this.headers, "POST", clientId.hostname);
  //  let responseData = await response.json();
  // const crCheck = await this.checkCreditRegistry(clientId, responseData);
  // if (crCheck.data === false) return this.successResponse("", { allGood: { status: true, message: "" } });
  // const lastAddress = responseData.address[responseData.address.length - 1];
  // const address = lastAddress?.address.toLowerCase();
  //const levenshteinDistance = this.levenshteinDistance(address, inputAddress.toLowerCase());
  // const addressStability = levenshteinDistance > (address.length / 2) ? 0 : await this.monthDiff(new Date(lastAddress.lastReportedDate), new Date());
  //const facilityCheck = this.facilityCheck(responseData);
  // const enquiryCheck = this.enquiryCheck(responseData);
  //const chequeCheck = this.chequeCheck(responseData);
  //const maxOverdueDaysCheck = this.maxOverdueDaysCheck(responseData);
  //const suitsCheck = this.suitsCheck(responseData);
  //const percentLoanInDeliquency = this.percentLoanInDeliquency(responseData);
  //const percentmaxOverdueAmountCheck = this.percentmaxOverdueAmountCheck(responseData);
  // const maxOverdueFacility = (await this.creditRiskCheck(responseData.creditRisk, "MAX_OVERDUE_FACILITY")).indicatorValue;
  //const firstReportDate = (await this.creditRiskCheck(responseData.creditRisk, "FIRST_REPORTED")).indicatorValue;
  //let allGood = { status: true, message: "" }
  //let checks = {}
  // await Promise.all([facilityCheck, enquiryCheck, chequeCheck, maxOverdueDaysCheck, suitsCheck,
  //percentmaxOverdueAmountCheck, percentLoanInDeliquency])
  //.then(data => {
  //  for (let item of data) {
  //  if (item.status === false) { allGood = { status: false, message: item.message } }
  //  checks = { ...checks, ...item.data }
  //  }
  // })
  //const crcData = { address, addressStability, ...checks, maxOverdueFacility, firstReportDate, allGood };
  // return this.successResponse("Report generated", crcData);
  //} catch (error) {
  //  return this.serviceErrorHandler(clientId, error);
  // }
  // }

  // public getLoanScore = async (registryId) => {
  //   let reqBody = {
  //     SessionCode: SESSION,
  //     AccountOwnerRegistryIDs: registryId,
  //     CreditScoreEnquiryReason: "KYCCheck",
  //     PositiveScoreFactorCount: 0,
  //     NegativeScoreFactorCount: 0,
  //     RetroDate: moment().toISOString(),
  //     ScoreModel: "Consumer",
  //     ScoreType: "Generic",
  //     EnquiryLoanAmount: 0,
  //   };
  //   const getLoanScore = `${BASE_URL}/SMARTScore3/GetScore`;
  //   try {
  //     return await this.getResult(getLoanScore, reqBody)
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  // public checkAccountPerformance = async (registryId, loanAmt) => {
  //   const reqBody = {
  //     SessionCode: SESSION,
  //     AccountOwnerRegistryIDs: registryId,
  //     CreditEnquiryReason: "KYCCheck",
  //     EnquiryLoanAmount: loanAmt,
  //   };
  //   const checkPerformance = `${BASE_URL}/SMARTScore3/IsPerforming`;
  //   try {
  //     return await this.getResult(checkPerformance, reqBody)
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  //public customerReport = async (registryId) => {
  // const reqBody = {
  // SessionCode: SESSION,
  // ReportDataRequest: {
  // AccountOwnerIDs: registryId,
  //  HistoryLengthInMonths: 12,
  // SectorExclusionIDs: "",
  //  IncludeSMARTScore: true,
  // IncludePDFReport: false,
  // Reason: "KYCCheck"
  // }
  // };
  // const customerReport = `${BASE_URL}/Reports/GetData`;
  // try {
  // return await this.getResult(customerReport, reqBody)
  // } catch (error) {
  // return { statusCode: 500, message: "Internal server error", data: null }
  // }
  //}


  // public getSBC = async (accountId, sbcType) => {
  //   let reqBody = {
  //     SessionCode: process.env.SESSION,
  //     AccountOwnerRegistryIDs: accountId,
  //     SBCEnquiryReason: "KYCCheck",
  //     RetroDate: moment().toISOString(),
  //     EnquiryLoanAmount: 0,
  //     SBCs: sbcType,
  //   };

  //   const getSBC = `${BASE_URL}/SMARTScore3/GetSBC`;
  //   try {
  //     return await this.getResult(getSBC, reqBody)
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  // public getAccountStatusSummary = async (registryId, loanAmt) => {
  //   let reqBody = {
  //     SessionCode: SESSION,
  //     AccountOwnerRegistryIDs: registryId,
  //     CreditEnquiryReason: "KYCCheck",
  //     EnquiryLoanAmount: loanAmt,
  //   };
  //   const getAccountStatusSummary = `${BASE_URL}/SMARTScore3/GetAccountStatusSummary`;
  //   try {
  //     return await this.getResult(getAccountStatusSummary, reqBody)
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  // public getSBCDefinition = async () => {
  //   const reqBody = { SessionCode: SESSION };
  //   const getSBCDefinition = `${BASE_URL}/SMARTScore3/GetSBCDefinition`;
  //   try {
  //     return await this.getResult(getSBCDefinition, reqBody)
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  //public findCustomerByBvn = async (bvn,reqBody) => {

  //  const getCustomerByBVN = `${BASE_URL}/Customers/FindByBVN2`;
  // try {
  //  return await this.getResult(getCustomerByBVN, reqBody,bvn);
  // } catch (error) {
  //  return { StatusCode: 500, message: "Internal server error", data: null }
  // }
  // }

  // public findCustomerSummary = async (search) => {
  //   let reqBody = {
  //     MaxRecords: 0,
  //     MinRelevance: 0,
  //     SessionCode: SESSION,
  //     CustomerQuery: search,
  //   };
  //   const findSummary = `${BASE_URL}/Customers/FindSummary`;
  //   try {
  //     return await this.getResult(findSummary, reqBody);
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }

  // public findCustomer = async (query) => {
  //   let reqBody = {
  //     MaxRecords: 0,
  //     MinRelevance: 0,
  //     SessionCode: process.env.SESSION,
  //     CustomerQuery: query,
  //   };
  //   const find = `${BASE_URL}/Customers/Find`;
  //   try {
  //     return await this.getResult(find, reqBody);
  //   } catch (error) {
  //     return { statusCode: 500, message: "Internal server error", data: null }
  //   }
  // }
  public getCustomerCreditReport = async (req: any): Promise<any> => {
    try {
      const { bvn } = req.body
      const loginData = await this.login()
      const endPoint = `${BASE_URL}/Customers/FindByBVN2`;

      if (loginData && loginData !== "An error occurred") {
        const requestBody = { MaxRecords: 0, MinRelevance: 0, BVN: bvn, SessionCode: loginData }
        const response = await this.apiCall(endPoint, requestBody, { "Content-Type": "application/json" }, 'POST');
        const responseData = await response.json();
        const RegistryID = responseData.SearchResult.RegistryID

        if (RegistryID) {
          const reqBody = {
            SessionCode: loginData,
            ReportDataRequest: {
              AccountOwnerIDs: RegistryID,
              HistoryLengthInMonths: 12,
              SectorExclusionIDs: "",
              IncludeSMARTScore: true,
              IncludePDFReport: false,
              Reason: "KYCCheck"
            }
          };
          const customerReport = `${BASE_URL}/Reports/GetData`;
          const newResponse = await this.apiCall(customerReport, reqBody, { "Content-Type": "application/json" }, 'POST');
          const newResponseData = await newResponse.json();

          return newResponseData.PerformanceSummary;
        }
      } else if (loginData && loginData === "An error occurred") {
        return { statusCode: 401, message: "Authentication failed", data: null }
      } else {
        return { statusCode: 400, message: loginData, data: null }
      }
    } catch (error) {
      return { statusCode: 500, message: "Internal server error", data: null }
    }
  }

  public login = async () => {
    const authBody = {
      EmailAddress: EmailAddress,
      Password: CRED_PASSWORD,
      SubscriberID: SUB_ID,
    };
    console.log(authBody)
    const login = `${BASE_URL}/Agents/Login`
    console.log(login)
    try {

      const response = await this.apiCall(login, authBody, { "Content-Type": "application/json" }, 'POST')
      const responseData = await response.json()
      const SESSION = responseData.SessionCode
      return SESSION
    } catch (error) {
      return "An error occurred"
    }
  };

  
  
}
