import { UniversalsService } from '../../@core/common/universals.service';
import { EmailService } from '../email/email.service';
import { IResponse } from '../account/account.interface';

interface IRecommendation {
  process: string,
  recommendedAmount: number,
  recommendedTerm: string
}

interface ICreditRisk {
  indicatorValue: string,
  indicatorDescription: string,
  indicatorType: string
}
export class BaseLoanService extends UniversalsService {
  protected scoreSelfEmployedGrading = async (score): Promise<string> => {
    // if (score >= 45 && score <= 73) {
    if (score >= 45 && score <= 73) {
      return "good";
    } else {
      return "bad";
    }
  }

  protected scoreEmployedGrading = async (score): Promise<string> => {
    // if (score >= 45 && score <= 73) {
    if (score >= 60 && score <= 80) {
      return "good";
    } else {
      return "bad";
    }
  }


  protected businessLocationScore = async (businessLocation): Promise<number> => {
    if (businessLocation === "Shopping mall") {
      return 0.07;
    } else if (businessLocation === "Market place") {
      return 0.05;
    } else if (businessLocation === "Road side") {
      return 0.01;
    }
    else if (businessLocation === "Residential area") {
      return 0.07;
    } else {
      return 0;
    }
  }

  protected monthlyTurnOver = async(monthlyTurnOver): Promise<number> =>{
    
    return parseFloat(monthlyTurnOver) * 0.3;


  }

  protected monthlySalary = async(monthlySalary): Promise<number> =>{
    
    return parseFloat(monthlySalary) * 0.25;
  }

protected crcStatus = async(crcStatus): Promise<number> =>{
  if (crcStatus === "Good") {
    return 0.08;
  } else if (crcStatus === "Bad") {
    return 0;
  } else {
    return 0.05;
  }
}


  protected residentialStatus = async (residentialStatus): Promise<number> => {
    if (residentialStatus === "Rented") {
      return 0.03;
    } else if (residentialStatus === "Owned") {
      return 0.08;
    } else {
      return 0;
    }
  }


  protected BusinessResidentialStatus = async (BusinessResidentialStatus): Promise<number> => {
    if (BusinessResidentialStatus === "Rented") {
      return 0.03;
    } else if (BusinessResidentialStatus === "Owned") {
      return 0.07;
    } else {
      return 0;
    }
  }

  protected natureOfBusiness = async (natureOfBusiness): Promise<number> =>{
    if(natureOfBusiness === "Pharmacy"){
      return 0.06;
    }else if(natureOfBusiness === "Boutique"){
      return 0.03
    }else{
      return 0;
    }
  }

  protected employementType = async (employementType): Promise<number> => {
    if (employementType === "Private") {
      return 0.10;
    } else if (employementType === "Government") {
      return 0.06;
    } else {
      return 0;
    }
  }

  protected employeeReferer = async (employeeReferer): Promise<number> => {
    if (employeeReferer === "Yes") {
      return 0.08;
    } else if (employeeReferer === "No") {
      return 0.04;
    } else {
      return 0;
    }
  }

  protected businessReferral = async (businessReferer): Promise<number> => {
    if (businessReferer === "Yes") {
      return 0.04;
    } else if (businessReferer === "No") {
      return 0;
    } else {
      return 0;
    }
  }



  protected timeAtLocationScore = async (timeAtLocationinMnth): Promise<number> => {
    if (timeAtLocationinMnth <= 25) {
      return -0.5839;
    } else if (timeAtLocationinMnth > 25 && timeAtLocationinMnth <= 127) {
      return -0.3124;
    } else {
      return 0;
    }
  }

  protected ageScore = async (age): Promise<number> => {
    if (age >= 25 && age <= 30) {
      return 0.03;
    } else if (age >= 31 && age <= 45) {
      return 0.07;
    }else if (age >= 46 && age <= 55) {
      return 0.09;
  }else{
    return 0;
  }
}

  protected knowAMFBScore = async (knowAMFB): Promise<number> => {
    return knowAMFB === "loan officer" ? 0.3872 : 0;
  }

  protected licenseScore = async (validLicense): Promise<number> => {
    return validLicense !== null ? 0.08 : 0;
  }

  protected establishmentScore = async (establishmentType): Promise<number> => {
    return establishmentType === "independent establishment" ? 0.3481 : 0;
  }

  protected educationScore = async (educationLevel): Promise<number> => {
    if (educationLevel === "graduate") {
      return 0.08;
    } else if (educationLevel === "secondary") {
      return 0.03;
    } else {
      return 0.03;
    }
  }

  protected maritialScore = async (maritalStatus): Promise<number> => {
    if (maritalStatus === "Married") {
      return 0.08;
    } else if (maritalStatus === "Single") {
      return 0.05;
    } else {
      return 0;
    }
  }
  

  protected genderScore = async (gender): Promise<number> => {
    return gender === "Female" ? 0.06 : 0.04;
  }


  protected recommendation = async (msmeScore: number, strategy: string, surplus: number): Promise<IRecommendation> => {
    if ((msmeScore >= 700) && (strategy === "aa" || strategy === "a")) {
      return { process: "automatic", recommendedAmount: 0.65 * surplus, recommendedTerm: "3 months" }
    } else if ((msmeScore >= 500 && msmeScore < 700) && (strategy === "aa" || strategy === "a")) {
      return { process: "automatic", recommendedAmount: 0.50 * surplus, recommendedTerm: "2 months" }
    } else if (msmeScore < 500 && (strategy === "aa" || strategy === "a")) {
      return { process: "manual", recommendedAmount: 0.40 * surplus, recommendedTerm: "1 month" }
    } else if (strategy === "b") {
      return { process: "manual", recommendedAmount: 0, recommendedTerm: "" }
    } else {
      return { process: "", recommendedAmount: 0, recommendedTerm: "" }
    }
  }

  protected checkGender = async (gender: string) => {
    return gender.toLowerCase() === "m" ? "his" : "her";
  }

  protected recommendationV2 = async (msmeScore: number, strategy: string, recommendedAmount: number,
    recommendedTerm: string): Promise<IRecommendation> => {
    if ((msmeScore >= 500) && (strategy === "aa" || strategy === "a")) {
      return { process: "automatic", recommendedAmount, recommendedTerm }
    } else {
      return { process: "manual", recommendedAmount, recommendedTerm }
    }
  }

  protected mapRecommended = async (req, email, userFullName, amount: number, tenure: string, recommended: IRecommendation): Promise<IRecommendation> => {
    const { process, recommendedAmount, recommendedTerm } = recommended;
    if (process === "" || process === "manual") {
      return { process, recommendedAmount, recommendedTerm };
    };
    if (recommendedAmount > amount && +recommendedTerm.split(" ")[0] < +tenure.split(" ")[0]) {
      new EmailService().sendEmailLoan(req, email, "loan-success", { userFullName, loanAmount: amount }, "Loan Application");
      return { process, recommendedAmount: amount, recommendedTerm }
    } else if (recommendedAmount < amount && +recommendedTerm.split(" ")[0] > +tenure.split(" ")[0]) {
      if (recommendedAmount < 50000) {
        new EmailService().sendEmailLoan(req, email, "newAmount", { userFullName, loanAmount: "50,000", loanOffer: recommendedAmount }, "Loan Application");
        return { process, recommendedAmount, recommendedTerm: tenure }
      };
      new EmailService().sendEmailLoan(req, email, "newAmount", { userFullName, loanAmount: recommendedAmount, loanOffer: recommendedAmount }, "Loan Application");
      return { process, recommendedAmount, recommendedTerm: tenure }
    } else if (recommendedAmount < amount && +recommendedTerm.split(" ")[0] <= +tenure.split(" ")[0]) {
      if (recommendedAmount < 50000) {
        return { process, recommendedAmount, recommendedTerm: tenure };
      }
      new EmailService().sendEmailLoan(req, email, "newAmount", { userFullName, loanAmount: recommendedAmount, loanOffer: recommendedAmount }, "Loan Application");
      return { process, recommendedAmount, recommendedTerm }
    } else {
      new EmailService().sendEmailLoan(req, email, "loan-success", { userFullName, loanAmount: amount }, "Loan Application");
      return { process, recommendedAmount: amount, recommendedTerm: tenure }
    }
  }

  // protected selected

  protected eamClassification = async (limit1, limit2, limit3, limit4, ecoLimit): Promise<{ class: string, score: number }> => {
    const ecoLimitFmtd: number = ecoLimit * 100
    if ((ecoLimitFmtd >= limit2) && (ecoLimitFmtd <= limit3)) {
      return { class: "typical", score: 10 }
    } else if (((ecoLimitFmtd >= limit1) && (ecoLimitFmtd < limit2)) || ((ecoLimitFmtd > limit3) && (ecoLimitFmtd <= limit4))) {
      return { class: "neutral", score: 5 };
    } else {
      return { class: "atypical", score: 1 }
    }
  }

  protected grossMarginRange = async (grossProfitMargin: number): Promise<string> => {
    grossProfitMargin *= 100
    if (grossProfitMargin < 5) {
      return "<5%"
    } else if ((grossProfitMargin >= 5) && (grossProfitMargin <= 10)) {
      return "5-10%"
    } else if ((grossProfitMargin >= 11) && (grossProfitMargin <= 15)) {
      return "11-15%"
    } else if ((grossProfitMargin >= 16) && (grossProfitMargin <= 20)) {
      return "16-20%"
    } else if ((grossProfitMargin >= 21) && (grossProfitMargin <= 28)) {
      return "21-28%"
    } else if ((grossProfitMargin >= 29) && (grossProfitMargin <= 35)) {
      return "29-35%"
    } else {
      return ">35%"
    }
  }



  protected creditRiskCheck = async (creditRisk, indicatorType): Promise<ICreditRisk> => {
    let creditRiskData;
    for (let data of creditRisk) {
      if (data.indicatorType === indicatorType) {
        creditRiskData = data;
      }
    }
    return creditRiskData;
  }
 
  protected _calculateAge(birthday) { // birthday is a date
    //console.log(Date.now())
  const age =  new Date(Date.now()).getFullYear() - new Date(birthday).getFullYear()
  //console.log(age)
  return age;
  
}

  protected monthDiff = async (d1: Date, d2: Date) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  protected getStrategy = async (scoreGrade) => {
    if (scoreGrade === ("grade i" || "grade ii")) {
      return "aa";
    } else if (scoreGrade === "grade iii") {
      return "a";
    } else {
      return "b";
    }
  }

  protected percentmaxOverdueAmountCheck = async (responseData): Promise<IResponse> => {
    const performanceSummary = responseData.performanceSummary[0];
    const { overdueAmount, accountBalance } = performanceSummary;
    const percentMaxOverdueAmount = overdueAmount / accountBalance;
    return this.successResponse("", { percentMaxOverdueAmount });
  }

  protected percentLoanInDeliquency = async (responseData): Promise<IResponse> => {
    const percentLoanInDeliquency = responseData.performanceSummary[0];
    const { nonPerformingFacility, facilityCount } = percentLoanInDeliquency;
    const percentMaxOverdueAmount = nonPerformingFacility / facilityCount;
    return this.successResponse("", { percentMaxOverdueAmount });
  }

  protected facilityCheck = async (responseData): Promise<IResponse> => {
    const nonPerformingFacility = +responseData.performanceSummary[0].nonPerformingFacility;
    const overdueAmount = +responseData.performanceSummary[0].overdueAmount;
    if (nonPerformingFacility == 0 && overdueAmount == 0) return this.successResponse("", {
      nonPerformingFacility, overdueAmount
    });
    return this.failureResponse("Bureau check showed that customer has a non performing loan", {
      nonPerformingFacility, overdueAmount
    });
  }

  protected chequeCheck = async (responseData): Promise<IResponse> => {
    const numberOfDishouredCheques = +(await this.creditRiskCheck(responseData.creditRisk, "CHEQUE_DISHONOURS")).indicatorValue;
    if (numberOfDishouredCheques < 2) return this.successResponse("", { numberOfDishouredCheques });
    return this.failureResponse("Number of dishoured cheque is greater than 1", { numberOfDishouredCheques });
  }

  protected enquiryCheck = async (responseData): Promise<IResponse> => {
    const numberOfEnquiriesL12Mnths = +(await this.creditRiskCheck(responseData.creditRisk, "INQUIRY_COUNT_3M")).indicatorValue;
    const approvedAmount = responseData.performanceSummary[0].approvedAmount;
    if (numberOfEnquiriesL12Mnths >= 8 && (approvedAmount == "NGN 0" || approvedAmount == "NGN0" || approvedAmount == "0")) {
      return this.failureResponse("Exceeded max number enquiries without disbursement", { numberOfEnquiriesL12Mnths, approvedAmount });
    } else {
      return this.successResponse("", { numberOfEnquiriesL12Mnths, approvedAmount });
    }
  }

  protected maxOverdueDaysCheck = async (responseData): Promise<IResponse> => {
    const maxOverdueDays = +(await this.creditRiskCheck(responseData.creditRisk, "MAX_OVERDUE_DAYS")).indicatorValue;
    if (maxOverdueDays <= 60) return this.successResponse("", { maxOverdueDays });
    return this.failureResponse("Maximum number of days overdue in last 12 is greater than 60", { maxOverdueDays });
  }

  protected suitsCheck = async (responseData): Promise<IResponse> => {
    const suitsFiled = +(await this.creditRiskCheck(responseData.creditRisk, "SUITS_FILED")).indicatorValue;
    if (suitsFiled > 0) return this.failureResponse("Suit field is greater than 0", { suitsFiled });
    return this.successResponse("", { suitsFiled });
  }


  protected levenshteinDistance = function (crAddress, inputAddress) {
    if (crAddress.length == 0) return inputAddress.length;
    if (inputAddress.length == 0) return crAddress.length;
    let matrix: any = [];

    // increment along the first column of each row
    let i
    for (i = 0; i <= inputAddress.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    let j
    for (let j = 0; j <= crAddress.length; j++) {
      matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (i = 1; i <= inputAddress.length; i++) {
      for (j = 1; j <= crAddress.length; j++) {
        if (inputAddress.charAt(i - 1) == crAddress.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
            Math.min(matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1)); // deletion
        }
      }
    }

    return matrix[inputAddress.length][crAddress.length];
  };

}
